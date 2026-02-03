import { Outlet, Navigate } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { useIsAuthenticated } from "../config/store/authStore"; 

function AuthLayout() {
  const isAuthenticated = useIsAuthenticated();

  // Redirect authenticated users to dashboard/home
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Outlet />
        <Col lg={8}>
          <div className="authentication-bg">
            <div className="bg-overlay">demo</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthLayout;