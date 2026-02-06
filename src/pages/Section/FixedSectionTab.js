import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getProfessionsByCelebrityId } from '../../api/professionalmasterApi';

const FixedSectionTab = ({ activeTabId }) => {
  const navigate = useNavigate();
  const { id, celebId } = useParams();
  
  // Use whichever param is available (different routes might use different param names)
  const celebrityId = id || celebId;
  
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [celebrityName, setCelebrityName] = useState("");

  const staticTabs = [
    { _id: 'timeline', title: 'Timeline', icon: 'bx-time', route: `/dashboard/timeline-list/${celebrityId}` },
    { _id: 'trivia', title: 'Trivia', icon: 'bx-bulb', route: `/dashboard/triviaentries-list/${celebrityId}` },
    { _id: 'custom', title: 'Custom', icon: 'bx-customize', route: `/dashboard/customoption-list/${celebrityId}` },
    { _id: 'references', title: 'References', icon: 'bx-link-alt', route: `/dashboard/references-list/${celebrityId}` },
    { _id: 'related', title: 'Related Personalities', icon: 'bx-group', route: `/dashboard/related-personalities-list/${celebrityId}` },
  ];

  // ✅ Simple Top Links (Blue Color)
  const topLinks = [
    { 
      title: 'Basic Info', 
      route: `/dashboard/update-celebrity/${celebrityId}`
    },
    { 
      title: 'Profession', 
      route: `/dashboard/section-template-list/${celebrityId}`
    },
    { 
      title: 'Fixed Section', 
      route: `/dashboard/timeline-list/${celebrityId}`
    },
  ];

  useEffect(() => {
    if (celebrityId) {
      fetchProfessions();
    }
  }, [celebrityId]);

  const fetchProfessions = async () => {
    try {
      setLoading(true);
      const response = await getProfessionsByCelebrityId(celebrityId);
      
      // Extract celebrity name from response
      if (response.data?.celebrityName) {
        setCelebrityName(response.data.celebrityName);
      }
      
      const professionsData = response.data?.professions || [];
      const professionTabs = [];

      console.log(professionsData);
      
      professionsData.forEach((profession) => {
        if (profession.name === 'Actor') {
          professionTabs.push(
            { _id: 'movie', title: 'Movie', icon: 'bx-movie', route: `/dashboard/list-movie/${celebrityId}`, profession: 'Actor' },
            { _id: 'series', title: 'Series', icon: 'bx-tv', route: `/dashboard/list-series/${celebrityId}`, profession: 'Actor' }
          );
        } else if (profession.name === 'politician' || profession.name === 'Politician') {
          professionTabs.push(
            { _id: 'election', title: 'Election', icon: 'bx-vote', route: `/dashboard/list-election/${celebrityId}`, profession: 'Politician' },
            { _id: 'positions', title: 'Positions', icon: 'bx-briefcase', route: `/dashboard/list-positions/${celebrityId}`, profession: 'Politician' }
          );
        }
      });

      const allTabs = [...staticTabs, ...professionTabs];
      setSections(allTabs);
    } catch (error) {
      console.error('Error fetching professions:', error);
      setSections(staticTabs);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (section) => {
    navigate(section.route);
  };

  // Skeleton Loader Component
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
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <>
        {/* Celebrity Name Skeleton */}
        <div 
          className="skeleton mb-3" 
          style={{
            width: "250px",
            height: "36px",
            borderRadius: "4px",
            backgroundColor: "#e9ecef",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />

        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-4 align-items-center">
            <h4 className="mb-0 fs-4">Fixed Section</h4>
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
          <div>
            <small className="text-muted">
              <Link to="/dashboard/celebrity-list" className="text-decoration-none text-muted">
                Celebrity List
              </Link>
              {" / Fixed Sections"}
            </small>
          </div>
        </div>

        {/* Skeleton Tabs */}
        <TabSkeleton />

        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* Celebrity Name */}
      {celebrityName && (
        <p className="text-black mb-3" style={{ fontSize: "26px", fontWeight: "400" }}>
          {celebrityName}
        </p>
      )}

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-4 align-items-center">
          <h4 className="mb-0 fs-4">Fixed Section</h4>
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
        <div>
          <small className="text-muted">
            <Link to="/dashboard/celebrity-list" className="text-decoration-none text-muted">
              Celebrity List
            </Link>
            {" / Fixed Sections"}
          </small>
        </div>
      </div>

      {/* Tabs Section */}
      {sections.length > 0 ? (
        <div 
          className="d-flex flex-wrap border-bottom align-items-center mb-3" 
          style={{ gap: "8px" }}
        >
          {sections.map((section, index) => (
            <div
              key={section._id}
              onClick={() => handleTabClick(section)}
              style={{
                minWidth: "200px",
                padding: "16px 24px",
                cursor: "pointer",
                backgroundColor: activeTabId === section._id ? "#f8f9fa" : "transparent",
                borderBottom: activeTabId === section._id ? "3px solid #4285F4" : "3px solid transparent",
                transition: "all 0.3s ease",
                opacity: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onMouseEnter={(e) => {
                if (activeTabId !== section._id) {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTabId !== section._id) {
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
                    backgroundColor: activeTabId === section._id ? "#4285F4" : "#e9ecef",
                    color: activeTabId === section._id ? "#fff" : "#6c757d",
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
                    fontWeight: activeTabId === section._id ? "600" : "normal", 
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: activeTabId === section._id ? "#000" : "#6c757d",
                  }}
                >
                  {section.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-5 border-bottom mb-3" 
          style={{ 
            backgroundColor: "#f8f9fa",
            borderRadius: "8px"
          }}
        >
          <i className="bx bx-info-circle" style={{ fontSize: "48px", color: "#6c757d" }}></i>
          <p className="text-muted mt-3 mb-0" style={{ fontSize: "16px" }}>
            No sections available
          </p>
        </div>
      )}
    </>
  );
};

export default FixedSectionTab;