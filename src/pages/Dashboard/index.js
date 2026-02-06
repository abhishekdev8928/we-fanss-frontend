import React, { Component } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Users, FileText, Mail, TrendingUp } from "lucide-react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "We Fans", link: "#" },
        { title: "Dashboard", link: "#" },
      ],
      reports: [
        { 
          icon: "blogs", 
          title: "Total Blogs", 
          value: "0", 
          color: "#4285F4",
          bgColor: "#E8F0FE" 
        },
        { 
          icon: "contacts", 
          title: "Contact Enquiries", 
          value: "0", 
          color: "#34A853",
          bgColor: "#E6F4EA" 
        },
        { 
          icon: "revenue", 
          title: "Monthly Revenue", 
          value: "$0", 
          color: "#FBBC04",
          bgColor: "#FEF7E0" 
        },
        { 
          icon: "users", 
          title: "Total Users", 
          value: "0", 
          color: "#EA4335",
          bgColor: "#FCE8E6" 
        },
      ],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchDashboardCounts();
  }

  fetchDashboardCounts = async () => {
    try {
      this.setState({ loading: true });
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/dashboard/counts`
      );
      const data = await response.json();

      this.setState((prevState) => ({
        reports: prevState.reports.map((report, index) => {
          if (index === 0) return { ...report, value: data.totalBlogs || "0" };
          if (index === 1) return { ...report, value: data.totalContacts || "0" };
          if (index === 2) return { ...report, value: `$${data.monthlyRevenue || "0"}` };
          if (index === 3) return { ...report, value: data.totalUsers || "0" };
          return report;
        }),
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
      this.setState({ loading: false });
    }
  };

  getIcon = (iconType) => {
    const iconStyle = { size: 32, strokeWidth: 2 };
    
    switch (iconType) {
      case "blogs":
        return <FileText {...iconStyle} />;
      case "contacts":
        return <Mail {...iconStyle} />;
      case "revenue":
        return <TrendingUp {...iconStyle} />;
      case "users":
        return <Users {...iconStyle} />;
      default:
        return <FileText {...iconStyle} />;
    }
  };

  render() {
    const { reports, loading } = this.state;

    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Dashboard"
            breadcrumbItems={this.state.breadcrumbItems}
          />

          {/* Stats Cards */}
          <Row>
            {reports.map((report, index) => (
              <Col xl={3} md={6} key={index}>
                <Card
                  style={{
                    border: "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    transition: "all 0.3s ease",
                  }}
                  className="dashboard-card"
                >
                  <CardBody style={{ padding: "24px" }}>
                    <div className="d-flex align-items-center justify-content-between">
                      {/* Icon Section */}
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "12px",
                          backgroundColor: report.bgColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: report.color,
                        }}
                      >
                        {this.getIcon(report.icon)}
                      </div>

                      {/* Value Section */}
                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            margin: "0 0 8px 0",
                            fontWeight: "500",
                          }}
                        >
                          {report.title}
                        </p>
                        {loading ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                            style={{ color: report.color }}
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <h2
                            style={{
                              fontSize: "32px",
                              fontWeight: "700",
                              color: "#333",
                              margin: "0",
                            }}
                          >
                            {report.value}
                          </h2>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Additional Dashboard Content */}
          <Row>
            <Col xl={12}>
              <Card
                style={{
                  border: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                }}
              >
                <CardBody style={{ padding: "32px", textAlign: "center" }}>
                  <div style={{ padding: "60px 20px" }}>
                    <i
                      className="bx bx-line-chart"
                      style={{
                        fontSize: "64px",
                        color: "#E0E0E0",
                        marginBottom: "16px",
                      }}
                    ></i>
                    <h4 style={{ color: "#666", fontWeight: "500" }}>
                      Welcome to We Fans Dashboard
                    </h4>
                    <p style={{ color: "#999", marginTop: "8px" }}>
                      Your analytics and insights will appear here
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Custom CSS for hover effects */}
        <style jsx>{`
          .dashboard-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
      </div>
    );
  }
}

export default Dashboard;