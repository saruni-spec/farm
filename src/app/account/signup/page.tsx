"use client"

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

//Importing the phone number input
import PhoneInput from "react-phone-input-2"
import 'react-phone-input-2/lib/style.css'

//Importing the phone number validator function from react-phone-number-input
import { isValidPhoneNumber } from "react-phone-number-input"

import { useState } from "react"
import Link from "next/link"

const Signup = () => 
{
    const [formData, setFormData] = useState(
    {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] =useState(false)
    const [phoneError, setPhoneError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value})

    const handlePhoneChange = (value: string) => 
    {
        setFormData({ ...formData, phone: value })
        if(!isValidPhoneNumber(`+${value}`))
        {
            setPhoneError("Please enter a valid phone number")
        }
        else
        {
            setPhoneError("")
        }
    }

    const handleSignup = (e: React.FormEvent) => 
    {
        e.preventDefault()
        console.log(formData)
    }

    const inputStyling="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"

    return (
        <div className="w-full max-w-xl p-4 md:p-5 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-center text-green-700 mb-8">Create Your FarmSawa Account </h2>

            <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                <div>
                    <Label className="block mb-1 font-medium">First Name</Label>
                    <Input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" className={inputStyling}/>
                </div>

                <div>
                    <Label className="block mb-1 font-medium">Last Name</Label>
                    <Input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className={inputStyling}/>
                </div>

                <div>
                    <Label className="block mb-1 font-medium">Email</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputStyling}/>
                </div>

                <div>
                    <Label className="block mb-1 font-medium">Phone Number</Label>
                    <PhoneInput country={'ke'} value={formData.phone} onChange={handlePhoneChange} inputStyle={{ width: "100%"}} dropdownStyle={{ zIndex: 1000}} enableSearch={true}/>
                    {
                        phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>
                    }
                </div>

                <div className="space-y-2">
                    <Label className="block mb-1 font-medium">Password</Label>
                    <div className="relative">
                        <Input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" className={inputStyling}/>
                        <button type="button" className="absolute right-1 top-0 h-full" onClick={()=> setShowPassword(!showPassword)}>
                            {
                                showPassword
                                ?
                                    <EyeOff className="h-5 w-5 text-black"/>
                                :
                                    <Eye className="h-5 w-5 text-black"/>
                            }
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="block mb-1 font-medium">Confirm Password</Label>
                    <div className="relative">
                        <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" className={inputStyling}/>
                        <Button type="button" className="absolute right-1 top-0 h-full" onClick={()=> setShowConfirmPassword(!showConfirmPassword)}>
                            {
                                showConfirmPassword
                                ?
                                    <EyeOff className="h-5 w-5 text-black"/>
                                :
                                    <Eye className="h-5 w-5 text-black"/>
                            }
                        </Button>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Sign Up</Button>
                </div>

                <div className="col-span-1 md:col-span-2 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link href="/account/login" className="text-green-600 hover:underline">Login</Link>
                </div>
            </form>
        </div>
    )
}

export default Signup
