"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const Login = () => 
{
    const [remember, setRemember] = useState(false)

    const [loginCredentials, setLoginCredentials] = useState(
    {
        email: "",
        password: ""
    })

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => setLoginCredentials({...loginCredentials, [e.target.name]: e.target.value})

    const handleLogin = (e: React.FormEvent) => 
    {
        e.preventDefault()
        console.log(loginCredentials)
        // Implement actual login logic here
    }

    const inputStyling = "w-full px-4 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-green-500"
    
    return ( 
        <div className="w-full max-w-md bg-white p-4 md:p-5 rounded-lg shadow-md">
            <div className="w-full bg-white rounded-lg ">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Welcome back to FarmSawa</h2>
                <form onSubmit={handleLogin} className="space-y-8 text-black">
                    <div>
                        <Label className="block mb-2 font-medium">Email</Label>
                        <Input type="email" name="email" value={loginCredentials.email} onChange={handleInputChange} required className={inputStyling} placeholder="you@example.com"/>
                    </div>
                    <div>
                        <Label className="block mb-2 font-medium">Password</Label>
                        <Input type="password" name="password" value={loginCredentials.password} onChange={handleInputChange} required className={inputStyling} placeholder="Enter your password"/>
                    </div>
                    <div className="flex justify-between items-start md:items-center text-sm">
                        <label className="flex items-center space-x-1">
                            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-green-600"/>
                            <span>Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-green-600 hover:underline">Forgot password?</Link>
                    </div>
                    <Button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Login</Button>
                </form>

                <p className="text-center text-gray-600 mt-3 md:mt-4">
                    Don&apos;t have an account?{" "}
                    <Link href="/account/signup" className="text-green-600 hover:underline font-medium">Sign up</Link>
                </p>
            </div>
        </div>
     )
}
 
export default Login