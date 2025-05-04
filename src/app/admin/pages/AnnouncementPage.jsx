import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AnnouncementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  const [image, setImage] = useState(null); // For storing the uploaded image
  const [imagePreview, setImagePreview] = useState(null); // For showing image preview
  const [title, setTitle] = useState(""); // For storing the announcement title
  const [description, setDescription] = useState(""); // For storing the announcement description
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); // For handling the announcement to be edited
  const token = localStorage.getItem("authToken"); // Get token from localStorage
  const [loading, setLoading] = useState(true); // Loading state
  const [announcements, setAnnouncement] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const baseApiUrl = import.meta.env.VITE_API_URL;

  const toggleModal = () => setShowModal(!showModal);
  const toggleEditModal = () => setShowEditModal(!showEditModal); // Toggle edit modal

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  // Handle input changes for title and description
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // handle get request
  const handleGetAnnouncement = async (e) => {
    try {
      const response = await axios.get(
        `${baseApiUrl}/announcement`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Announcement fetched:", response.data);
      setAnnouncement(response.data.announcements);
    } catch (error) {
      console.error(
        "❌ Error fetching announcement:",
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

  // Handle form submission for adding new announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${baseApiUrl}/announcement`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Announcement added:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
      });
      setShowModal(false);
      setTitle("");
      setDescription("");
      setImage(null);
      setImagePreview(null);
      handleGetAnnouncement();
    } catch (error) {
      console.error(
        "❌ Error adding announcement:",
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

  // Handle form submission for editing an existing announcement
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${baseApiUrl}/announcement/${editingAnnouncement.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Announcement updated:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
      });
      setShowEditModal(false);
      handleGetAnnouncement();
    } catch (error) {
      console.error(
        "❌ Error editing announcement:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  // Handle clicking the edit button for a specific announcement
  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setDescription(announcement.description);
    setImagePreview(`${baseApiUrl}/storage/${announcement.image}`);
    setShowEditModal(true);
  };

  // Format created_at date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Customize this as needed for specific date format
  };

  useEffect(() => {
    handleGetAnnouncement();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle deleting an announcement
  const handleDelete = async (announcementId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.delete(
          `${baseApiUrl}/announcement/${announcementId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Announcement deleted:", response.data);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data.message,
        });
        // Remove the deleted announcement from state
        setAnnouncement((prevAnnouncements) =>
          prevAnnouncements.filter(
            (announcement) => announcement.id !== announcementId
          )
        );
      } catch (error) {
        console.error(
          "❌ Error deleting announcement:",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: error.response?.data?.message || "Something went wrong!",
        });
      }
    }
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4 h-[97vh] overflow-y-auto">
        <h1 className="text-2xl font-bold">
          Campus Navigation Kiosk Dashboard
        </h1>
        <p>Welcome to Announcement Information!</p>

        <div className="mt-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold">Manage Announcement</h1>
            <button
              onClick={toggleModal}
              className="bg-green-500 px-3 py-1 text-white rounded-sm hover:bg-green-600"
            >
              Create
            </button>
          </div>
          <div className="flex items-end justify-end">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
          </div>
          {/* Modal for Creating Announcement */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold mb-4">New Announcement</h2>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="border px-3 py-2 rounded"
                    rows="3"
                    required
                  />

                  {/* Image Upload */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border px-3 py-2 rounded w-full"
                      required
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          className="w-full h-32 object-cover rounded mt-2"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal for Editing Announcement */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                  onClick={toggleEditModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold mb-4">
                  Edit Announcement
                </h2>
                <form onSubmit={handleEditSubmit} className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitleChange}
                    className="border px-3 py-2 rounded"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}
                    className="border px-3 py-2 rounded"
                    rows="5"
                    required
                  />

                  {/* Image Upload */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          className="w-full h-32 object-cover rounded mt-2"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Announcement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {filteredAnnouncements.map((announcement, index) => (
              <div
                key={index}
                className="border rounded-xl bg-white shadow overflow-hidden"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={`${baseApiUrl}/storage/${announcement.image.replace(
                      "public/",
                      ""
                    )}`}
                    alt="Announcement Banner"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 grid grid-cols-1 gap-4">
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-gray-800 break-words">
                      📢 {announcement.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 break-words overflow-hidden text-ellipsis whitespace-nowrap">
                      {announcement.description}
                    </p>
                  </div>

                  <div className="text-right flex flex-col justify-between items-end">
                    <span className="text-xs text-gray-400">
                      Posted on: {formatDate(announcement.created_at)}
                    </span>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <button
                        onClick={() => handleEditClick(announcement)} // Edit button
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)} // Delete button
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
