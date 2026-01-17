import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { authRoutes, protectedRoutes } from './common/routes'
const AppRoutes = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' >
               {authRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
               ))}
            </Route>
            <Route>
               {protectedRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
               ))}
            </Route>

         </Routes>
      </BrowserRouter>
   )
}

export default AppRoutes
