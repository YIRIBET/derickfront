import React from "react";
export default function Tablelist( {handleOpen}) {

  const clients = [
    {
      id: 1,
      name: "Cy Ganderton",
      job: "Quality Control Specialist",
      color: "Blue",
      isactive: true,
    },
    {
      id: 2,
      name: "Hart Hagerty",
      job: "Desktop Support Technician",
      color: "Purple",
      isactive: false,
    },
    {
      id: 3,
      name: "Yuri Berry",
      job: "Chief Marketing Officer (CMO)",
      color: "Purple",
      isactive: true,
    },
  ]

  return (
    <>
      <div className="overflow-x-auto mt-10">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody className="hover">
            {/* row 1 */}
            {clients.map((client) => (
            <tr key={client.id}>
              <th>{client.id}</th>
              <td>{client.name}</td>
              <td>{client.job}</td>
              <td>{client.color}</td>
              <td>
                <button className={`btn rounded-full w-20 ${client.isactive ? `btn-primary`: `btn-outline-primary`}`}>details</button>
              </td>
              <td>
                <button onClick={()=>handleOpen('edit')} className="btn btn-warning rounded-full w-20">Editar
                  
                </button>
              </td>
              <td>
                <button className="btn btn-error rounded-full w-20">Eliminar

                </button>
              </td>
            </tr>
            
            
            ))}
            {/* row 2 */}
          </tbody>
        </table>
      </div>
    </>
  );
}
