"use client"

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
import { Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"

import OtpInput from "react-otp-input"
import { redirect } from "next/navigation"

//Creating the OTP schema
const otpSchema = z.object(
    {
        otp: z.string().length(5, "OTP must be 5 digits")
    })

const VerifyOTP = () => 
{
    //Initializing the form
    const otpForm=useForm<z.infer<typeof otpSchema>>(
        {
            resolver: zodResolver(otpSchema),
            defaultValues:
            {
                otp: ""
            }
        }
    )

    //Form submission handler
    const verifyOTP = (values: z.infer<typeof otpSchema>) =>
    {
        console.log(values.otp)
        redirect("/dashboard/map")
    }

    //Creating a sample mobile number to be used in extracting the last three digits
    const mobileNumber="+254707251073"
    
    return ( 
        <>
            <h2 className="text-lg font-semibold text-center">Verify OTP</h2>
            <p  className="text-center w-full">Enter OTP received on number ending in <span className="font-bold">{mobileNumber.slice(-3)}</span></p>
            <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-6">
                    <FormField control={otpForm.control} name="otp" render={({ }) => 
                        (
                            <FormItem>
                                <FormControl className="flex justify-between">
                                    {/* Using Controller to connect the external PhoneInput to the react hook form */}
                                    <Controller name="otp" control={otpForm.control} render={({ field: {onChange, value}}) =>
                                    (
                                        <OtpInput value={value} onChange={onChange} numInputs={5} containerStyle="flex justify-around mt-2" inputStyle={{ width: "3rem", height: "3rem", textAlign: "center", border: "1px solid #d1d5db", borderRadius: "0.375rem"}} renderInput={(props) => <input {...props}/>}/>
                                    )}></Controller>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>

                    <Button type="submit" variant="primaryAction" className="w-full">Verify & login</Button>
                </form>
            </Form>
        </>
     );
}
 
export default VerifyOTP;