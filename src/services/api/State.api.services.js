import axios from "axios";
import { STATE_URLs } from "../http.services";

export default {
  getAllStates: async function (token) {
    const { data } = await axios.get(`${STATE_URLs.allStates}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
  getStateInfo: async function (id, token) {
    const { data } = await axios.get(`${STATE_URLs.stateInfo}/${id}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
  deleteState: async function (id) {
    const { data } = await axios.delete(`${STATE_URLs.deleteState}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  editState: async function (body, id) {
    const { data } = await axios.put(`${STATE_URLs.editState}/${id}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return data;
  },
  addNewState: async function (body) {
    const { data } = await axios.post(`${STATE_URLs.addNewState}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      withCredentials: true,
    });
    return data;
  },
};
