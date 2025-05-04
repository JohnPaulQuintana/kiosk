import React from "react";
import { Link } from "react-router-dom";

const HeaderSection = () => {
    return (
        <div className="fixed border top-0 z-20 w-full p-4 wider:pt-6 px-5 wider:px-20 border-none items-center text-gray-700 flex flex-col lg:flex-row justify-between bg-white shadow">
            <Link to={"/"}>
                <span className="font-bold text-slate-800">
                    BATAAN HEROES COLLEGE
                </span>
            </Link>
            <div className="">
                <ul className="flex gap-2 text-sm">
                    <li className="border p-1">
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li className="border p-1">
                        <Link to={"/announcement"}>Announcement</Link>
                    </li>
                    <li className="border p-1">
                        <Link to={"/navigation/ground"}>Navigation</Link>
                    </li>
                    
                </ul>
            </div>
        </div>
    )
}

export default HeaderSection