import ReceiptEmail from "@/components/emails/receipt-email";
import { env } from "@/env";
import type { Address, ExtraAddition } from "@/lib/types";
import { mergeCounts } from "@/lib/utils";
import { db } from "@/server/db";
import { resend } from "@/server/resend";
import { stripe } from "@/server/stripe";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const headersList = headers();
  const sig = headersList.get("stripe-signature")!;
  let event;
  console.log("stripe sig", sig);

  try {
    const reqBuffer = await req.text();
    console.log("stripe req", reqBuffer);
    const signSecret = env.STRIPE_WEBHOOK_KEY;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.log("stripe error", e);
    return new Response(`Webhook error: ${e}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const orderId = event?.data?.object?.metadata?.orderId;
    const checkoutStatus = event?.data?.object?.metadata?.checkout;
    const isPaid = event?.data?.object?.payment_status === "paid";
    const email = event?.data?.object?.customer_email;
    const address = event.data.object.customer_details?.address;
    if (isPaid) {
      const soldItems = await db.order.findUnique({
        where: { id: orderId },
        select: { items: { select: { productId: true, quantity: true } } },
      });
      const order = await db.order.update({
        where: { id: orderId },
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
        data: { status: "PAID", address: JSON.stringify(address) },
      });
      if (checkoutStatus === "new") {
        await db.user.update({
          where: { email: email! },
          data: { CartItems: { deleteMany: {} } },
        });
      }

      const { error } = await resend.emails.send({
        from: "Yummy <onboarding@resend.dev>",
        // to: [order.user?.email ?? order.customerEmail],
        to: "mahmoud.elsayed.elbadawy@gmail.com",
        subject: "Your order has been confirmed",
        react: ReceiptEmail({
          userName: order.user?.name ?? order.customerName,
          order: {
            ...order,
            address: order.address
              ? (JSON.parse(order.address as string) as Address)
              : undefined,
            items: order.items.map((item) => {
              return {
                ...item,
                additions: item.additions
                  ? (JSON.parse(item.additions as string) as ExtraAddition[])
                  : [],
              };
            }),
          },
        }),
      });
      if (error) {
        console.log("Error sending email:", error);
      }

      const mergedCounts = mergeCounts(soldItems?.items ?? []);
      await db.$transaction(
        mergedCounts.map((product) =>
          db.product.update({
            where: { id: product.productId },
            data: { sold: { increment: product.quantity } },
          }),
        ),
      );
    }
    revalidatePath("/");
  }

  return new Response("Success", {
    status: 200,
  });
}
