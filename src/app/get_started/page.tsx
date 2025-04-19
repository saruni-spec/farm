// pages/get-started.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GetStarted() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-3">
      <h1 className="text-3xl font-bold mb-16 text-center">Get Started</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Farmer Card */}
        <Card className="bg-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-bold mb-6">Farmer</h2>

            <Button
              asChild
              className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white mb-4"
            >
              <Link href="/sign_up/farmer">Create Account</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Link href="/login/farmer">Login Instead</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h2 className="text-xl font-bold mb-6">Administrator</h2>

            <Button
              asChild
              className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white mb-4"
            >
              <Link href="/sign_up/admin">Create Account</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Link href="/login/admin">Login Instead</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
