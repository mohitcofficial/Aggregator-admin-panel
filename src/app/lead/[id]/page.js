"use client";

import CustomLayout from "@/components/CustomLayout";
import React, { useEffect, useState } from "react";

export default function Page({ params }) {
  const { id } = params;

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchLead = async () => {
    try {
      setLoading(true);

      const data = await LeadsApiServices.getLeadById(id);

      if (!data?.lead) {
        setNotFound(true);
      } else {
        setLead(data.lead);
      }
    } catch (error) {
      console.log(error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  return <CustomLayout>{id}</CustomLayout>;
}
