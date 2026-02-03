
// =====================================================

// UpdateCelebraty.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CelebrityForm from "../../components/Common/CelebrityForm";
import { getCelebratyById } from "../../api/celebratyApi";

const UpdateCelebraty = () => {
  const { id } = useParams();
  const [celebrityData, setCelebrityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCelebrityData();
  }, [id]);

  const fetchCelebrityData = async () => {
    try {
      setLoading(true);
      const res_data = await getCelebratyById(id);
      if (res_data.msg) {
        setCelebrityData(res_data.msg);
      } else {
        toast.error("Celebrity not found");
      }
    } catch (error) {
      console.error("Fetch Celebrity error:", error);
      toast.error("Failed to fetch Celebrity data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!celebrityData) {
    return (
      <div className="page-content">
        <div className="text-center p-5">
          <h4>Celebrity not found</h4>
        </div>
      </div>
    );
  }

  return (
    <CelebrityForm 
      mode="edit" 
      celebrityId={id} 
      initialData={celebrityData} 
    />
  );
};

export default UpdateCelebraty;