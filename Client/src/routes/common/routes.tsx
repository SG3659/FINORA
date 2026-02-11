import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import Transactions from "@/pages/transections";
import Reports from "@/pages/reports"
import Dashboard from "@/pages/dashboard";
import Analyse from "@/pages/analyse"
export const authRoutes = [
      { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
      { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
]

export const protectedRoutes = [
      { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
      { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
      { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
      { path: PROTECTED_ROUTES.ANALYSE, element: <Analyse /> },


]