import React from "react";
const baseApiUrl2 = import.meta.env.VITE_API_URL;
const InformationModal = ({ infos,handleUserClicked, data, onClose }) => {
    if (!data) return null; // Don't render if no data is passed
    console.log(infos)
    console.log(data)
    const result = data[0]?.units.filter(unit => unit?.unit === infos);
    console.log(result)
    return (
        <div
            id="image-viewer"
            className="fixed overflow-x-hidden inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center zoomout"
        >
            <div className="w-[60%] relative p-4 pl-6">

                <span className="w-full p-3 bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
                    <span
                        id="preview-close"
                        className="absolute top-0 lg:-top-1 right-3 lg:right-1 text-red-500 text-5xl cursor-pointer hover:text-red-500"
                        onClick={onClose}
                    >
                        &times;
                    </span>
                    {result[0].image ? (
                        <img
                        id="full-image"
                        src={`${baseApiUrl2}/storage/${result[0]?.image?.replace(
                            "public",
                            ""
                          )}`}
                        className="w-full h-[30vh] object-cover border"
                        alt="Full Image"
                    />
                    ) : (
                        <div className="w-full h-[30vh] flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">No image available</span>
                        </div>
                    )
                    }

                    <span className="flex flex-col items-start justify-center mb-2">
                        {/* <span className="text-slate-700 text-3xl lg:ps-4"></span> */}
                        <span className="text-slate-700 text-xl flex items-center gap-1"><i
                            className={`${result[0].availability ? "text-green-500" : "text-red-500"
                                } fa-solid fa-circle opacity-80 text-xs`}
                        ></i>{" "}{result[0].unit}</span>
                        
                        {/* <span>Notify</span> */}
                        <button onClick={()=>handleUserClicked(result[0], '')} type="button" className="bg-green-500 p-2 text-white rounded-sm mt-2">Navigate</button>
                    </span>
                </span>
            </div>
        </div>
    );
};

export default InformationModal;
