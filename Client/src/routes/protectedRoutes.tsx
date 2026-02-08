import { useTypedSelector } from "@/redux/hook";
import { AUTH_ROUTES } from "./common/routePath";
import { Navigate, Outlet } from "react-router-dom";

const PROTECTEDROUTE = () => {
   const { user, refreshToken } = useTypedSelector((state) => state.auth)
   if (refreshToken && user) return <Outlet />
   return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />
}
export default PROTECTEDROUTE; 