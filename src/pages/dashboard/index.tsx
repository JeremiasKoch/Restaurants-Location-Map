import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import MapContainer from "../../components/map";
import { ILocationData } from "../../types/location";

const defaultLocation = {
  address: "",
  applicant: "",
  approved: "",
  block: "",
  blocklot: "",
  cnn: "",
  expirationdate: "",
  facilitytype: "",
  fooditems: "",
  latitude: "",
  location: { human_address: "", latitude: "", longitude: "" },
  locationdescription: "",
  longitude: "",
  lot: "",
  objectid: "",
  permit: "",
  priorpermit: "",
  received: "",
  schedule: "",
  status: "",
  x: "",
  y: "",
};


const Dashboard = () => {
  const [fetchFoodLocation, setFetchFoodLocation] = useState<ILocationData[]>([]);

  const fetchLocations = async () => {
    axios
      .get("https://data.sfgov.org/resource/rqzj-sfat.json")
      .then((resp: AxiosResponse<never>) => setFetchFoodLocation(resp.data))
      .catch((err: Error | AxiosError) => setFetchFoodLocation([ defaultLocation]))};

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
