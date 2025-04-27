"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

//Importing Zod to be used in defining form schemas
import { z } from "zod"

//Acts as a bridge/resolver so that React Hook Form uses Zod's validation.
//Ensures the form is validated based on your Zod schema when the form is submitted
import { zodResolver } from "@hookform/resolvers/zod"

//Importing the useForm hook from react-hook-form to create a form
//Controller helps integrate external inputs outside the react hook form
import { useForm, Controller } from "react-hook-form"

//Importing the form components
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"

//Importing the phone number input
import PhoneInput from "react-phone-input-2"

//Importing the phone number validator function from react-phone-number-input
import { isValidPhoneNumber } from "react-phone-number-input"
import { redirect } from "next/navigation"

//Creating a form validation schema using Zod
const formSchema = z.object(
    {
        //Refine allows one to define custom validation logic
        phone: z.string().refine(value => isValidPhoneNumber(`+${value}`),
        {
            message: "Invalid phone number"
        })
    }
)

const Login = () => 
{
    //Initializing the form using useForm and adding validation
        const form = useForm<z.infer<typeof formSchema>>(
            {
                resolver: zodResolver(formSchema),
                defaultValues:
                {
                    phone: "",
                }
            }
        )
    
        //Form submission handler
        const login = (values: z.infer<typeof formSchema>) =>
        {
            console.log("Submitted phone number:", values.phone)
            redirect("/verify-otp")
        }
    return ( 
        <div className="w-screen min-h-screen flex justify-center items-center">
            <div className="w-full max-w-96 p-6 rounded-lg shadow-md space-y-3">
                <div className="relative flex items-center justify-center mb-6">
                    <Link href="/get_started" className="absolute left-0">
                        <ArrowLeft className="text-2xl hover:text-blue-500" />
                    </Link>
                    <h2 className="text-lg font-semibold">Login</h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(login)} className="space-y-6">
                        <FormField control={form.control} name="phone" render={({ }) => 
                            (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        {/* Using Controller to connect the external PhoneInput to the react hook form */}
                                        <Controller name="phone" control={form.control} render={({ field: {onChange, value}}) =>
                                        (
                                            <PhoneInput country={'ke'} value={value} onChange={onChange} inputStyle={{ width: "100%",backgroundColor: "#FACC15"}} dropdownStyle={{ zIndex: 1000}} enableSearch={true}/>
                                        )}></Controller>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                        <Button type="submit" variant="primaryAction" className="w-full">Send OTP</Button>
                    </form>

                        <p className="mt-4 text-center">Not yet registered? <Link href={"/signup"} className="text-blue-600">Signup</Link></p>
                </Form>
            </div>
        </div>
     );
}
 
export default Login;