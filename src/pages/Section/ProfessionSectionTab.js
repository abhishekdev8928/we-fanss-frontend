import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCelebritySections } from '../../api/celebritySection';
import Breadcrumb from '../../components/Common/Breadcrumb';

const ProfessionSectionTab = ({ celebId, onSectionChange }) => {
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Top links
  const topLinks = [
    { 
      title: 'Basic Info', 
      route: `/dashboard/update-celebrity/${celebId}` 
    },
     { 
      title: 'Custom Section', 
      route: `/dashboard/timeline-list/${celebId}`
    },
    { 
      title: 'Fixed Section', 
      route: `/dashboard/timeline-list/${celebId}` 
    },
   
  ];


   const breadcrumbItems = [
    { title: "Celebrity", link: "/dashboard/celebrity-list" },
    { title: "Profession Section", link: "#" },
  ];

  useEffect(() => {
    fetchSections();
  }, [celebId]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await getCelebritySections(celebId);
      
      if (response?.success && response?.data?.length > 0) {
        // ✅ Filter out sections with null sectionmaster
        const validSections = response.data.filter(sec => sec?.sectionmaster?._id);
        setSections(validSections);
        
        // ✅ Auto-select first valid section
        if (validSections.length > 0) {
          const firstSection = validSections[0];
          const sectionMasterId = firstSection.sectionmaster._id;
          setActiveTab(sectionMasterId);
          onSectionChange(sectionMasterId);
        }
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (sectionMasterId) => {
    setActiveTab(sectionMasterId);
    onSectionChange(sectionMasterId);
  };

  // ✅ Skeleton Loader
  const TabSkeleton = () => (
    <div className="d-flex flex-wrap border-bottom align-items-center mb-3" style={{ gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          style={{
            minWidth: "200px",
            padding: "16px 24px",
            backgroundColor: "transparent",
          }}
        >
          <div className="d-flex justify-content-center align-items-center gap-2">
            <div
              className="skeleton"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#e9ecef",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
            <div
              className="skeleton"
              style={{
                width: "80px",
                height: "16px",
                borderRadius: "4px",
                backgroundColor: "#e9ecef",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-4 align-items-center">
            <h4 className="mb-0 fs-4">Profession Section</h4>
            <div className="d-flex justify-content-between gap-3 align-items-center flex-wrap">
              {topLinks.map((link, index) => (
                <Link 
                  key={index}
                  className="text-theme" 
                  to={link.route} 
                  style={{ 
                    textDecoration: "none", 
                    fontSize: "14px",
                    color: "#4285F4",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
          <Breadcrumb breadcrumbItems={breadcrumbItems} />
        </div>

        {/* Skeleton Tabs */}
        <TabSkeleton />
      </>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-4 align-items-center">
          <h4 className="mb-0 fs-4">Profession Section</h4>
          <div className="d-flex justify-content-between gap-3 align-items-center flex-wrap">
            {topLinks.map((link, index) => (
              <Link 
                key={index}
                className="text-theme" 
                to={link.route} 
                style={{ 
                  textDecoration: "none", 
                  fontSize: "14px",
                  color: "#4285F4",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <Breadcrumb breadcrumbItems={breadcrumbItems} />
      </div>

      {/* Tabs Section */}
      <div 
        className="d-flex flex-wrap border-bottom align-items-center mb-3" 
        style={{ gap: "8px" }}
      >
        {sections.length > 0 ? (
          sections.map((sec, index) => {
            // ✅ Skip if sectionmaster is null or doesn't have _id
            if (!sec?.sectionmaster?._id) {
              return null;
            }

            return (
              <div
                key={sec._id || index}
                onClick={() => handleTabClick(sec.sectionmaster._id)}
                style={{
                  minWidth: "200px",
                  padding: "16px 24px",
                  cursor: "pointer",
                  backgroundColor: activeTab === sec.sectionmaster._id ? "#f8f9fa" : "transparent",
                  borderBottom: activeTab === sec.sectionmaster._id ? "3px solid #4285F4" : "3px solid transparent",
                  transition: "all 0.3s ease",
                  opacity: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== sec.sectionmaster._id) {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== sec.sectionmaster._id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: activeTab === sec.sectionmaster._id ? "#4285F4" : "#e9ecef",
                      color: activeTab === sec.sectionmaster._id ? "#fff" : "#6c757d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: "600",
                      flexShrink: 0,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div 
                    style={{ 
                      fontWeight: activeTab === sec.sectionmaster._id ? "600" : "normal", 
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: activeTab === sec.sectionmaster._id ? "#000" : "#6c757d",
                    }}
                  >
                    {sec.sectionmaster?.name || "Unnamed Section"}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center w-100 py-4">
            <i className="bx bx-folder-open" style={{ fontSize: "48px", color: "#e9ecef" }}></i>
            <p className="text-muted mb-0 mt-2">No custom sections available</p>
            <small className="text-muted">Add sections from profession settings</small>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfessionSectionTab;