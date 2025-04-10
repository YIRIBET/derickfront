import React from "react";
const RoleBadge = ({ role }) => {
    const roleConfig = {
      1: {
        text: "Administrador",
        bg: "bg-purple-100",
        textColor: "text-purple-800"
      },
      2: {
        text: "Restaurante",
        bg: "bg-orange-100",
        textColor: "text-[#ff6227]"
      },
      3: {
        text: "Usuario",
        bg: "bg-green-100",
        textColor: "text-green-800"
      }
    };
  
    const config = roleConfig[role] || roleConfig.USER;
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.textColor}`}>
        {config.text}
      </span>
    );
  };
  
export default RoleBadge;