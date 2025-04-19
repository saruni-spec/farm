import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => 
{
    return ( 
        <div className="w-screen min-h-screen flex justify-center items-center">
            <div className="w-full max-w-80 p-6 rounded-lg shadow-md space-y-3">
                {children}
            </div>
        </div>
     );
}
 
export default LoginLayout;