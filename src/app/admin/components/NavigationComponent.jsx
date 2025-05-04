import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// custom hook
import { useFetchSvgGroups } from "../../kiosk/customHook/useFetchSvgGroups";

const DashboardLayout = () => {
  const baseApiUrl = import.meta.env.VITE_API_URL;
  const [showModal, setShowModal] = useState(false); // State to toggle the modal
  const [file, setFile] = useState(null); // State to store the selected file
  const [filePath, setFilePath] = useState(null); // To hold the uploaded SVG file path
  const [loading, setLoading] = useState(false); // State for loading
  const [loadingGroups, setLoadingGroups] = useState(false); // State for loading
  const [facilities, setFacilities] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);

  // Pagination States
  const [currentFloor, setCurrentFloor] = useState("FLOOR OPTION");
  const [floorplans, setFloorplans] = useState([]);
  const [filteredFloorplans, setFilteredFloorplans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch groups using the custom hook, and always call it
  const fetchedGroups = useFetchSvgGroups(filePath); // Now the hook is always called unconditionally
  // const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (fetchedGroups && fetchedGroups.length > 0) {
      setFacilities(fetchedGroups);
    }
  }, [fetchedGroups]); // Update facilities when fetchedGroups changes

  useEffect(() => {
    // This effect runs after the facilities are updated
    if (facilities.length > 0) {
      // Automatically send the groups to the server after successful upload
      try {
        setLoadingGroups(true);
        axios
          .post(
            `${baseApiUrl}/floorplan/units`,
            { floor: facilities[0].floor, facilities, uploadedFile },
            {
              headers: {
                Authorization:
                  "Bearer " + localStorage.getItem("authToken") || 0,
              },
            }
          )
          .then((response) => {
            console.log("Server Response:", response.data);
            Swal.fire(
              "Success",
              "Facilities information sent to the server successfully!",
              "success"
            );

            // fecth the units and current floor
            fetchFloorplans(currentPage);
          })
          .catch((error) => {
            console.error("Error sending groups:", error);
            Swal.fire(
              "Failed",
              "Failed to process the SVG information to the server.",
              "error"
            );
          })
          .finally(() => {
            setLoadingGroups(false);
          });
      } catch (error) {
        console.error("Error sending facilities:", error);
        setLoadingGroups(false);
      }
    }
  }, [facilities, currentPage]); // This will trigger when `facilities` state is updated

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the file state when a file is selected
  };

  const handleFileUpload = async () => {
    if (!file) {
      // alert("Please select a file to upload.");
      Swal.fire(
        "Failed to upload file",
        "Please select an svg file to upload!",
        "error"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the selected file to the form data

    setLoading(true); // Show loader

    try {
      const response = await axios.post(
        baseApiUrl + "/floorplan/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("authToken") || 0,
          },
        }
      );

      // alert(response.data.message); // Show success message
      Swal.fire("Success", response.data.message, "success");
      // fetch the svg to destructured the elements contents
      setFilePath(baseApiUrl + response.data.filePath);
      setUploadedFile([
        {
          fileName: response.data.fileName,
          filePath: response.data.filePath,
        },
      ]);
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error(error);
      Swal.fire("Failed", "Failed to upload file. Please try again.", "error");
    } finally {
      setLoading(false); // Hide loader after the upload is done or fails
    }
  };

  const fetchFloorplans = async (page = 1) => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `${baseApiUrl}/floorplan/unit/collections`,
        {
          params: { page, currentFloor },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken") || 0,
          },
        }
      );

      setFloorplans(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Error fetching floorplans:", error);
      Swal.fire("Failed", "Failed to fetch floorplans.", "error");
    } finally {
      setIsFetching(false);
    }
  };

  // Handle floor selection filter
  const handleFloorChange = (e) => {
    const selectedFloor = e.target.value;
    setCurrentFloor(selectedFloor);

    // Filter floorplans by the selected floor
    const filtered = floorplans.filter((plan) => plan.floor === selectedFloor);
    setFilteredFloorplans(filtered);
  };

  //load on load
  useEffect(() => {
    // fecth the units and current floor
    fetchFloorplans(currentPage);
  }, [currentPage]);

  const handleEditWithSwal = async (unit) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Unit',
      html: `
        <input id="swal-unit" class="swal2-input" placeholder="Unit" value="${unit.unit}" />
        <select id="swal-availability" class="swal2-input">
          <option value="true" ${unit.availability ? 'selected' : ''}>Available</option>
          <option value="false" ${!unit.availability ? 'selected' : ''}>Unavailable</option>
        </select>
        <label class="text-left block text-sm mt-2">Old Unit: <b>${unit.old_unit}</b></label>
        <input type="file" id="swal-image" class="swal2-file" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const unitVal = document.getElementById('swal-unit').value;
        const availVal = document.getElementById('swal-availability').value === 'true';
        const imageFile = document.getElementById('swal-image').files[0];
        return { unit: unitVal, availability: availVal, image: imageFile };
      }
    });
  
    if (formValues) {
      const formData = new FormData();
      formData.append("unit", formValues.unit);
      formData.append("availability", formValues.availability);
      if (formValues.image) {
        formData.append("image", formValues.image);
      }
  
      try {
        await axios.post(`${baseApiUrl}/floorplan/unit/update/${unit.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + (localStorage.getItem("authToken") || ""),
          },
        });
  
        Swal.fire("Success", "Unit updated successfully", "success");
        fetchFloorplans(currentPage); // Refresh data
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Something went wrong while updating!", "error");
      }
    }
  };
  
  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 p-4 h-[90vh] w-full overflow-hidden">
        <h1 className="text-2xl font-bold">
          Campus Navigation Kiosk Dashboard
        </h1>
        <p>Welcome to Floor Information Level!</p>

        <div className="py-2">
          <div className="py-2">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-semibold text-green-500">
                Available FloorPlan Layout
              </h1>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="border p-2 rounded-sm bg-green-500 text-white hover:bg-green-700"
              >
                Upload Floorplan
              </button>
            </div>

            {/* Floor filter dropdown */}
            <div className="mb-4">
              <label htmlFor="floorFilter" className="block text-gray-700">
                Filter by Floor:
              </label>
              <select
                id="floorFilter"
                onChange={handleFloorChange}
                value={currentFloor}
                className="mt-2 p-2 border border-gray-300 rounded-md"
              >
                {/* Dynamically generate options for 12 floors */}
                {[
                  "FLOOR OPTION",
                  "GROUND FLOOR",
                  "FIRST FLOOR",
                  "SECOND FLOOR",
                  "THIRD FLOOR",
                  "FOURTH FLOOR",
                  "FIFTH FLOOR",
                  "SIXTH FLOOR",
                  "SEVENTH FLOOR",
                  "EIGHTH FLOOR",
                  "NINTH FLOOR",
                  "TENTH FLOOR",
                  "ELEVENTH FLOOR",
                ].map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full border bg-white py-2 p-2">
              {isFetching ? (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
                    <div className="loader border-t-4 border-green-500 border-solid w-12 h-14 rounded-full animate-spin"></div>
                    <p className="ml-4 text-green-500 text-2xl">
                      In Progress...
                    </p>
                    <p className="ml-4 text-slate-700">
                      Collecting all the units for the current floor...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[50vh] overflow-y-auto">
                  <table className="w-full table-auto border-collapse border-0 border-gray-200">
                    <thead>
                      <tr className="bg-green-500 text-white">
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Unit</th>
                        <th className="p-2 text-left">Availability</th>
                        <th className="p-2 text-left">Old Unit</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {filteredFloorplans.length > 0 ? (
                        filteredFloorplans.map((plan, index) =>
                          plan.units.map((unit, unitIndex) => (
                            <tr
                              key={`${index}-${unitIndex}`}
                              className="text-left border-b-2 hover:bg-gray-100"
                            >
                              <td className="p-2">{unit.id}</td>
                              <td className="p-2">{unit.unit}</td>
                              <td className="p-2">
                                <span
                                  className={`text-xs text-white ${
                                    unit.availability
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  } rounded-md px-2`}
                                >
                                  {unit.availability ? "True" : "False"}
                                </span>
                              </td>
                              <td className="p-2">{unit.old_unit}</td>
                              <td className="p-2">
                                <button
                                  className="text-blue-500 hover:underline"
                                  onClick={() => handleEditWithSwal(unit)}
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        <tr>
                          <td colSpan="5" className="border p-2 text-center">
                            No data found for selected floor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="loader border-t-4 border-green-500 border-solid w-12 h-14 rounded-full animate-spin"></div>
            <p className="ml-4 text-green-500 text-2xl">In Progress...</p>
            <p className="ml-4 text-slate-700">Uploading floorplan layout...</p>
          </div>
        </div>
      )}
      {/* Loader for collecting facilities */}
      {loadingGroups && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
            <div className="loader border-t-4 border-red-500 border-solid w-12 h-14 rounded-full animate-spin"></div>
            <p className="ml-4 text-red-500 text-2xl">
              Collecting information...
            </p>
            <p className="ml-4 text-slate-700">
              Fetching facilities from the uploaded SVG...
            </p>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Upload Floorplan</h2>
            <input
              type="file"
              accept=".svg"
              onChange={handleFileChange}
              className="mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
