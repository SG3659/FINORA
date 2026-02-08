import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { NuqsAdapter } from 'nuqs/adapters/react'
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>

      <NuqsAdapter>
        <App />
      </NuqsAdapter>
      <Toaster
        position="bottom-right"
        expand={true}
        duration={3000}
        richColors
        closeButton
      />
    </PersistGate>
  </Provider>
)
