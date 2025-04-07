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
        <div className="navbar-center ">
        <input type="text" placeholder="Search" className="input input-bordered w-48 md:w-auto" />
        </div>
        <div className="navbar-end">
          <a className="btn btn-primary" onClick={onOpen}>Añadir</a>
        </div>
      </div>
    </>
  );
}
