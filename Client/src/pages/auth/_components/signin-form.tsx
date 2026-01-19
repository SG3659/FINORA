import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from '@/routes/common/routePath'
import { useLoginMutation, useOtpVerifyMutation, } from "@/api/auth/authApi"
import { toast } from "sonner"

const loginSchema = z.object({
   email: z.string().email("Invalid email address"),
   password: z.string().min(8, "Password must be at least 8 characters").max(12)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
})

const otpSchema = z.object({
   otp: z.string().length(6),
})

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;




const SignInForm = ({ className }: React.ComponentPropsWithoutRef<"form">) => {
   const navigate = useNavigate()
   const [isOTPRequested, setIsOTPRequested] = useState(false);
   const [email, setEmail] = useState("   ");
   // const [isOTPRequested, setIsOTPRequested] = useState(true);
   // const [email, setEmail] = useState("sahilgupta43384@gmail.com");

   const loginForm = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: ""
      }
   });

   const otpForm = useForm<OtpFormValues>({
      resolver: zodResolver(otpSchema),
      defaultValues: {
         otp: ""
      }

   });

   const [login, { isLoading: isLoginLoading }] = useLoginMutation();
   const [otpVerify, { isLoading: isOtpVerifying }] = useOtpVerifyMutation();

   const onLoginSubmit = async (values: LoginFormValues) => {
      try {
         setEmail(values.email);
         await login(values).unwrap();
         otpForm.reset({
            otp: "",
         });
         setIsOTPRequested(true);
         // otpForm.setValue("email", values.email);
         toast.success("OTP sent to your email");
      } catch (error) {
         const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to send OTP";
         toast.error(errorMessage);
      }
   };


   const onOtpSubmit = async (values: OtpFormValues) => {
      try {
         console.log(email)
         const result = await otpVerify({ email, otp: values.otp }).unwrap();
         toast.success("Login successful!");
         // Store tokens in localStorage or cookie
         localStorage.setItem("access_token", result.access);
         localStorage.setItem("refresh_token", result.refresh);
         navigate("/dashboard");
      } catch (error) {
         const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Invalid OTP";
         toast.error(errorMessage);
      }
   };

   const handleBackToLogin = () => {
      setIsOTPRequested(false);
      loginForm.reset();
      otpForm.reset();
   };

   return (
      <>
         {!isOTPRequested ? (
            <Form {...loginForm} key='login-form'>
               <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className={cn("flex flex-col gap-6", className)}
               // {...props}
               >
                  <div className="flex flex-col items-center gap-2 text-center">
                     <h1 className="text-2xl font-bold">Login to your account</h1>
                     <p className="text-balance text-sm text-muted-foreground">
                        Enter your email and password to login to your account
                     </p>
                  </div>
                  <div className="grid gap-6">
                     <FormField
                        control={loginForm.control}
                        name="email"
                        rules={{ required: "Email is required" }}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="!font-normal">Email</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="your.email@example.com"
                                    type="email"
                                    disabled={isLoginLoading}
                                    {...field}

                                 />

                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="!font-normal">Password</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="••••••••"
                                    type="password"
                                    disabled={isLoginLoading}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button type="submit" className="w-full" disabled={isLoginLoading}>
                        {isLoginLoading ? "Sending OTP..." : "Send OTP"}
                     </Button>
                     <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-[var(--bg-color)] dark:bg-background px-2 text-muted-foreground">
                           Or continue with
                        </span>
                     </div>
                     <Button type="button" variant="outline" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                           <path
                              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                              fill="currentColor"
                           />
                        </svg>
                        Login with Google
                     </Button>
                  </div>
                  <div className="text-center text-sm">
                     Don&apos;t have an account?{" "}
                     <Link
                        to={AUTH_ROUTES.SIGN_UP}
                        className="underline underline-offset-4"
                     >
                        Sign up
                     </Link>
                  </div>
               </form>
            </Form >
         ) : (
            <Form {...otpForm} key='otp-form'>
               <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className={cn("flex flex-col gap-6", className)}
               // {...props}
               >
                  <div className="flex flex-col items-center gap-2 text-center">
                     <h1 className="text-2xl font-bold">Verify OTP</h1>
                     <p className="text-balance text-sm text-muted-foreground">
                        Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
                     </p>
                  </div>
                  <div className="grid gap-6">
                     {/* <FormField
                        control={otpForm.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <input type="hidden" {...field} />
                              </FormControl>
                           </FormItem>
                        )}
                     /> */}

                     <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>OTP</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="000000"
                                    maxLength={6}
                                    disabled={isOtpVerifying}
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button type="submit" className="w-full" disabled={isOtpVerifying}>
                        {isOtpVerifying ? "Verifying..." : "Verify OTP"}
                     </Button>
                     <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={handleBackToLogin}
                        disabled={isOtpVerifying}
                     >
                        Back to Login
                     </Button>
                  </div>
               </form>
            </Form>
         )}
      </>
   )
}

export default SignInForm
