import React from "react";
import logo from "../../assets/logop.jpg";
export default function Navbar({onOpen}) {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
         
         
          {/* anadir imgen de logo */}
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
           

        </div>
       
        
      </div>
    </>
  );
}
