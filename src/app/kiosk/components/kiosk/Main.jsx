import React from "react";
import { Link } from "react-router-dom";

const MainSection = () => {
    return (
        <div className="p-0 border w-full h-screen grid grid-cols-2">
            <div className="flex flex-col items-start justify-center px-20">
                <span className="text-red-700 font-bold text-5xl uppercase">On-Campus</span>
                <span className="text-4xl text-gray-700">Navigational Kiosk</span>
                <div className="mt-4">
                    <p>Design And Development of An On-Campus Navigational Kiosk with Wayfinding and Notification System.</p>
                </div>
                <Link to={"/navigation"} className="mt-4 bg-red-700 p-1 text-white rounded-md animate-infiniteScale">Getting Started?</Link>
            </div>
            <div className="flex items-center justify-center">
                <img src="/resources/logo/navigation.png" alt="" className="w-[80%] animate-infiniteScale" />
            </div>
        </div>
    )
}

export default MainSection