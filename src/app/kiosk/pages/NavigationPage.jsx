import React, { useState, useEffect, useCallback } from "react";
import SVGLoader from "../components/SVGLoader";
import ChartContainer from "../components/ChartContainer";
import HeaderSection from "../components/kiosk/HeaderSection";
import Swal from "sweetalert2";
import axios from "axios";
import InterractSvgMap from "../components/InterractSvgMap";
import InterractModal from "../components/kiosk/popups/InterractModal";
import TeacherModal from "../components/TeacherModal";
import { calculateShortestPathWithEdges } from "../customHook/pathCalculation";
// import facilities from "../data/facilities";

const NavigationPage = () => {
  const [sideClick, setSideClick] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [renderMap, setRenderMap] = useState(false);
  const [infos, setInfos] = useState(null);
  const handleModalInterractOpen = (data) => {
    console.log(data);
    setInfos(data);
    setIsOpen(true);
  };
  const handleModalInterractClose = () => setIsOpen(false);

  const [activeNav, setActiveNav] = useState("GROUND FLOOR");
  // const [selectedItem, setSelectedItem] = useState("kiosk");
  const [selectedItem, setSelectedItem] = useState({
    door: "kiosk",
    unit: "",
    availability: true,
    floor: "Ground Floor",
    image: "",
  });
  const [file, setFile] = useState("");
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [floorData, setFloorData] = useState([]);

  // Pagination States
  const [currentFloor, setCurrentFloor] = useState("GROUND FLOOR");
  const [floorplans, setFloorplans] = useState([]);
  const [defaultFloorplans, setDefaultFloorplans] = useState([]);
  const [filteredFloorplans, setFilteredFloorplans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  //   Teacher
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // calculated shortest path
  const [shortestPath, setShortestPath] = useState([]);
  //trim to target to highlight
  const [trimmedTarget, setTrimmedTarget] = useState([]);
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const clickedUnitApi = import.meta.env.VITE_API_CLICKEDUNIT;

  const fetchFloorplans = async (page = 1) => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${baseApiUrl}/floorplan/unit/collections/kiosk`,
        {
          params: { page, currentFloor },
          // headers: { Authorization: "Bearer " + localStorage.getItem("authToken") || 0 },
        }
      );

      setFloorplans(response.data.data);
      // Filter floorplans for the selected floor
      const filtered2 = response.data.data.filter(
        (plan) => plan.floor === "GROUND FLOOR"
      );
      console.log(filtered2);

      console.log(response.data.data);
      localStorage.setItem("floorplans", JSON.stringify(response.data.data));
      localStorage.setItem("floor", response.data.data[0].floor);
      setDefaultFloorplans(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
      setFilteredFloorplans(filtered2);
    } catch (error) {
      console.error("Error fetching floorplans:", error);
      Swal.fire("Failed", "Failed to fetch floorplans.", "error");
    } finally {
      setIsFetching(false);
      // handleFloorChange('GROUND FLOOR')
    }
  };

  useEffect(() => {
    const savedFormattedIds = JSON.parse(localStorage.getItem("floor-data"));
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

  const handleUserClicked = useCallback(async (target, teacher_id) => {
    console.log("Teacher ID", teacher_id);
    // alert(target.door)
    // ""second_basketball_court_and_stage_door1""
    console.log(target);
    // calculate the shortest path
    const { shortestPath, blockedPaths } = calculateShortestPathWithEdges(target.door);
    if (!shortestPath || shortestPath.length === 0) console.log("No path found.");
    setShortestPath(shortestPath);
    // Remove the first word and the underscore, remove words starting with "door", then replace underscores with spaces and convert to uppercase
    const result = target.door
    .replace(/^([^\s_]+)_|_door\w+/g, "")   // Remove first word + underscore and "door" words
    // .replace(/_/g, " ")                     // Replace underscores with spaces
    // .toUpperCase();                         // Convert the string to uppercase

    // alert(result); // Output: "SSG"
    // console.log("Shortest Path:", shortestPath);
    setTrimmedTarget(result);

    setSelectedItem(target);
    setFile(localStorage.getItem("filename"));
    setRenderMap(true);
    setSideClick(true);
    setSvgLoaded(false);
    // Check if teacher_id is null, undefined, empty, or an object
    if (
      teacher_id === null ||
      teacher_id === "" ||
      (typeof teacher_id === "object" && Object.keys(teacher_id).length === 0)
    ) {
      teacher_id = 0;
    }
    try {
      const response = await axios.post(clickedUnitApi, {
        id: target.id,
        teacher_id: teacher_id,
      });

      console.log("API response:", response.data);
      const teacherData = response.data.teacher; // This contains the teacher info
      if (teacherData && Object.keys(teacherData).length > 0) {
        // Add a delay (e.g., 1 second) before displaying the Swal modal
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Teacher Created Successfully",
            html: `
        <div class="flex flex-col gap-2 items-start">
          <span><strong>Name:</strong> ${teacherData.name}</span>
          <span><strong>Email:</strong> ${teacherData.email}</span>
          <span><strong>Floor:</strong> ${teacherData.floor}</span>
          <span><strong>Teacher Schedules:</strong></span>
          <img src="${baseApiUrl}/storage/${
              teacherData.file_path
            }" alt="Teacher's File" style="max-width: 100%; max-height: 400px; object-fit: contain;" /> <br>
          <strong>Created:</strong> ${new Date(
            teacherData.created_at
          ).toLocaleString()} <br>
          <strong>Updated:</strong> ${new Date(
            teacherData.updated_at
          ).toLocaleString()} <br>
        </div>
      `,
            showConfirmButton: true,
            allowOutsideClick: false, // Disable clicking outside to close the modal
          });
        }, 5000); // Delay of 1 second (1000ms)
      }

    } catch (error) {
      console.error("API request failed:", error);
    }
  }, []);

  const handleUserClickedTeacher = useCallback(async (target) => {
    console.log(target);
    // Check if teachers exist and set them
    if (target.teachers && target.teachers.length > 0) {
      setTeachers(target);
      setIsModalOpen(true); // Open the modal when teachers are available
    } else {
      Swal.fire({
        title: "No teachers available for this unit.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  }, []);

  useEffect(() => {
    // Default to the Ground Floor when the component mounts
    const defaultFloor = "GROUND FLOOR";
    setCurrentFloor(defaultFloor); // Set initial floor state
    setActiveNav(defaultFloor); // Set the active navigation tab
    // Fetch floor plans for the default floor (Ground Floor) immediately
    fetchFloorplans(); // Using default values for currentFloor and currentPage
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const handleFloorChange = (floor) => {
    const defaultFloor = "GROUND FLOOR"; // Ensure default is set to "Ground Floor"

    // Set the floor and active nav dynamically based on user selection
    setCurrentFloor(floor ? floor : defaultFloor);
    setActiveNav(floor ? floor : defaultFloor);

    // Filter floorplans for the selected floor
    const filtered = floorplans.filter(
      (plan) => plan.floor === (floor || defaultFloor)
    );
    setFilteredFloorplans(filtered);

    // Set the file for the selected floor (use the first file or a default one)
    if (filtered.length > 0) {
      localStorage.setItem("filename", filtered[0].filepath);
      localStorage.setItem("floor", filtered[0].floor);
      setFile(filtered[0].filepath); // Update the file state for the SVG loader
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-screen relative">
      {/* Header */}
      <HeaderSection />

      <SVGLoader
        filePath={filteredFloorplans[0]?.filepath}
        onLoad={handleSVGLoad}
      />

      <TeacherModal
        isOpen={isModalOpen}
        onClose={closeModal}
        teachers={teachers}
        handleUserClicked={handleUserClicked}
      />

      <div className="grid grid-cols-3">
        {/* Sidebar - Mobile Off-Canvas */}
        <div
          className={`w-full fixed inset-0 bg-black/80 h-screen shadow-lg transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
        >
          <div className="mt-20">
            {/* Navigation Tabs */}
            <div className="mb-2 ps-4 flex items-center shadow">
              {floorplans && floorplans.length > 0 ? (
                floorplans.map((collection, index) => (
                  <button
                    key={index}
                    className={`py-2 mr-2 rounded-md text-sm ${
                      activeNav === collection.floor
                        ? "text-green-500"
                        : "text-white"
                    }`}
                    onClick={() => handleFloorChange(collection.floor)}
                  >
                    <i
                      className={`fa-solid fa-triangle rotate-90 text-sm ${
                        activeNav === collection.floor
                          ? "text-green-500"
                          : "text-white"
                      }`}
                    ></i>{" "}
                    {collection.floor}
                  </button>
                ))
              ) : (
                <div className="text-white text-sm">
                  <span className="mb-2">No floor plans available.</span>
                </div>
              )}
            </div>
            <div className="text-xs ps-4 capitalize text-white flex items-center gap-2 mb-2">
              <span>
                <i className="fa-solid fa-circle text-green-500 opacity-80"></i>{" "}
                Available option for{" "}
                <span className="capitalize text-bold">{activeNav}</span>
              </span>
            </div>
            <div className="px-5">
              <input
                type="text"
                placeholder="Search unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="px-4">
              <div className="border p-2 max-h-[80vh] overflow-y-auto shadow scrollable-content">
                {filteredFloorplans.length > 0 ? (
                  filteredFloorplans.map((plan, index) =>
                    plan.units
                    .filter((unit) =>
                        unit.unit.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((unit, unitIndex) => (
                      <div
                        className={`${
                          selectedItem.door === unit.door ? "bg-green-500" : ""
                        } p-2 mb-4 shadow rounded-md flex items-center justify-between transform transition-transform duration-300 hover:scale-105`}
                        key={unit.id}
                      >
                        <div className="w-[80%]">
                          <span
                            className={`${
                              selectedItem.door === unit.door
                                ? "text-white"
                                : "text-white"
                            } text-xs`}
                          >
                            <i
                              className={`${
                                selectedItem.door === unit.door
                                  ? "text-white"
                                  : "text-green-500"
                              } fa-solid fa-circle opacity-80 text-xs`}
                            ></i>{" "}
                            <span className="">{plan.floor}</span>
                          </span>
                          <span
                            className={`${
                              selectedItem.door === unit.door
                                ? "text-white"
                                : "text-white"
                            } block ps-4`}
                          >
                            {unit.unit}
                          </span>
                          <div className="flex gap-2 items-center ps-4 mt-2">
                            <button
                              onClick={() =>
                                handleUserClicked(
                                  {
                                    door: "kiosk",
                                    unit: "",
                                    availability: true,
                                    floor: "Ground Floor",
                                    image: "",
                                  },
                                  plan
                                )
                              }
                              type="button"
                              className={`text-xs bg-red-500 border border-white rounded-sm text-white p-1 ${
                                selectedItem.door === unit.door ? "" : "hidden"
                              }`}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUserClicked(unit, "")}
                              type="button"
                              className={`text-xs bg-green-500 border border-white rounded-sm text-white p-1 ${
                                unit.availability ? "" : "hidden"
                              }`}
                            >
                              Navigate
                            </button>
                            
                            <button
                              onClick={() => handleUserClickedTeacher(unit)}
                              type="button"
                              className={`text-xs bg-green-500 border border-white rounded-sm text-white p-1 ${
                                unit.availability && unit.teachers.length > 0 ? "" : "hidden"
                              }`}
                            >
                              Teachers
                            </button>
                          </div>
                          <div className="mt-2 px-4">
                            {selectedItem.door === unit.door && (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 0116 0h2a10 10 0 10-20 0h2z"
                                  ></path>
                                </svg>
                                <span className="ml-2 text-white text-[9px] capitalize">
                                  Navigating to {unit.unit}...
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="border rounded-md w-16 h-16 overflow-hidden">
                          <img
                            src={`${baseApiUrl}/storage/${unit?.image?.replace(
                              "public",
                              ""
                            )}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                    ))
                  )
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="p-2 text-center">
                      Kindly Click the Navigation Tab.
                    </span>
                  </div>
                )}

                {activeNav === "teachers" && (
                  <p className="text-gray-500">Teachers data will be here.</p>
                )}
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
            <i
              className={`fa-solid ${
                isSidebarOpen ? "fa-chevrons-left" : "fa-chevrons-right"
              }`}
            ></i>
          </button>

          {svgLoaded ? (
            // <ChartContainer
            //   infos={infos}
            //   handleUserClicked={handleUserClicked}
            //   target={selectedItem}
            //   file={file}
            //   data={defaultFloorplans}
            //   renderMap={renderMap}
            // />
            <InterractSvgMap
              onOpen={handleModalInterractOpen}
              currentFloor={currentFloor}
              floorplans={defaultFloorplans}
              shortestPath={shortestPath}
              trimmedTarget={trimmedTarget}
            />
          ) : (
            <>
              <div className="h-screen w-full flex items-center justify-center border">
                Loading SVG...{defaultFloorplans.floor}
              </div>
            </>
            // <InterractSvgMap
            //   onOpen={handleModalInterractOpen}
            //   currentFloor={currentFloor}
            //   floorplans={defaultFloorplans}
            // />
            // <div className="h-screen w-full flex items-center justify-center border">Loading SVG...{defaultFloorplans.floor}</div> // Or any default component or message you want
          )
          }
        </div>
      </div>

      <InterractModal
        defaultFloorplans={defaultFloorplans}
        isOpen={isOpen}
        infos={infos}
        onClose={handleModalInterractClose}
        handleUserClicked={handleUserClicked}
      />
    </div>
  );
};

export default NavigationPage;
