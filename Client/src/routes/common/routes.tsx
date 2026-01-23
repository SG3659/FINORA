import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import Transactions from "@/pages/transections";
export const authRoutes = [
      { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
      { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
]

export const protectedRoutes = [
      { path: PROTECTED_ROUTES.OVERVIEW, element: <div>Overview Page</div> },
      { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
]