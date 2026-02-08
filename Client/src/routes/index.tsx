import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { authRoutes, protectedRoutes } from './common/routes'
import AUTHROUTE from "./authRoutes"
import PROTECTEDROUTE from './protectedRoutes'
import AppLayout from '@/layouts/app-layout'
import BaseLayout from '@/layouts/base-layout'
import useAuthExpiration from '@/hook/use-auth-expiration'
const AppRoutes = () => {
   useAuthExpiration();
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<AUTHROUTE />} >
               <Route element={<BaseLayout />}>
                  {authRoutes.map((route) => (
                     <Route key={route.path} path={route.path} element={route.element} />
                  ))}
               </Route>

            </Route>
            <Route element={<PROTECTEDROUTE />}>
               <Route element={<AppLayout />}>
                  {protectedRoutes.map((route) => (
                     <Route key={route.path} path={route.path} element={route.element} />
                  ))}
               </Route>

            </Route>
         </Routes>
      </BrowserRouter>
   )
}

export default AppRoutes
