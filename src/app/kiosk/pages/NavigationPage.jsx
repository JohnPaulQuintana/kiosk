import React, { useState, useEffect, useCallback } from "react";
import SVGLoader from "../components/SVGLoader";
import ChartContainer from "../components/ChartContainer";
import HeaderSection from "../components/kiosk/HeaderSection";
import Swal from "sweetalert2";
import axios from "axios";
// import facilities from "../data/facilities";

const NavigationPage = () => {
    const [activeNav, setActiveNav] = useState("GROUND FLOOR");
    // const [selectedItem, setSelectedItem] = useState("kiosk");
    const [selectedItem, setSelectedItem] = useState({
        door: "kiosk",
        unit: "",
        availability: true,
        floor: "Ground Floor",
        image: "",
    });
    const [file, setFile] = useState('')
    const [svgLoaded, setSvgLoaded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [floorData, setFloorData] = useState([])

    // Pagination States
    const [currentFloor, setCurrentFloor] = useState('GROUND FLOOR');
    const [floorplans, setFloorplans] = useState([]);
    const [filteredFloorplans, setFilteredFloorplans] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    const baseApiUrl = "http://127.0.0.1:8001/api";

    const fetchFloorplans = async (page = 1) => {
        setIsFetching(true);
        try {
            const response = await axios.get(`${baseApiUrl}/floorplan/unit/collections/kiosk`, {
                params: { page, currentFloor },
                // headers: { Authorization: "Bearer " + localStorage.getItem("authToken") || 0 },
            });

            setFloorplans(response.data.data);
            console.log(response.data.data)
            setCurrentPage(response.data.current_page);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error("Error fetching floorplans:", error);
            Swal.fire("Failed", "Failed to fetch floorplans.", "error");
        } finally {
            setIsFetching(false);
            handleFloorChange('GROUND FLOOR')
        }
    };

    useEffect(() => {
        const savedFormattedIds = JSON.parse(localStorage.getItem('floor-data'));
        if (savedFormattedIds) {
            // console.log("Loaded IDs from localStorage:", savedFormattedIds);
            setFloorData(savedFormattedIds);
        } else {
            console.log("No data found in localStorage.");
        }
    }, []); // Empty dependency array ensures it runs only once


    const handleSVGLoad = () => {
        setSvgLoaded(true);

    };

    const handleUserClicked = useCallback((target, files) => {
        setSelectedItem(target);
        setFile(localStorage.getItem('filename'))
    }, []);

    // Handle floor selection filter
    const handleFloorChange = (floor) => {
        // const selectedFloor = floor;
        console.log(floor)
        setCurrentFloor(floor);
        setActiveNav(floor)
        // Filter floorplans by the selected floor
        const filtered = floorplans.filter(plan => plan.floor === floor);
        console.log(filtered)
        // change the local storage floor
        localStorage.setItem('filename', filtered[0].filepath)
        setFilteredFloorplans(filtered);
    };

    //load on load
    useEffect(() => {
        // fecth the units and current floor
        fetchFloorplans(currentPage);
        setFile(localStorage.getItem('filename'))
    }, [currentPage])

    return (
        <div className="w-full h-screen relative">
            {/* Header */}
            <HeaderSection />

            <SVGLoader filePath={filteredFloorplans[0]?.filepath} onLoad={handleSVGLoad} />

            <div className="grid grid-cols-3">
                {/* Sidebar - Mobile Off-Canvas */}
                <div
                    className={`w-full fixed inset-0 bg-white h-screen shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
                >
                    <div className="mt-20">
                        {/* Navigation Tabs */}
                        <div className="mb-2 ps-4 flex items-center shadow">

                            {floorplans && floorplans.length > 0 ? (
                                floorplans.map((collection, index) => (
                                    <button
                                        key={index}
                                        className={`py-2 mr-2 rounded-md text-sm ${activeNav === collection.floor ? "text-green-500" : "text-slate-500"
                                            }`}
                                        onClick={() => handleFloorChange(collection.floor)}
                                    >
                                        <i
                                            className={`fa-solid fa-triangle rotate-90 text-sm ${activeNav === collection.floor ? "text-green-500" : "text-slate-200"
                                                }`}
                                        ></i>{" "}
                                        {collection.floor}
                                    </button>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm">
                                    <span className="mb-2">No floor plans available.</span>
                                </div>
                            )}


                            {/* <button
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
                            </button> */}
                        </div>
                        <div className="text-xs ps-4 capitalize text-slate-600 flex items-center gap-2 mb-2">
                            <span>
                                <i className="fa-solid fa-circle text-green-500 opacity-80"></i> Available option for <span className="capitalize text-bold">{activeNav}</span>
                            </span>
                        </div>

                        <div className="px-4">
                            <div className="border p-2 max-h-[80vh] overflow-y-auto shadow scrollable-content">
                                {filteredFloorplans.length > 0 ? (
                                    filteredFloorplans.map((plan, index) => (
                                        plan.units.map((unit, unitIndex) => (
                                            <div
                                                className={`${selectedItem.door === unit.door ? "bg-green-500" : ""
                                                    } p-2 mb-4 shadow rounded-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105`}
                                                key={unit.id}
                                            >
                                                <div className="w-[80%]">
                                                    <span
                                                        className={`${selectedItem.door === unit.door ? "text-white" : "text-slate-500"
                                                            } text-xs`}
                                                    >
                                                        <i
                                                            className={`${selectedItem.door === unit.door ? "text-white" : "text-green-500"
                                                                } fa-solid fa-circle opacity-80 text-xs`}
                                                        ></i>{" "}
                                                        <span className="">{plan.floor}</span>
                                                    </span>
                                                    <span
                                                        className={`${selectedItem.door === unit.door ? "text-white" : "text-black"
                                                            } block ps-4`}
                                                    >
                                                        {unit.unit}
                                                    </span>
                                                    <div className="flex gap-2 items-center ps-4 mt-2">
                                                        <button
                                                            onClick={() => handleUserClicked({
                                                                door: "kiosk",
                                                                unit: "",
                                                                availability: true,
                                                                floor: "Ground Floor",
                                                                image: "",
                                                            }, plan)}
                                                            type="button"
                                                            className={`text-xs bg-red-500 border border-white rounded-sm text-white p-1 ${selectedItem.door === unit.door ? "" : "hidden"
                                                                }`}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleUserClicked(unit, plan)}
                                                            type="button"
                                                            className={`text-xs bg-green-500 border border-white rounded-sm text-white p-1 ${unit.availability ? "" : "hidden"
                                                                }`}
                                                        >
                                                            Navigate
                                                        </button>

                                                        {selectedItem.door === unit.door && (
                                                            <span className="flex items-center">
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h2a10 10 0 10-20 0h2z"></path>
                                                                </svg>
                                                                <span className="ml-2 text-white text-[9px] capitalize">Navigating to {unit.unit}...</span>
                                                            </span>
                                                        )}

                                                    </div>
                                                </div>
                                                <div className="border rounded-md w-16 h-16 overflow-hidden">
                                                    <img
                                                        src={unit.image}
                                                        alt=""
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                            // <tr key={`${index}-${unitIndex}`} className="text-left border-b-2 hover:bg-gray-100">
                                            //     <td className="p-2">{unit.id}</td>
                                            //     <td className="p-2">{unit.unit}</td>
                                            //     <td className="p-2"><span className={`text-xs text-white ${unit.availability ? 'bg-green-500' : 'bg-red-500'} rounded-md px-2`}>{unit.availability ? "True" : "False"}</span></td>
                                            //     <td className="p-2">{unit.old_unit}</td>
                                            //     <td className="p-2">
                                            //         <button className="text-blue-500 hover:underline">Update</button>
                                            //     </td>
                                            // </tr>
                                        ))
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span className="p-2 text-center">No data found for selected floor.</span>
                                    </div>
                                )}
                                {/* {activeNav === "facilities" && (
                                    <div>
                                        {floorData.map((facility, index) => (
                                            <div
                                                className={`${selectedItem.id === facility.id ? "bg-green-500" : ""
                                                    } p-2 mb-4 shadow rounded-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105`}
                                                key={index}
                                            >
                                                <div className="w-[80%]">
                                                    <span
                                                        className={`${selectedItem.id === facility.id ? "text-white" : "text-slate-500"
                                                            } text-xs`}
                                                    >
                                                        <i
                                                            className={`${selectedItem.id === facility.id ? "text-white" : "text-green-500"
                                                                } fa-solid fa-circle opacity-80 text-xs`}
                                                        ></i>{" "}
                                                        <span className="">{facility.floor}</span>
                                                    </span>
                                                    <span
                                                        className={`${selectedItem.id === facility.id ? "text-white" : "text-black"
                                                            } block ps-4`}
                                                    >
                                                        {facility.name}
                                                    </span>
                                                    <div className="flex gap-2 items-center ps-4 mt-2">
                                                        <button
                                                            onClick={() => handleUserClicked(facility)}
                                                            type="button"
                                                            className={`text-xs bg-green-500 border border-white rounded-sm text-white p-1 ${facility.availability ? "" : "hidden"
                                                                }`}
                                                        >
                                                            Navigate
                                                        </button>

                                                        {selectedItem.id === facility.id && (
                                                            <span className="flex items-center">
                                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h2a10 10 0 10-20 0h2z"></path>
                                                                </svg>
                                                                <span className="ml-2 text-white text-[9px] capitalize">Navigating to your {facility.name}...</span>
                                                            </span>
                                                        )}

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
                                )} */}

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


                    {svgLoaded && <ChartContainer target={selectedItem} file={file} />}
                </div>
            </div>
        </div>
    );
};

export default NavigationPage;
