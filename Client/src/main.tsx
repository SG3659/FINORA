import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>

        <App />
        <Toaster
          position="top-center"
          expand={true}
          duration={5000}
          richColors
          closeButton
        />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
