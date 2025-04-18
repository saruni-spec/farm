import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => 
{
    return ( 
        <div className="w-screen min-h-screen flex justify-center items-center">
            {children}
        </div>
     );
}
 
export default LoginLayout;