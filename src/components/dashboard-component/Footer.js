import React from "react";
import { Row, Col, Container } from "reactstrap";

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        {/* <Col sm={6}>
                             © DiigiiHost.
                            </Col> */}
                        <Col sm={12}>
                            <div className="text-sm-end d-none d-sm-block">
                              Copyright  © {new Date().getFullYear()} We Fanss  . All Rights Reserved. Powered By: <a href="https://DiigiiHost.com" target="_blank" rel="noopener noreferrer">DIIGIIHOST</a>
                                </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
