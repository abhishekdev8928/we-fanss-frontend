import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MiniWidgets from "./MiniWidgets";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "We Fans", link: "#" },
        { title: "Dashboard", link: "#" },
      ],
      reports: [
        { icon: "ri-stack-line", title: "Blogs", value: "0", desc: "Total Blogs" },
        { icon: "ri-store-2-line", title: "Contact Enquiries", value: "7          0", desc: "Lifetime" },
        { icon: "ri-briefcase-4-line", title: "This Month", value: "$0", desc: "Revenue" },
      ],
    };
  }

  componentDidMount() {
    this.fetchDashboardCounts();
  }

  fetchDashboardCounts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dashboard/counts`);
      const data = await response.json();

      this.setState((prevState) => ({
        reports: prevState.reports.map((report, index) => {
          if (index === 0) return { ...report, value: data.totalBlogs };
          if (index === 1) return { ...report, value: data.totalContacts };
          return report;
        }),
      }));
    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
    }
  };

  render() {
    return (
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItems={this.state.breadcrumbItems} />
          <Row>
            <Col xl={12}>
              <Row>
                <MiniWidgets reports={this.state.reports} />
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
