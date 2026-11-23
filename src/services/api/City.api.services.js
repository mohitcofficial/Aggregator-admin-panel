import axios from "axios";
import { CITY_URLs } from "../http.services";

export default {
  getAllCities: async function (token) {
    const { data } = await axios.get(`${CITY_URLs.allCities}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
  getCityInfo: async function (id, token) {
    const { data } = await axios.get(`${CITY_URLs.cityInfo}/${id}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
  deleteCity: async function (id) {
    const { data } = await axios.delete(`${CITY_URLs.deleteCity}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  editCity: async function (body, id) {
    const { data } = await axios.put(`${CITY_URLs.editCity}/${id}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return data;
  },
  addNewCity: async function (body) {
    const { data } = await axios.post(`${CITY_URLs.addNewCity}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return data;
  },
};
