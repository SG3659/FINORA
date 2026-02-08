import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/api/auth/authTyes";
const initialState: AuthState = {
   refreshToken: null,
   expiresAt: null,
   refreshExpireAt: null,
   user: null,
   reportSetting: null,
};
const userSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setCredentials: (state, action) => {
         state.refreshToken = action.payload.refreshToken;
         state.expiresAt = action.payload.expiresAt;
         state.refreshExpireAt = action.payload.refreshExpireAt;
         state.user = action.payload.user;
         state.reportSetting = action.payload.reportSetting;
      },
      updateCredentials: (state, action) => {
         const { refreshToken, expiresAt, refreshExpireAt, user, reportSetting } = action.payload;

         if (refreshToken !== undefined) state.refreshToken = refreshToken;
         if (expiresAt !== undefined) state.expiresAt = expiresAt;
         if (refreshExpireAt !== undefined) state.refreshExpireAt = refreshExpireAt;
         if (user !== undefined) state.user = { ...state.user, ...user };
         if (reportSetting !== undefined)
            state.reportSetting = { ...state.reportSetting, ...reportSetting };
      },
      logout: (state) => {
         state.refreshToken = null;
         state.expiresAt = null;
         state.refreshExpireAt = null;
         state.user = null;
         state.reportSetting = null;
      },
   }
})

export const { setCredentials, updateCredentials, logout } = userSlice.actions;

export default userSlice.reducer;