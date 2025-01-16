import React, {useEffect, useState} from "react";
import FloorplanGrid from "../components/FloorplanGrid";


const Home = () => {
    return (
        <div className="p-4">
            <FloorplanGrid rows={100} cols={100} />
        </div>
    )
}

export default Home