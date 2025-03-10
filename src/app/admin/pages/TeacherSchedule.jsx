import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TeacherSchedule = () => {
  const token = localStorage.getItem("authToken"); // Get token from localStorage
  const [floorData, setData] = useState([]); // Store API data
  const [teacherData, setTeacherData] = useState([]); // Store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [availableUnits, setAvailableUnits] = useState([]);
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    floor: "",
    unit: "",
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
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/api/create-teacher",
        teacher,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Teacher added:", response.data);
      //   alert("Teacher added successfully!");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message, // "Teacher created successfully"
      });

      // Reset form
      setTeacher({ name: "", email: "", floor: "", unit: "" });
      setIsModalOpen(false);

      fetchTeacherData();

    } catch (error) {
      console.error(
        "❌ Error adding teacher:",
        error.response?.data || error.message
      );
      //   alert("Failed to add teacher. Please try again.");
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
      const response = await axios.get(
        "http://127.0.0.1:8001/api/floorplan",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Adjust API URL if needed
      setData(response.data);
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
      const response = await axios.get(
        "http://127.0.0.1:8001/api/getTeacher",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Adjust API URL if needed
      setTeacherData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTeacherData();
  }, []);

  console.log(floorData);
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
                  </tr>
                </thead>
                <tbody>
                {teacherData.length > 0 ? (
                        teacherData.map((teacher, index) => (
                            <tr key={`${teacher.id}`} className="text-left border-b-2 hover:bg-gray-100">
                            <td className="p-2">{teacher.id}</td>
                            <td className="p-2">{teacher.name}</td>
                            <td className="p-2">{teacher.email}</td>
                            <td className="p-2">{teacher.floor}</td>
                            <td className="p-2">{teacher.unit}</td>
                           
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="border p-2 text-center">No data found for selected floor.</td>
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
              <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
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
                    Save
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
