import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "react-router-dom"

const Logo = (props: { url?: string }) => {
   return (
      <Link to={props.url || PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-4">
         <div className="bg-green-500 text-white h-10 w-10 rounded-full flex items-center justify-center">
            <GalleryVerticalEnd className="size-6" />
         </div>
         <span className="font-semibold text-xl text-foreground">AuroraFi</span>
      </Link>
   )
}

export default Logo