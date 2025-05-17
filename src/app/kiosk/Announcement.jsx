import React, { useEffect, useState } from "react";
import HeaderSection from "./components/kiosk/HeaderSection";
import axios from "axios";
const Announcement = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const baseApiUrl = import.meta.env.VITE_API_URL;

  const DEFAULT_IMAGE =
    "https://i.pinimg.com/474x/2a/48/41/2a4841f962adde593706e85ccfe1eb4a.jpg";
  const DEFAULT_BASE_URL = "http://127.0.0.1:8001/api";
  // handle get request
  const handleGetAnnouncement = async (e) => {
    try {
      const response = await axios.get(
        `${baseApiUrl}/announcement`
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      console.log("✅ Announcement fetched:", response.data);
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error(
        "❌ Error fetching announcement:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetAnnouncement();
    // Replace with real data or API call
    // setAnnouncements([
    //   {
    //     id: 1,
    //     title: "System Maintenance",
    //     message: "The system will be down from 10:00 PM to 12:00 AM.",
    //     date: "April 9, 2025",
    //     created_at: new Date(),
    //     image: "https://via.placeholder.com/600x200",
    //   },
    //   {
    //     id: 2,
    //     title: "New Feature Released",
    //     message: "We've added a new feature to enhance the kiosk.",
    //     date: "April 7, 2025",
    //     created_at: new Date("2025-04-07T09:00:00"),
    //     image: null,
    //   },
    //   {
    //     id: 3,
    //     title: "Power Interruption",
    //     message: "Power will be temporarily cut off at 3 PM.",
    //     date: "April 6, 2025",
    //     created_at: new Date("2025-04-06T14:00:00"),
    //     image: null,
    //   },
    // ]);
  }, []);

  const isNew = (created_at) => {
    const now = new Date();
    const createdDate = new Date(created_at);
    const diffInHours = (now - createdDate) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const selected = announcements[selectedIndex];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "long", // "April"
      day: "numeric", // "7"
      year: "numeric", // "2025"
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // "PM"
    });
  };

  return (
    <>
      <HeaderSection />
      <div className="h-screen bg-gray-100 p-4 flex justify-center items-start py-20">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 h-full relative">
          {/* Sidebar: Announcements */}
          <div
            className={`
      md:static md:block 
      ${
        mobileSidebarOpen
          ? "fixed inset-0 z-40 bg-white p-4 overflow-y-auto"
          : "hidden"
      } 
        md:col-span-1 rounded-2xl shadow-md h-full
      `}
          >
            {/* Close button on mobile */}
            <div className="flex justify-between items-center md:hidden mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                🗂️ All Announcements
              </h2>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* Heading on desktop */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4 hidden md:block">
              🗂️ All Announcements
            </h2>

            <ul className="space-y-2">
              {announcements.map((item, index) => (
                <li
                  key={item.id}
                  className={`p-3 rounded-lg cursor-pointer border relative ${
                    selectedIndex === index
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedIndex(index);
                    setMobileSidebarOpen(false); // auto-close on mobile
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.created_at)}
                  </p>
                  {isNew(item.created_at) && (
                    <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full shadow">
                      NEW
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 w-full bg-white rounded-2xl shadow-md p-8 h-full relative">
            {selected ? (
              <div className="h-full w-full">
                <div className="relative mb-4 w-full h-fit">
                  <img
                    src={
                      `${baseApiUrl}/storage/${selected.image.replace(
                        "public/",
                        ""
                      )}` || DEFAULT_IMAGE
                    }
                    alt={selected.title}
                    className="w-full h-[500px] border object-cover rounded-md"
                  />
                  
                  {isNew(selected.created_at) && (
                    <span className="absolute top-2 right-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full shadow">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full border">
                  <h1 className="text-4xl font-bold text-gray-800 mb-1 break-words">
                    {selected.title}
                  </h1>
                  <p className="text-base text-gray-700 break-words">
                    {selected.description} 
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(selected.created_at)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Select an announcement to view details.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      {!mobileSidebarOpen && (
        <div className="md:hidden fixed top-20 left-0 z-50 bg-green-500/80">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="bg-green-500/80 p-2 rounded shadow text-sm font-medium text-white"
          >
            🗂️ Announcements
          </button>
        </div>
      )}
    </>
  );
};

export default Announcement;
