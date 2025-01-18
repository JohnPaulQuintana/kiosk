import React, { useState } from "react";
import SVGLoader from "../components/SVGLoader";
import ChartContainer from "../components/ChartContainer";
import HeaderSection from "../components/kiosk/HeaderSection";
import facilities from "../data/facilities";

const NavigationPage = () => {
    const [activeNav, setActiveNav] = useState("facilities");
    const [selectedItem, setSelectedItem] = useState("kiosk");
    const [svgLoaded, setSvgLoaded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSVGLoad = () => {
        setSvgLoaded(true);
    };

    const handleUserClicked = (target) => {
        setSelectedItem(target);
    };

    return (
        <div className="w-full h-screen relative">
            {/* Header */}
            <HeaderSection />

            <SVGLoader filePath={"maps/ground_level.svg"} onLoad={handleSVGLoad} />

            <div className="grid grid-cols-3">
                {/* Sidebar - Mobile Off-Canvas */}
                <div
                    className={`w-full fixed inset-0 bg-white shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
                >
                    <div className="mt-20">
                        {/* Navigation Tabs */}
                        <div className="mb-2 ps-4 flex items-center shadow">
                            <button
                                className={`py-2 mr-2 rounded-md text-sm ${activeNav === "facilities" ? "text-green-500" : "text-slate-500"}`}
                                onClick={() => setActiveNav("facilities")}
                            >
                                <i
                                    className={`fa-solid fa-triangle rotate-90 text-sm ${activeNav === "facilities" ? "text-green-500" : "text-slate-200"
                                        }`}
                                ></i>{" "}
                                Facilities
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md text-sm ${activeNav === "teachers" ? "text-green-500" : "text-slate-500"}`}
                                onClick={() => setActiveNav("teachers")}
                            >
                                <i
                                    className={`fa-solid fa-triangle rotate-90 text-sm ${activeNav === "teachers" ? "text-green-500" : "text-slate-200"
                                        }`}
                                ></i>{" "}
                                Teachers
                            </button>
                        </div>
                        <div className="text-xs ps-4 capitalize text-slate-600 flex items-center gap-2 mb-2">
                            <span>
                                <i className="fa-solid fa-circle text-green-500 opacity-80"></i> Available option for {activeNav}
                            </span>
                        </div>

                        <div className="px-4">
                            <div className="border p-2 max-h-[80vh] overflow-y-auto shadow scrollable-content">
                                {activeNav === "facilities" && (
                                    <div>
                                        {facilities.map((facility, index) => (
                                            <div
                                                className={`${selectedItem === facility.id ? "bg-green-500" : ""
                                                    } p-2 mb-4 shadow rounded-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105`}
                                                key={index}
                                            >
                                                <div className="w-[80%]">
                                                    <span
                                                        className={`${selectedItem === facility.id ? "text-white" : "text-slate-500"
                                                            } text-xs`}
                                                    >
                                                        <i
                                                            className={`${selectedItem === facility.id ? "text-white" : "text-green-500"
                                                                } fa-solid fa-circle opacity-80 text-xs`}
                                                        ></i>{" "}
                                                        <span className="">{facility.floor}</span>
                                                    </span>
                                                    <span
                                                        className={`${selectedItem === facility.id ? "text-white" : "text-black"
                                                            } block ps-4`}
                                                    >
                                                        {facility.name}
                                                    </span>
                                                    <div className="flex gap-2 items-center ps-4">
                                                        <button
                                                            onClick={() => handleUserClicked(facility.id)}
                                                            type="button"
                                                            className={`text-xs bg-green-500 border border-white rounded-sm text-white p-1 ${facility.availability ? "" : "hidden"
                                                                }`}
                                                        >
                                                            Navigate
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="border rounded-md w-16 h-16 overflow-hidden">
                                                    <img
                                                        src={facility.image}
                                                        alt=""
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeNav === "teachers" && <p className="text-gray-500">Teachers data will be here.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlay for Mobile Sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-[5]"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <div className="col-span-3 lg:col-span-2">
                    {/* Mobile Hamburger Button */}
                    <button
                        className="lg:hidden absolute top-12 z-50 p-1 ps-4 bg-green-500 text-white rounded-sm animate-pulse"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <i className={`fa-solid ${isSidebarOpen ? 'fa-chevrons-left' : 'fa-chevrons-right'}`}></i>
                    </button>


                    {svgLoaded && <ChartContainer target={selectedItem} />}
                </div>
            </div>
        </div>
    );
};

export default NavigationPage;
