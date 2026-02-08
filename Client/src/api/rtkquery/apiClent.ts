import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { RootState } from "@/redux/store";

const baseQuery = fetchBaseQuery({
   baseUrl: import.meta.env.VITE_API_BASE_URL,
   credentials: "include",
})

const apiClient = createApi({
   reducerPath: "api",
   baseQuery: baseQuery,
   refetchOnMountOrArgChange: true, // Refetch on mount or arg change
   tagTypes: ["transactions", "analytics", "billingSubscription"], // Tag types for RTK Query
   endpoints: () => ({}), // Endpoints for RTK Query
})

export default apiClient
