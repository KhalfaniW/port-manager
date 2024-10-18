import React from "react";
import ReactDOM from "react-dom/client";

import Cookies from "js-cookie";

const serverData = JSON.parse(Cookies.get("serverData"));

function App() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Simple Name
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Compose Project
            </th>
            <th scope="col" className="px-6 py-3">
              IP Address
            </th>
            <th scope="col" className="px-6 py-3">
              Ports
            </th>
          </tr>
        </thead>
        <tbody>
          {serverData.map((item) => (
            <tr
              key={item.name}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4">{item.simpleName || "N/A"}</td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.composeProject}</td>
              <td className="px-6 py-4">{item.ipAddress}</td>
              <td className="px-6 py-4">
                {item.ports.map((port, index) => (
                  <span key={index}>
                    {port}
                    {index < item.ports.length - 1 ? ", " : ""}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
