import React from "react";
import { Link } from "react-router-dom";

const HeaderSection = () => {
    return (
        <div className="fixed border top-0 z-20 w-full p-4 wider:pt-6 px-5 wider:px-20 border-none items-center text-gray-700 flex justify-between bg-white shadow">
            <Link to={"/"}>
                <span className="font-bold text-slate-800">
                    BATAAN HEROES COLLEGE
                </span>
            </Link>
            <div className="hidden lg:block">
                <ul className="flex gap-2 text-sm">
                    <li className="">
                        <Link to={"/"}>Home</Link>
                    </li>
                    <li>
                        <a href="#">Announcement</a>
                    </li>
                    <li className="">
                        <a href="#">Guidelines</a>
                    </li>
                    
                </ul>
            </div>
        </div>
    )
}

export default HeaderSection