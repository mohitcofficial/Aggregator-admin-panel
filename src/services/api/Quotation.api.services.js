import axios from "axios";
import { QUOTATION_URLs } from "../http.services";

export default {
  getAllQuotations: async function ({
    page = 1,
    limit = 20,
    search = "",
  } = {}) {
    const { data } = await axios.get(QUOTATION_URLs.getAllQuotations, {
      params: {
        page,
        limit,
        search,
      },
      withCredentials: true,
    });

    return data;
  },
  updateQuotation: async function (id, body) {
    const { data } = await axios.get(
      `${QUOTATION_URLs.updateQuotation}/${id}`,
      body,
      {
        withCredentials: true,
      },
    );

    return data;
  },
  getQuotationByID: async function (id) {
    const { data } = await axios.get(
      `${QUOTATION_URLs.getQuotationByID}/${id}`,
      {
        withCredentials: true,
      },
    );

    return data;
  },

  downloadQuotation: async function (id) {
    const { data } = await axios.get(
      `${QUOTATION_URLs.downloadQuotation}/${id}/pdf`,
      {
        withCredentials: true,
        responseType: "blob",
      },
    );

    return data;
  },
};
