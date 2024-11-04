import axios from "axios";
import { ADMIN_URLs } from "../http.services";

export default {
  createAdmin: async function (body) {
    const { data } = await axios.post(`${ADMIN_URLs.createAdmin}`, body, {
      withCredentials: true,
    });
    return data;
  },
  login: async function (body) {
    const { data } = await axios.post(`${ADMIN_URLs.login}`, body, {
      withCredentials: true,
    });
    return data;
  },
  logout: async function () {
    const { data } = await axios.get(`${ADMIN_URLs.logout}`, {
      withCredentials: true,
    });
    return data;
  },
  getMyProfile: async function (token) {
    const { data } = await axios.get(`${ADMIN_URLs.getMyProfile}`, {
      headers: {
        Cookie: `authToken=${token}`,
      },
      withCredentials: true,
    });
    return data;
  },
};
