import React from "react";
import { MapView, useMapData, useMap, Label } from '@mappedin/react-sdk';
import '@mappedin/react-sdk/lib/esm/index.css';
import MapComponent from "../components/MapComponent";

const Home = () => {

    // mappedin free credentials
    const { isLoading, error, mapData } = useMapData({
		key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
		secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
		mapId: '66686f1af06f04000b18b8fa',
	});

    if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

    return mapData ? (
        <MapView mapData={mapData}>
			{/* add a custom components here */}
            <MapComponent/>
		</MapView>
    ) : null;
}

export default Home