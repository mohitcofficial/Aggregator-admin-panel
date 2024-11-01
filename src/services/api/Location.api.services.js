import axios from "axios";
import { LOCATION_URLs } from "../http.services";

export default {
  getAllLocations: async function (token) {
    const { data } = await axios.get(`${LOCATION_URLs.allLocations}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
  getLocationInfo: async function (id, token) {
    const { data } = await axios.get(`${LOCATION_URLs.locationInfo}/${id}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
  deleteLocation: async function (id) {
    const { data } = await axios.delete(
      `${LOCATION_URLs.deleteLocation}/${id}`,
      {
        withCredentials: true,
      }
    );
    return data;
  },
  editLocation: async function (body, id) {
    const { data } = await axios.put(
      `${LOCATION_URLs.editLocation}/${id}`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return data;
  },
  addNewLocation: async function (body) {
    const { data } = await axios.post(`${LOCATION_URLs.addNewLocation}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return data;
  },
  updateLocationImage: async function (body, id) {
    const { data } = await axios.put(
      `${LOCATION_URLs.updateLocationImage}/${id}`,
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return data;
  },
  deleteLocationImage: async function (id, params) {
    const { data } = await axios.delete(
      `${LOCATION_URLs.deleteLocationImage}/${id}`,
      { params, withCredentials: true }
    );
    return data;
  },
};
