import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// custom hook
import { useFetchSvgGroups } from "../../kiosk/customHook/useFetchSvgGroups";

const DashboardLayout = () => {
  const baseApiUrl = "http://127.0.0.1:8001/api";
  const [showModal, setShowModal] = useState(false); // State to toggle the modal
  const [file, setFile] = useState(null); // State to store the selected file
  const [filePath, setFilePath] = useState(null); // To hold the uploaded SVG file path
  const [loading, setLoading] = useState(false); // State for loading
  const [loadingGroups, setLoadingGroups] = useState(false); // State for loading
  const [facilities, setFacilities] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([])
  // Fetch groups using the custom hook, and always call it
  const fetchedGroups = useFetchSvgGroups(filePath); // Now the hook is always called unconditionally

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
        axios.post(
          `${baseApiUrl}/floorplan/units`,
          { facilities, uploadedFile },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("authToken") || 0,
            },
          }
        )
        .then((response) => {
          console.log('Server Response:', response.data);
          Swal.fire("Success", "Facilities information sent to the server successfully!", "success");
        })
        .catch((error) => {
          console.error("Error sending groups:", error);
          Swal.fire("Failed", "Failed to process the SVG information to the server.", "error");
        })
        .finally(() => {
          setLoadingGroups(false);
        });
      } catch (error) {
        console.error("Error sending facilities:", error);
        setLoadingGroups(false);
      }
    }
  }, [facilities]); // This will trigger when `facilities` state is updated

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update the file state when a file is selected
  };

  const handleFileUpload = async () => {
    if (!file) {
      // alert("Please select a file to upload.");
      Swal.fire("Failed to upload file", "Please select an svg file to upload!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the selected file to the form data

    setLoading(true); // Show loader

    try {
      const response = await axios.post(baseApiUrl + "/floorplan/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + localStorage.getItem("authToken") || 0,
        },
      });

      // alert(response.data.message); // Show success message
      Swal.fire("Success", response.data.message, "success");
      // fetch the svg to destructured the elements contents
      setFilePath(baseApiUrl + response.data.filePath);
      setUploadedFile([
        {
          fileName: response.data.fileName,
          filePath: response.data.filePath
        }
      ])
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error(error);
      Swal.fire("Failed", "Failed to upload file. Please try again.", "error");
    } finally {
      setLoading(false); // Hide loader after the upload is done or fails
    }
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4 h-screen">
        <h1 className="text-2xl font-bold">Campus Navigation Kiosk Dashboard</h1>
        <p>Welcome to Floor Information Level!</p>

        <div className="mt-2 py-2">
          <div className="mt-4 py-2">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-semibold text-green-500">
                Available FloorPlan Layout
              </h1>
              {/* Button to open the modal */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="border p-2 rounded-sm bg-green-500 text-white hover:bg-green-700"
              >
                Upload Floorplan
              </button>
            </div>
            <div className="w-full border py-2 p-2">
              <span>Table content here</span>
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
            <p className="ml-4 text-red-500 text-2xl">Collecting information...</p>
            <p className="ml-4 text-slate-700">Fetching facilities from the uploaded SVG...</p>
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
