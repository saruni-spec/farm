"use client"

import { useState } from "react"

import Link from "next/link"

import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react"

//Importing Zod to be used in defining form schemas
import { z } from "zod"

//Acts as a bridge/resolver so that React Hook Form uses Zod's validation.
//Ensures the form is validated based on your Zod schema when the form is submitted
import { zodResolver } from "@hookform/resolvers/zod"

//Importing the useForm hook from react-hook-form to create a form
import { useForm } from "react-hook-form"

//Importing the form components
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { redirect } from "next/navigation"

//Creating a form validation schema using Zod
const formSchema = z.object(
    {
        email: z.string().email("Invalid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    }
)

const AdminLogin = () => 
{
    //Initializing the form using useForm and adding validation
    const form = useForm<z.infer<typeof formSchema>>(
        {
            resolver: zodResolver(formSchema),
            defaultValues:
            {
                email: "",
                password: ""
            }
        }
    )

    //Password visibilty state
    const [passwordVisibility, setPasswordVisibility] = useState(false)

    //Function to update the password visibility state
    const togglePassword=() => setPasswordVisibility(!passwordVisibility)

    //Form submission handler
    const login = (values: z.infer<typeof formSchema>) =>
    {
        console.log(values)
        redirect("/dashboard")
    }
    return ( 
        <>
             <div className="relative flex items-center justify-center mb-6">
                <Link href="/get_started" className="absolute left-0">
                    <ArrowLeft className="text-2xl hover:text-blue-500" />
                </Link>
                <h2 className="text-2xl font-semibold">Management Login</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(login)} className="space-y-4">
                    <FormField control={form.control} name="email" render={({ field }) => 
                        (
                            <FormItem>
                                <FormLabel className="text-md">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type="email" placeholder="Enter your email" {...field} />
                                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    <FormField control={form.control} name="password" render={({ field }) => 
                        (
                            <FormItem>
                                <FormLabel className="text-md">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type={passwordVisibility ? "text" : "password"} placeholder="Enter your password" {...field}/>
                                        <button type="button" onClick={togglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {
                                                passwordVisibility 
                                                ? 
                                                    <EyeOff size={18} /> 
                                                : 
                                                    <Eye size={18} />
                                            }
                                        </button>
                                    </div>
                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>

                    <Button type="submit" variant="primaryAction" className="w-full">Login</Button>
                    </form>

                    <p className="mt-4 text-center">Not yet registered? <Link href={"/signup/admin"} className="text-blue-600">Register</Link></p>
            </Form>
        </>
    )
}
 
export default AdminLogin