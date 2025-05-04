import React from "react";
import { Link } from "react-router-dom";

const MainSection = () => {
    return (
        <div className="p-0 w-full h-screen grid lg:grid-cols-2">
            {/* Content */}
            <div className="flex flex-col items-start justify-center lg:pt-0 px-10 lg:px-20 lg:order-1 order-2">
                <span className="text-red-700 font-bold text-4xl lg:text-5xl uppercase">On-Campus</span>
                <span className="text-2xl lg:text-4xl text-gray-700">Navigational Kiosk</span>
                <div className="mt-2 lg:mt-4">
                    <p className="">Design And Development of An On-Campus Navigational Kiosk with Wayfinding and Notification System.</p>
                </div>
                <Link to={"/navigation/ground"} className="mt-4 bg-red-700 p-1 mb-2 text-white rounded-md animate-infiniteScale">Getting Started?</Link>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center pt-20 lg:order-2 order-1">
                <img src="/resources/logo/navigation.png" alt="" className="w-[80%] animate-infiniteScale" />
            </div>
        </div>
    );
}

export default MainSection;
