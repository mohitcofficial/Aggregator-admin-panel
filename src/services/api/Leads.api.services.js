import axios from "axios";
import { LEAD_URLs } from "../http.services";

export default {
  createLead: async function (body) {
    const { data } = await axios.post(`${LEAD_URLs.createLead}`, body, {
      withCredentials: true,
    });
    return data;
  },
  getLeads: async function (body) {
    const { data } = await axios.post(`${LEAD_URLs.getLeads}`, body, {
      withCredentials: true,
    });
    return data;
  },
  updateLead: async function (body, id) {
    const { data } = await axios.put(`${LEAD_URLs.updateLead}/${id}`, body, {
      withCredentials: true,
    });
    return data;
  },
  deleteLead: async function (id) {
    const { data } = await axios.delete(`${LEAD_URLs.deleteLead}/${id}`, {
      withCredentials: true,
    });
    return data;
  },
};
