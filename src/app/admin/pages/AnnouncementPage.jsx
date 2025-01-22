import React from "react";

const AnnouncementPage = () => {
  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-4 h-[97vh] overflow-y-auto">
                <h1 className="text-2xl font-bold">Campus Navigation Kiosk Dashboard</h1>
                <p>Welcome to Announcement Information!</p>

                <div className="mt-2 py-2">

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

export default AnnouncementPage;
