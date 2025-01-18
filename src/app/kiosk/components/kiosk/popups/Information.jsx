import React from "react";

const InformationModal = ({ data, onClose }) => {
    if (!data) return null; // Don't render if no data is passed

    return (
        <div
            id="image-viewer"
            className="fixed overflow-x-hidden inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center zoomout"
        >
            <div className="relative p-4 pl-6">

                <span className="w-full p-3 lg:w-[50%] bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
                    <span
                        id="preview-close"
                        className="absolute top-0 lg:-top-1 right-3 lg:right-1 text-red-500 text-5xl cursor-pointer hover:text-red-500"
                        onClick={onClose}
                    >
                        &times;
                    </span>
                    <img
                        id="full-image"
                        src={data.image}
                        className="w-full h-auto object-cover"
                        alt="Full Image"
                    />

                    <span className="flex flex-col items-start justify-center mb-2">
                        <span className="text-slate-700 text-3xl lg:ps-4">Ground Floor</span>
                        <span className="text-slate-700 text-xl flex items-center gap-1"><i
                            className={`${data.availability ? "text-green-500" : "text-red-500"
                                } fa-solid fa-circle opacity-80 text-xs`}
                        ></i>{" "}AB1-111 CLASSROOM</span>
                        
                        {/* <span>Notify</span> */}
                    </span>
                </span>
            </div>
        </div>
    );
};

export default InformationModal;
