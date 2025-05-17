import { info } from "autoprefixer";
import React from "react";
const baseApiUrl = import.meta.env.VITE_API_URL;

const DEFAULT_IMAGE = "/resources/logo/navigation.png";

const InterractModal = ({
  defaultFloorplans,
  isOpen,
  infos,
  onClose,
  handleUserClicked,
}) => {
  let activeFloorSession = localStorage.getItem("floor");
  console.log(activeFloorSession);
  console.log(defaultFloorplans);
  const targetFloor = defaultFloorplans.find(
    (floor) => floor.floor === activeFloorSession
  );
  console.log(targetFloor);
  console.log("selected: ", infos);
  if (!isOpen) return null;
  const result = targetFloor?.units.filter(
    (unit) => unit?.unit === infos?.unit
  );
  console.log(result);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[99999] flex justify-center items-center">
      <div className="bg-slate-800 p-10 w-[60%] wider:w-[40%] relative grid grid-cols-1 md:grid-cols-2 gap-2 items-center justify-center">
        <div
          className="bg-red-500 px-2 flex items-center justify-center rounded-sm absolute right-10 top-10"
          onClick={() => onClose()}
        >
          <span className="text-md">X</span>
        </div>
        <div>
          <div className="w-full text-white top-2 right-2 flex justify-between">
            <h1 className="text-2xl uppercase">
              {activeFloorSession} Unit Information
            </h1>
          </div>

          <div className="mt-2 border-t-2">
            <div className="">
              <h1 className="text-green-500">{infos.unit}</h1>
              <h2 className="text-white">
                Teachers: {Array.isArray(result[0]?.teachers) ? result[0].teachers.length : 0} - registered
            </h2>
            </div>
            <div className="w-full mt-2">
              <button
                onClick={() => handleUserClicked(result[0], "")}
                type="button"
                className="bg-green-500 p-2 text-white rounded-sm"
              >
                Navigate
              </button>
            </div>
          </div>
        </div>

        {/* image */}
        <div className="border rounded-md w-full">
          <img
            src={
              result[0].image
                ? `${baseApiUrl}/storage/${result[0].image.replace(
                    "public/",
                    ""
                  )}`
                : DEFAULT_IMAGE
            }
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = DEFAULT_IMAGE;
            }}
            alt={result[0].unit}
            className="w-full h-[300px] border object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default InterractModal;
