import React, { useState, useEffect, FC } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { v4 as uuid } from "uuid";
import credentials from "../../credentials.js";
import UserMarker from "../../assets/images/icons/markerBlue.png";

import { ILocationData } from "../../types/location";

interface IMapContainer {
  data: ILocationData[];
  fetchLocations: () => void;
}

interface ICurrentPosition {
  lat: number;
  lng: number;
}

interface IItemSelected {
  item: ILocationData;
  location: ICurrentPosition;
}

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

const MapContainer: FC<IMapContainer> = ({ data, fetchLocations }) => {
  const [currentPosition, setCurrentPosition] = useState<ICurrentPosition>({
    lat: 37.7877332717998,
    lng: -122.39566345752182,
  });
  const [selected, setSelected] = useState<IItemSelected>({
    item: defaultLocation,
    location: { lat: currentPosition.lat, lng: currentPosition.lng },
  });
  const [newData, setNewData] = useState<ILocationData[]>([defaultLocation]);
  const [matchRadiusLocation, setMatchRadiusLocation] = useState<
    ILocationData[]
  >([defaultLocation]);
  const [loadingMarker, setLoadingMarker] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");

  const iconBase = UserMarker;

  const mapStyles = {
    height: "100vh",
    width: "100%",
  };

  const matchLocations = async () => {
    setLoadingMarker(true);

    if (newData.length > 0) {
      await newData.map((location: ILocationData) => {
        const locationLat = Number(location.latitude);
        const locationLng = Number(location.longitude);
        return distance(
          currentPosition.lat,
          currentPosition.lng,
          locationLat,
          locationLng,
          "k",
          location
        );
      });
    }
    return setLoadingMarker(false);
  };

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const coordinates = await getLatLng(results[0]);
    setMatchRadiusLocation([]);
    setAddress(value);
    setCurrentPosition(coordinates);
  };

  const onSelect = (item: ILocationData, location: ICurrentPosition) => {
    setSelected({ item, location });
  };

  const onDragEnd = (e: any) => {
    setMatchRadiusLocation([]);
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCurrentPosition({ lat, lng });
    fetchLocations();
  };

  const distance = async (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string,
    item: ILocationData
  ) => {
    let temporalData = matchRadiusLocation;

    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }

    if (dist < 0.621) {
      temporalData.push(item);
    }

    return setMatchRadiusLocation(temporalData);
  };

  useEffect(() => {
    setNewData(data);
    matchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    matchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  useEffect(() => {
    matchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newData]);

  return (
    <LoadScript googleMapsApiKey={credentials} libraries={["places"]}>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="relative ">
            <input
              {...getInputProps({
                placeholder: "Search food in your location ...",
                className: "location-search-input truncate",
              })}
              className="w-full lg:max-w-xs max-w-296px h-9 px-2 absolute z-10 top-5 left-0 right-0 ml-auto mr-auto shadow-lg truncate"
            />

            <div className="autocomplete-dropdown-container w-full  lg:max-w-xs max-w-296px absolute z-10 top-14 left-0 right-0 ml-auto mr-auto">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? "suggestion-item--active pl-2"
                  : "suggestion-item pl-2";
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={uuid()}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={currentPosition}
        mapTypeId="ROADMAP"
        options={{
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {!loadingMarker &&
          matchRadiusLocation &&
          matchRadiusLocation.length > 0 &&
          matchRadiusLocation.map((item: ILocationData) => {
            const location = {
              lat: Number(item.latitude),
              lng: Number(item.longitude),
            };

            return (
              <Marker
                key={uuid()}
                position={location}
                onClick={() => onSelect(item, location)}
                icon={iconBase}
              />
            );
          })}

        {currentPosition.lat ? (
          <>
            <Marker
              position={currentPosition}
              onDragEnd={(e) => onDragEnd(e)}
              draggable={true}
              key={uuid()}
            />
            <Circle
              center={currentPosition}
              radius={1000}
              onDragEnd={(e) => onDragEnd(e)}
              draggable={true}
              options={{
                strokeColor: "#ff0000",
                fillColor: "#f5a87f",
                fillOpacity: 0.15,
              }}
            />
          </>
        ) : null}

        {selected.item.fooditems && (
          <InfoWindow
            position={selected.location}
            onCloseClick={() =>
              setSelected({
                item: defaultLocation,
                location: { lat: 0, lng: 0 },
              })
            }
          >
            <p>{selected.item.fooditems}</p>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
export default MapContainer;
