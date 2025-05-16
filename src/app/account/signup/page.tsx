"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//Importing the phone number input
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

//Importing the phone number validator function from react-phone-number-input
import { isValidPhoneNumber } from "react-phone-number-input";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/superbase/client";

const Signup = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });

  const handlePhoneChange = (value: string) => {
    setUserDetails({ ...userDetails, phone: value });
    if (value && !isValidPhoneNumber(`+${value}`)) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (phoneError) {
      setError("Please fix the phone number error before signing up.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userDetails.email,
        password: userDetails.password,
        options: {
          data: {
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
            phone: userDetails.phone,
          },

          emailRedirectTo: `${window.location.origin}/account/login`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        console.log("Signup successful:", data.user);
        setSuccess(true);
      } else if (data.session === null && data.user === null) {
        setSuccess(true);
        console.log(
          "Signup successful, please check your email for confirmation."
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred during signup.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const inputStyling =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500";

  const labelStyling = "block mb-2 font-medium";

  return (
    <div className="w-full max-w-xl p-4 md:p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-8">
        Create Your FarmSawa Account{" "}
      </h2>
      <form
        onSubmit={handleSignup}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black"
      >
        <div>
          <Label htmlFor="firstName" className={labelStyling}>
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleChange}
            required
            placeholder="John"
            className={inputStyling}
          />
        </div>

        <div>
          <Label htmlFor="lastName" className={labelStyling}>
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleChange}
            required
            placeholder="Doe"
            className={inputStyling}
          />
        </div>

        <div>
          <Label htmlFor="email" className={labelStyling}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className={inputStyling}
          />
        </div>

        <div>
          <Label htmlFor="phone" className={labelStyling}>
            Phone Number
          </Label>
          {/* React-phone-input-2 doesn't use a standard input id, manage via component props if needed */}
          <PhoneInput
            country={"ke"}
            value={userDetails.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%", borderColor: phoneError ? "red" : "" }}
            dropdownStyle={{ zIndex: 1000 }}
            enableSearch={true}
          />
          {phoneError && (
            <p className="text-red-600 text-sm mt-1">{phoneError}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className={labelStyling}>
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={userDetails.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={inputStyling}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="confirmPassword" className={labelStyling}>
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={userDetails.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className={inputStyling}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Display error message */}
        {error && (
          <div className="col-span-1 md:col-span-2 text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Display success message */}
        {success && (
          <div className="col-span-1 md:col-span-2 text-green-600 text-center">
            Signup successful! Please check your email to confirm your account.
          </div>
        )}

        <div className="col-span-1 md:col-span-2">
          <Button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            disabled={loading || !!phoneError}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>

        <div className="col-span-1 md:col-span-2 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="text-green-600 hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
