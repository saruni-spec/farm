"use client"

import Link from "next/link"
import { IoIosArrowRoundBack } from "react-icons/io"

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

    //Form submission handler
    const login = (values: z.infer<typeof formSchema>) =>
    {
        console.log(values)
    }
    return ( 
        <>
             <div className="relative flex items-center justify-center mb-6">
                <Link href="/login" className="absolute left-0">
                    <IoIosArrowRoundBack className="text-2xl hover:text-blue-500" />
                </Link>
                <h2 className="text-lg font-semibold">Management Login</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(login)} className="space-y-6">
                    <FormField control={form.control} name="email" render={({ field }) => 
                        (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    <FormField control={form.control} name="password" render={({ field }) => 
                        (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
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