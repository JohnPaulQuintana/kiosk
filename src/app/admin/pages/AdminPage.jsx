import React from "react";
import LoginComponent from "../../admin/components/LoginComponent";
import DashboardComponents from "../../admin/components/DashboardComponent";

const AdminPage = () => {
    return (
        <div className="border h-[97vh] overflow-y-auto">
            {/* dashboard */}
            <DashboardComponents />
        </div>
    )
}

export default AdminPage