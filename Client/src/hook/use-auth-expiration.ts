import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/redux/hook";
import { useRefreshMutation } from "@/api/auth/authApi";
import { logout, updateCredentials } from "@/redux/slice/authSlice";


const useAuthExpiration = () => {
  const dispatch = useAppDispatch();
  const { refreshToken, expiresAt, refreshExpireAt } = useTypedSelector((state) => state.auth);
  const [refreshExpire] = useRefreshMutation()
  useEffect(() => {
    if (!refreshToken || !expiresAt || !refreshExpireAt) return;
    const handleLogout = () => {
      console.log("Token expired, logging out...");
      dispatch(logout());
    };
    if (refreshExpireAt && Date.now() >= new Date(refreshExpireAt).getTime()) {
      console.log("Refresh token expired, logging out...");
      handleLogout();
      return;
    }


    const expiresIn = new Date(expiresAt).getTime() - Date.now();

    const refreshTimeout = setTimeout(async () => {
      try {
        const {
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
          refreshExpiresAt: newRefreshExpiresAt,
        } = await refreshExpire({}).unwrap();

        dispatch(
          updateCredentials({
            refreshToken: newRefreshToken,
            expiresAt: newExpiresAt,
            refreshExpiresAt: newRefreshExpiresAt,
          })
        );

        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Token refresh failed", error);
        handleLogout();
      }
    }, Math.max(expiresIn - 60000, 0)); // Refresh 1 minute before expiration
    return () => clearTimeout(refreshTimeout);
  }, [refreshToken, expiresAt, refreshExpireAt, dispatch, refreshExpire]);
}

export default useAuthExpiration
