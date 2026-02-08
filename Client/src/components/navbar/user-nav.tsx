import { LogOut, Settings, Moon, Sun } from "lucide-react"
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "../ui/avatar"
import { Button } from "../ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/slice/authSlice";
import { useLogoutMutation } from "@/api/auth/authApi";
export function UserNav({
   userName,
   email,
   profilePicture,
   id
}: {
   userName: string;
   email: string;
   profilePicture: string;
   id: string;
}) {
   const [logoutApi] = useLogoutMutation();
   const dispatch = useAppDispatch();
   const handleLogout = async () => {
      try {
         await logoutApi().unwrap();
         dispatch(logout());
         window.location.href = "/";
      } catch (error) {
         console.error("Logout failed:", error);
      }
   }
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               className="relative  h-8 w-8 rounded-full !gap-0"
            >
               <Avatar className="h-10 w-10 !cursor-pointer ">
                  <AvatarImage
                     src={profilePicture || ""}
                     className="!cursor-pointer "
                  />
                  <AvatarFallback
                     className=" border !border-gray
               !text-foreground"
                  >
                     {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent
            className="w-80 !bg-[var(--secondary-dark-color)] !text-white
         !border-gray mt-2"
            align="end"
            forceMount
         >
            <DropdownMenuLabel className="flex items-center justify-between cursor-pointer    !text-white">
               <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-foreground text-lg">{userName}</span>
                  <span className="text-[13px] text-gray-400 font-medium">{email}</span>
               </div>
               <div className="w-6 h-6 cursor-pointer !hover:bg-gray-800 rounded-full flex items-center justify-center">
                  <Settings className="size-5  text-black   " />
               </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="!bg-gray " />
            {/* <DropdownMenuGroup >
               <DropdownMenuItem className=" text-foreground hover:!bg-gray "
                  onClick={onLogout}
               >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
               </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="!bg-gray " /> */}
            <DropdownMenuGroup >
               <DropdownMenuItem className=" text-foreground hover:!bg-gray"
                  onClick={handleLogout}
               >
                  <LogOut className="size-4 mr-2" />
                  Log out
               </DropdownMenuItem>
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}