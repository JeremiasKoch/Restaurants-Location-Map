import React, { useState, useEffect } from "react";
import MapContainer from "../../components/map";

import axios from "axios";

const Dashboard = () => {
  const [fetchFoodLocation, setFetchFoodLocation] = useState<any[]>([]);

  const fetchLocations = async () => {
    axios
      .get("https://data.sfgov.org/resource/rqzj-sfat.json")
      .then((resp: any) => setFetchFoodLocation(resp.data))
      .catch((err: any) => setFetchFoodLocation(err));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-500">
      <MapContainer data={fetchFoodLocation} fetchLocations={fetchLocations} />
    </div>
  );
};

export default Dashboard;
