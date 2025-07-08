"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/superbase/client";
import { getProfile } from "@/app/actions/actions";

const Login = () => {
  const router = useRouter();

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value,
    });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!loginCredentials.email || !loginCredentials.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginCredentials.email,
        password: loginCredentials.password,
      });

      if (error) {
        setError(error.message);
      } else if (data.user) {
        console.log("Login successful:");
        setSuccess(true);
        setLoginCredentials({
          email: "",
          password: "",
        });

        // get user profile
        const user = (await getProfile(data.user.id))[0];
        if (user.admin) {
          router.push("/admin");
          return;
        }
        router.push("/dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyling =
    "w-full px-4 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-green-500";

  const labelStyling = "block mb-3 font-medium";

  return (
    <div className="w-full max-w-md bg-white p-4 md:p-5 rounded-lg shadow-md">
      <div className="w-full bg-white rounded-lg ">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Welcome back to FarmSawa
        </h2>
        <form onSubmit={handleLogin} className="space-y-6 text-black">
          <div>
            <Label htmlFor="email" className={labelStyling}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={loginCredentials.email}
              onChange={handleInputChange}
              required
              className={inputStyling}
              placeholder="you@example.com"
            />
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
                value={loginCredentials.password}
                onChange={handleInputChange}
                required
                className={inputStyling}
                placeholder="Enter your password"
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
          <div className="flex justify-between items-start md:items-center text-sm">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-green-600"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-green-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="col-span-full text-red-600 text-center">{error}</p>
          )}

          {success && (
            <p className="col-span-full text-green-600 text-center">
              Login successful
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-3 md:mt-4">
          {" "}
          Don&apost have an account?{" "}
          <Link
            href="/account/signup"
            className="text-green-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
