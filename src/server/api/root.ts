import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { cartRouter } from "./routers/cart";
import { categoriesRouter } from "./routers/categories";
import { checkoutRouter } from "./routers/checkout";
import { dashboardRouter } from "./routers/dashboard/dashboard";
import { ordersRouter } from "./routers/orders";
import { productsRouter } from "./routers/products";
import { reviewsRouter } from "./routers/reviews";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
  cart: cartRouter,
  reviews: reviewsRouter,
  checkout: checkoutRouter,
  orders: ordersRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
