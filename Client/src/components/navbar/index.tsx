import { useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UserNav } from "./user-nav";
import { useTypedSelector } from "@/redux/hook";

const Navbar = () => {
   const { pathname } = useLocation();
   const { user } = useTypedSelector((state) => state.auth);

   const [isOpen, setIsOpen] = useState(false);

   const routes = [
      {
         href: PROTECTED_ROUTES.OVERVIEW,
         label: "Overview",
      },
      {
         href: PROTECTED_ROUTES.TRANSACTIONS,
         label: "Transactions",
      },
      {
         href: PROTECTED_ROUTES.REPORTS,
         label: "Reports",
      },
      // {
      //    href: PROTECTED_ROUTES.SETTINGS,
      //    label: "Settings",
      // },
   ];
   return (
      <>
         <header
            className={cn(
               "w-full px-4 py-3 pb-3 lg:px-14 bg-[var(--secondary-dark-color)]  shadow-sm sticky top-0 z-30",
               pathname === PROTECTED_ROUTES.OVERVIEW && "!pb-3"
            )}
         >
            <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto">
               <div className="w-full flex items-center  md:justify-between">
                  <Logo />
                  {/* <div className="md:hidden  items-center gap-4  md:gap-1">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="inline-flex !cursor-pointer
               !bg-white/10 !text-white hover:bg-white/10"
                        onClick={() => setIsOpen(true)}
                     >
                        <Menu className="h-6 w-6" />
                     </Button>

                  </div> */}

                  {/* Navigation*/}
                  <div className="  md:flex   items-center gap-x-2 overflow-x-auto">
                     {routes.map((route) => (
                        <Button
                           key={route.href}
                           size="sm"
                           variant="ghost"
                           className={cn(
                              `w-full lg:w-auto font-medium py-4.5  transition  text-gray-400 text-lg  border-none`,
                              pathname === route.href && "text-gray-800  "
                           )}
                           asChild
                        >
                           <NavLink to={route.href}>
                              {route.label}
                           </NavLink>
                        </Button>
                     ))}
                  </div>

                  {/* Mobile Navigation */}
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                     <SheetContent side="left" className="bg-white">
                        <nav className="flex flex-col gap-y-2 pt-9">
                           {routes?.map((route) => (
                              <Button
                                 key={route.href}
                                 size="sm"
                                 variant="ghost"
                                 className={cn(
                                    `w-full font-normal py-4
                       hover:bg-white/10 hover:text-black border-none
                       text-black/70 focus:bg-white/30
                       transtion !bg-transparent justify-start`,
                                    pathname === route.href && "!bg-black/10 text-black"
                                 )}
                                 asChild
                              >
                                 <NavLink to={route.href}>
                                    {({ isActive }) => (
                                       <span className={cn(isActive && "text-black")}>
                                          {route.label}
                                       </span>
                                    )}
                                 </NavLink>
                              </Button>
                           ))}
                        </nav>
                     </SheetContent>
                  </Sheet>

                  {/* Right side - User actions */}
                  <div className="flex items-center space-x-4">
                     <UserNav
                        userName={user?.name || ""}
                        email={user?.email || ""}
                        profilePicture={user?.profilePicture || ""}
                        id={user?._id || ""}
                     />
                  </div>
               </div>
            </div>
         </header >
      </>
   );
};


export default Navbar;