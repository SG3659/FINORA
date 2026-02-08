import apiClient from "@/api/rtkquery/apiClent";

export const authApi = apiClient.injectEndpoints({
   endpoints: (builder) => ({
      register: builder.mutation({
         query: (credentials) => ({
            url: "/register",
            method: "POST",
            body: credentials,
         }),
      }),
      login: builder.mutation({
         query: (credentials) => ({
            url: "/login",
            method: "POST",
            body: credentials,
         }),
      }),
      otpVerify: builder.mutation({
         query: (credentials) => ({
            url: "/otp-verify",
            method: "POST",
            body: credentials,
         }),
      }),

      logout: builder.mutation<void, void>({
         query: () => ({
            url: "/logout",
            method: "POST",
            credentials: "include",
         }),
      }),
      refresh: builder.mutation({
         query: () => ({
            url: "/refresh",
            method: "POST",
         }),
      }),
   }),
});

export const {
   useLoginMutation,
   useOtpVerifyMutation,
   useRegisterMutation,
   useRefreshMutation,
   useLogoutMutation,
} = authApi;