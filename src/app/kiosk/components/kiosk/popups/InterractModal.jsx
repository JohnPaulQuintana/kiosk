import { info } from "autoprefixer";
import React from "react";

const InterractModal = ({ isOpen, infos, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[99999] flex justify-center items-center">
            <div className="bg-slate-800 p-2 w-[60%] relative">
                <div className="w-full text-white top-2 right-2 flex justify-between">
                    <h1 className="text-2xl">Unit Information</h1>
                    <div className="bg-red-500 px-2 flex items-center justify-center rounded-sm" onClick={() => onClose()}>
                        <span className="text-md">X</span>
                    </div>
                </div>
                <div className="mt-2 border-t-2">
                    <div className="">
                        <h1 className="text-green-500">{infos.unit}</h1>
                        <h2 className="text-white">{infos.color}</h2>
                    </div>
                    <div className="w-full mt-2">
                        <button type="button" className="bg-green-500 p-2 text-white rounded-sm">Navigate</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterractModal