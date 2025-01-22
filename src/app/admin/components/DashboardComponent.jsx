import React from "react";
import Sidebar from "./SidebarComponent";

const DashboardComponents = () => {
    
    return (
        <div className="flex">
            {/* Sidebar */}
            {/* <Sidebar activeItem="home" /> */}

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-4 h-screen">
                <h1 className="text-2xl font-bold">Campus Navigation Kiosk Dashboard</h1>
                <p>This is where your content goes!</p>

                <div className="mt-2 py-2">
                    {/* Additional Content Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        <div className="border flex flex-col items-center justify-center p-4 rounded-md bg-white">
                            <h1 className="font-bold text-4xl">4</h1>
                            <span>Floor Units</span>
                        </div>
                        <div className="border flex flex-col items-center justify-center p-4 rounded-md bg-white">
                            <h1 className="font-bold text-4xl">4</h1>
                            <span>Facilities</span>
                        </div>
                        <div className="border flex flex-col items-center justify-center p-4 rounded-md bg-white">
                            <h1 className="font-bold text-4xl">4</h1>
                            <span>Teacher's</span>
                        </div>
                        <div className="border flex flex-col items-center justify-center p-4 rounded-md bg-white">
                            <h1 className="font-bold text-4xl">4</h1>
                            <span>Announcement's</span>
                        </div>
                    </div>
                    {/* Additional Content Card End*/}

                    <div className="mt-4 py-2">
                        <h1 className="text-xl font-semibold">Latest Activity</h1>
                        <div className="w-full border py-2 p-2">
                            <span>Table content here</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardComponents;
