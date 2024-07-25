import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const dashboardUsersRouter = createTRPCRouter({
  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    try {
      const [users, allUsersCount, adminsCount, customersCount, managersCount] =
        await ctx.db.$transaction([
          ctx.db.user.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              image: true,
              status: true,
              _count: {
                select: {
                  orders: true,
                  reviews: true,
                },
              },
            },
          }),
          ctx.db.user.count(),
          ctx.db.user.count({ where: { role: "ADMIN" } }),
          ctx.db.user.count({ where: { role: "USER" } }),
          ctx.db.user.count({ where: { role: "MANAGER" } }),
        ]);
      return {
        users,
        allUsersCount,
        adminsCount,
        customersCount,
        managersCount,
      };
    } catch (error) {
      console.log("Error fetching all users:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  update: adminProcedure
    .input(
      z.object({
        action: z.enum([
          "ADMIN",
          "USER",
          "MANAGER",
          "DELETE",
          "SUSPEND",
          "UNSUSPEND",
        ]),
        id: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      try {
        const { action, id } = input;
        const currentUserRole = ctx.session?.user.role;

        if (currentUserRole === "ADMIN") {
          if (action === "ADMIN" || action === "USER" || action === "MANAGER") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message:
                locale === "en"
                  ? "You don't have permission to modify this user , only manager can change users role"
                  : "ليس لديك صلاحيات للتعديل على هذا المستخدم، فقط المديرين يمكنهم تغيير صلاحيات المستخدمين",
            });
          }
          const users = await ctx.db.user.findMany({
            where: {
              id: {
                in: id,
              },
              role: "USER",
            },
          });
          const usersIds = users.map((user) => user.id);
          if (action === "DELETE") {
            if (usersIds.length === 0) {
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message:
                  locale === "en"
                    ? "Admins can only delete users with role 'USER'"
                    : "يمكن للمشرفين حذف المستخدمين الذين لديهم صلاحيات 'مستخدم' فقط",
              });
            }

            await ctx.db.user.deleteMany({
              where: {
                id: {
                  in: usersIds,
                },
              },
            });
          }

          if (action === "SUSPEND" || action === "UNSUSPEND") {
            if (usersIds.length === 0) {
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: `${
                  locale === "en"
                    ? `Admins can only ${action === "SUSPEND" ? "suspend" : "unsuspend"} users with role 'USER'`
                    : `يمكن للمشرفين ${action === "SUSPEND" ? "تعليق" : "تفعيل"} المستخدمين الذين لديهم صلاحيات 'مستخدم' فقط`
                }`,
              });
            }

            await ctx.db.user.updateMany({
              where: {
                id: {
                  in: usersIds,
                },
              },
              data: {
                status: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE",
              },
            });
          }
        } else if (currentUserRole === "MANAGER") {
          if (action === "DELETE") {
            await ctx.db.user.deleteMany({
              where: {
                id: {
                  in: id,
                },
              },
            });
          } else if (action === "SUSPEND" || action === "UNSUSPEND") {
            await ctx.db.user.updateMany({
              where: {
                id: {
                  in: id,
                },
              },
              data: {
                status: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE",
              },
            });
          } else {
            await ctx.db.user.updateMany({
              where: {
                id: {
                  in: id,
                },
              },
              data: {
                role: action,
              },
            });
          }
        }
      } catch (error) {
        console.log("Error updating users:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            locale === "ar"
              ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا"
              : "Something went wrong, please try again later",
        });
      }
    }),
});

export type UserDetails =
  RouterOutputs["dashboard"]["users"]["getAllUsers"]["users"][number];
export type AllUsers = RouterOutputs["dashboard"]["users"]["getAllUsers"];
