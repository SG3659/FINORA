import SignInForm from "@/pages/auth/_components/signin-form"

const SignIn = () => {
   return (
      <div className="grid min-h-svh lg:grid-cols-1">
         <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-6 ">
            <div className="flex justify-center gap-2 md:justify-start">
               {/* <Logo url="/" /> */}
            </div>
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-xs">
                  <SignInForm />
               </div>
            </div>
         </div>

      </div>
   )


}

export default SignIn
