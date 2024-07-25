import bcrypt from "bcrypt";
import { z } from "zod";

import ResetPasswordEmail from "@/components/emails/reset-pw-email";
import {
  changePwServerSchema,
  createUserServerSchema,
  resetPwServerSchema,
  updateUserServerSchema,
} from "@/lib/validations-schema/user-schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { emailRatelimit, ipRatelimit } from "@/server/rate-limiter";
import { resend } from "@/server/resend";
import { utapi } from "@/server/uploadthing";
import { type Role } from "@prisma/client";

import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { formatDistanceToNow } from "date-fns";

export const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(createUserServerSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password, userName } = input;
      const locale = ctx.locale;
      try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
          email,
          password: hashedPassword,
          image: null,
          emailVerified: null,
          role: "USER" as Role,
          name: userName,
          status: "ACTIVE" as const,
        };

        await ctx.db.user.create({ data: newUser });

        return { success: true };
      } catch (error: any) {
        // Log error for debugging purposes
        console.log("Error in create user :", error);

        // Handle known errors
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              locale === "en"
                ? "Email already exists"
                : "البريد الالكتروني موجود بالفعل",
          });
        }

        // Handle unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
  resetPassword: publicProcedure
    .input(resetPwServerSchema)
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      try {
        const { email } = input;

        const ip = ctx.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const userAgent = ctx.headers.get("user-agent");

        // IP rate limiting
        const { success: ipSuccess, reset: ipReset } = await ipRatelimit.limit(
          `${ip}:${userAgent}`,
        );
        if (!ipSuccess) {
          const resetDate = new Date(ipReset);
          const resetMessage = formatDistanceToNow(resetDate);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `${locale === "en" ? "Too many requests. Please try again in" : "لقد تجاوزت الحد الأقصى للطلبات. الرجاء المحاولة مرة أخرى بعد"} ${resetMessage}`,
          });
        }

        // Email rate limiting
        const { success: emailSuccess, reset: emailReset } =
          await emailRatelimit.limit(email);
        if (!emailSuccess) {
          const resetDate = new Date(emailReset);
          const resetMessage = formatDistanceToNow(resetDate);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `${locale === "en" ? "Too many requests. Please try again in" : "لقد تجاوزت الحد الأقصى للطلبات. الرجاء المحاولة مرة أخرى بعد"} ${resetMessage}`,
          });
        }

        // Special case for specific email
        if (email === "aadmin@yummy.com") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${locale === "en" ? "Cannot reset password for this email" : "لا يمكن إعادة تعيين كلمة المرور لهذا البريد الإلكتروني"}`,
          });
        }

        // Find user by email
        const user = await ctx.db.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid email",
          });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("base64url");
        const today = new Date();
        const expiryDate = new Date(today.setDate(today.getDate() + 1)); // 24 hours from now

        // Create verification token
        await ctx.db.$transaction([
          ctx.db.verificationToken.deleteMany({
            where: {
              OR: [{ expires: { lt: today } }, { identifier: email }],
            },
          }),
          ctx.db.verificationToken.create({
            data: {
              identifier: email,
              expires: expiryDate,
              token: resetPasswordToken,
            },
          }),
        ]);

        // Send reset email
        const { error } = await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: [user.email],
          subject: "Reset your password",
          react: ResetPasswordEmail({
            userName: user.name ?? user.email,
            token: resetPasswordToken,
          }),
        });

        if (error) {
          console.log("Error sending email:", error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
          });
        }

        return { success: true };
      } catch (error) {
        // Log error for debugging purposes
        console.log("Error in resetPassword procedure:", error);

        // Handle known TRPC errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
  changePassword: publicProcedure
    .input(changePwServerSchema)
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      try {
        const { password, resetPasswordToken } = input;

        // Find the verification token
        const verificationToken = await ctx.db.verificationToken.findUnique({
          where: {
            token: resetPasswordToken,
          },
        });

        if (!verificationToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${locale === "en" ? "Invalid token" : "رمز التحقق غير صالح"}`,
          });
        }

        // Check if the token has expired
        const { expires } = verificationToken;
        const today = new Date();
        if (today > expires) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${locale === "en" ? "Expired token" : "انتهت صلاحية رمز التحقق"}`,
          });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password and email verification status
        const user = await ctx.db.user.update({
          where: {
            email: verificationToken.identifier,
          },
          data: {
            password: hashedPassword,
            emailVerified: new Date(),
          },
        });

        // Delete the used token if the user update was successful
        if (user) {
          await ctx.db.verificationToken.delete({
            where: {
              token: resetPasswordToken,
            },
          });
        }

        return { success: true };
      } catch (error) {
        // Log error for debugging purposes
        console.log("Error in changePassword procedure:", error);

        // Handle known TRPC errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
  updateUser: protectedProcedure
    .input(updateUserServerSchema)
    .mutation(async ({ ctx, input }) => {
      const { locale } = ctx;
      try {
        const existingUser = await ctx.db.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
        });

        if (!existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${locale === "en" ? "User not found" : "المستخدم غير موجود"}`,
          });
        }

        if (ctx.session.provider === "credentials") {
          const isPasswordValid = await bcrypt.compare(
            input.currentPassword,
            existingUser.password!,
          );

          if (!isPasswordValid) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `${locale === "en" ? "Invalid current password" : "كلمة المرور الحالية غير صحيحة"}`,
            });
          }
        }

        const data: Partial<typeof existingUser> = {};
        if (input.userName !== existingUser.name) {
          data.name = input.userName;
        }
        if (input.email !== existingUser.email) {
          data.email = input.email;
        }
        if (input.password) {
          data.password = await bcrypt.hash(input.password, 12);
        }
        if (input.deleteImg) {
          data.image = null;
        }
        if (input.image) {
          data.image = input.image.url;
          data.imageKey = input.image.key;
        }

        const updatedUser = await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data,
        });

        if (existingUser.imageKey && (input.deleteImg || input.image)) {
          await utapi.deleteFiles(existingUser.imageKey);
        }

        if (
          ctx.session.provider !== "credentials" &&
          input.provider !== ctx.session.provider
        ) {
          const deleted = await ctx.db.account.deleteMany({
            where: {
              userId: ctx.session.user.id,
            },
          });

          return {
            user: updatedUser,
            provider: deleted.count > 0 ? "credentials" : ctx.session.provider,
          };
        }

        return {
          user: updatedUser,
          provider: ctx.session.provider,
        };
      } catch (error: any) {
        // Log error for debugging purposes
        console.log("Error in updateUser procedure:", error);

        if (input.image) {
          await utapi.deleteFiles(input.image.key);
        }

        // Handle known TRPC errors
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: `${locale === "en" ? "Email already exists" : "البريد الالكتروني موجود بالفعل"}`,
          });
        }

        // Handle unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
  deleteAccount: protectedProcedure
    .input(z.string().optional())
    .mutation(async ({ ctx, input }) => {
      const { locale } = ctx;
      try {
        if (input) {
          const user = await ctx.db.user.findUnique({
            where: {
              id: ctx.session.user.id,
            },
          });

          if (!user) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `${locale === "en" ? "User not found" : "المستخدم غير موجود"}`,
            });
          }

          const isPasswordValid = await bcrypt.compare(user.password!, input);

          if (!isPasswordValid) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `${locale === "en" ? "Invalid password" : "كلمة المرور غير صحيحة"}`,
            });
          }
        }

        // Delete the user account
        await ctx.db.user.delete({
          where: {
            id: ctx.session.user.id,
          },
        });

        // Successful deletion
        return { success: true };
      } catch (error) {
        // Log error for debugging purposes
        console.log("Error in deleteAccount procedure:", error);

        // Handle known TRPC errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
  authChecker: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Find the user
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          status: true,
        },
      });

      return user;
    } catch (error) {
      // Log error for debugging purposes
      console.log("Error in authChecker query:", error);

      // Handle known TRPC errors
      if (error instanceof TRPCError) {
        throw error;
      }

      // Handle unknown errors
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  getPasswordResetToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the verification token
        const verification = await ctx.db.verificationToken.findUnique({
          where: {
            token: input,
          },
        });

        // If verification token not found, throw error
        if (!verification) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid token",
          });
        }

        // Check if the token has expired
        const { expires } = verification;
        const today = new Date();
        if (today > expires) {
          await ctx.db.verificationToken.delete({
            where: {
              token: verification.token,
            },
          });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Token expired",
          });
        }

        // Return the verification token
        return verification;
      } catch (error) {
        // Log error for debugging purposes
        console.log("Error in getPasswordResetToken mutation:", error);

        // Handle known TRPC errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Handle unknown errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
