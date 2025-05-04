import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const baseApiUrl = import.meta.env.VITE_API_URL;

const TeacherSchedule = () => {
  const token = localStorage.getItem("authToken"); // Get token from localStorage
  const [floorData, setData] = useState([]); // Store API data
  const [teacherData, setTeacherData] = useState([]); // Store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if it's edit mode
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Selected teacher for editing
  const [selectedFloor, setSelectedFloor] = useState("");
  const [availableUnits, setAvailableUnits] = useState([]);
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    floor: "",
    unit: "",
    file: null, // Store the selected file
  });

  const handleFloorChange = (e) => {
    const floorName = e.target.value;
    setSelectedFloor(floorName);

    // Find the floor object based on selection
    const floor = floorData.find((f) => f.floor === floorName);

    // Update the available units based on selected floor
    setAvailableUnits(floor ? floor.units : []);
    setTeacher({ ...teacher, floor: floorName, unit: "" }); // Reset unit selection
  };

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setTeacher({ ...teacher, file: e.target.files[0] }); // Set the file
    } else {
      setTeacher({ ...teacher, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", teacher.name);
    formData.append("email", teacher.email);
    formData.append("floor", teacher.floor);
    formData.append("unit", teacher.unit);
    if (teacher.file) {
      formData.append("file", teacher.file); // Append file to form data
    }

    try {
      const response = isEditMode
        ? await axios.post(
            `${baseApiUrl}/update-teacher/${selectedTeacher.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Important for file upload
              },
            }
          )
        : await axios.post(
            `${baseApiUrl}/create-teacher`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Important for file upload
              },
            }
          );

      console.log("✅ Teacher saved:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message, // "Teacher created successfully"
      });

      // Reset form
      setTeacher({ name: "", email: "", floor: "", unit: "", file: null });
      setIsModalOpen(false);

      fetchTeacherData();
    } catch (error) {
      console.error(
        "❌ Error saving teacher:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseApiUrl}/floorplan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseApiUrl}/getTeacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeacherData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    console.log(teacher);
    setIsEditMode(true);
    setTeacher({
      name: teacher.name,
      email: teacher.email,
      floor: teacher.floor,
      unit: teacher.unit,
      file: null, // Assuming file is not updated for now
    });
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchData();
    fetchTeacherData();
  }, []);

  // Delete teacher function
  const handleDelete = async (teacherId) => {
    // Show confirmation dialog using SweetAlert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // Proceed with deleting the teacher
      try {
        const response = await axios.delete(
          `${baseApiUrl}/delete-teacher/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Teacher deleted:", response.data);

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The teacher has been deleted successfully.",
        });

        // Remove the deleted teacher from state (UI update)
        setTeacherData((prevTeachers) =>
          prevTeachers.filter((teacher) => teacher.id !== teacherId)
        );
      } catch (error) {
        console.error("Error deleting teacher:", error);

        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 p-4 h-[97vh] overflow-y-auto">
        <h1 className="text-2xl font-bold">Teacher Information</h1>
        <p>Welcome to teacher information!</p>

        <div className="mt-2 py-2">
          <div className="mt-4 py-2">
            <h1 className="text-xl font-semibold">Latest Activity</h1>
            <div className="mb-4 flex justify-between items-center">
              <label htmlFor="filter" className="mr-2">
                Teacher table
              </label>
              <button
                onClick={() => setIsModalOpen(true)}
                className="border border-green-500 px-3 py-1 rounded text-green-500 hover:bg-green-100"
              >
                Add Teacher
              </button>
            </div>

            {/* Table */}
            <div className="w-full h-[50vh] overflow-y-auto">
              <table className="w-full table-auto border-collapse border-gray-200">
                <thead>
                  <tr className="bg-green-500 text-white">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Floor</th>
                    <th className="p-2 text-left">Unit</th>
                    <th className="p-2 text-left">Actions</th>{" "}
                    {/* Edit Action */}
                  </tr>
                </thead>
                <tbody>
                  {teacherData.length > 0 ? (
                    teacherData.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="text-left border-b-2 hover:bg-gray-100"
                      >
                        <td className="p-2">{teacher.id}</td>
                        <td className="p-2">{teacher.name}</td>
                        <td className="p-2">{teacher.email}</td>
                        <td className="p-2">{teacher.floor}</td>
                        <td className="p-2">{teacher.unit}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="px-3 py-1 text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border p-2 text-center">
                        No teachers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Teacher" : "Add New Teacher"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={teacher.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={teacher.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Floor</label>
                  <select
                    name="floor"
                    value={teacher.floor}
                    onChange={handleFloorChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Floor</option>
                    {floorData.map((floor) => (
                      <option key={floor.id} value={floor.floor}>
                        {floor.floor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block font-medium">Unit</label>
                  <select
                    name="unit"
                    value={teacher.unit}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                    disabled={!selectedFloor}
                  >
                    <option value="">Select Unit</option>
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block font-medium">
                    Attach File (PDF, Image)
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf,image/*"
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {isEditMode ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedule;
