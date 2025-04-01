import React from "react";

const DashboardCard = ({ title, value, description, icon: Icon, onClick }) => {
  return (
    <div className="card w-96 bg-base-100 card-lg shadow-md p-4 hover:shadow-lg transition duration-300">
      <div className="card-body flex flex-col items-center text-center">
        {Icon && <Icon className="text-4xl text-primary" />}
        <h2 className="card-title text-xl">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-gray-500">{description}</p>
        
      </div>
    </div>
  );
};

export default DashboardCard;
