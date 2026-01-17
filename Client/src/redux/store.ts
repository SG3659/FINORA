import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authSlice from "@/redux/slice/authSlice"
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import apiClient from "@/api/rtkquery/apiClent";
const rootReducer = combineReducers({
   [apiClient.reducerPath]: apiClient.reducer,
   auth: authSlice
})
const persistConfig = {
   key: "root",
   storage,
   version: 1,
   blacklist: [apiClient.reducerPath]
};
type RootReducerType = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer)
const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: reduxPersistActions
         },
      }).concat(apiClient.middleware)
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>   