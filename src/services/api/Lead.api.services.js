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
  getLeadByID: async function (id) {
    const { data } = await axios.get(`${LEAD_URLs.getLeadByID}/${id}`, {
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
  createFollowUp: async function (id, body) {
    const { data } = await axios.post(
      `${LEAD_URLs.createFollowUp}/${id}/followup`,
      body,
      {
        withCredentials: true,
      },
    );
    return data;
  },
  updateFollowUp: async function (leadId, followUpId, body) {
    const { data } = await axios.put(
      `${LEAD_URLs.updateFollowUp}/${leadId}/followup/${followUpId}`,
      body,
      {
        withCredentials: true,
      },
    );
    return data;
  },
  deleteFollowUp: async function (leadId, followUpId) {
    const { data } = await axios.delete(
      `${LEAD_URLs.updateFollowUp}/${leadId}/followup/${followUpId}`,
      {
        withCredentials: true,
      },
    );
    return data;
  },
};
