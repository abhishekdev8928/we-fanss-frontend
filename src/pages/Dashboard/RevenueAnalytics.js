import React, { Component } from 'react';
import { Row, Col, Card, CardBody, ButtonGroup, Button } from 'reactstrap';

//Import Charts
import { RevenueAnalyticsChart } from './Charts'
import "./dashboard.scss";

class RevenueAnalytics extends Component {
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <div className="float-end d-none d-md-inline-block">
                            <ButtonGroup className="mb-2">
                                <Button size="sm" color="light" type="button">Today</Button>
                                <Button size="sm" color="light" active type="button">Weekly</Button>
                                <Button size="sm" color="light" type="button">Monthly</Button>
                            </ButtonGroup>
                        </div>
                        <h4 className="card-title mb-2">Revenue Analytics</h4>
                        <div id="line-column-chart" className="apex-charts" dir="ltr">
                            <RevenueAnalyticsChart />
                        </div>  
                    </CardBody>

                    <CardBody className="border-top text-center">
                        <Row>
                            <Col sm={4}>
                                <div className="d-inline-flex">
                                    <h5 className="me-2">$12,253</h5>
                                    <div className="text-success">
                                        <i className="mdi mdi-menu-up font-size-14"> </i>2.2 %
                                    </div>
                                </div>
                                <p className="text-muted text-truncate mb-0">This month</p>
                            </Col>

                            <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-primary font-size-10 me-1"></i> This Year :</p>
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0 me-2">$ 34,254</h5>
                                        <div className="text-success">
                                            <i className="mdi mdi-menu-up font-size-14"> </i>2.1 %
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-success font-size-10 me-1"></i> Previous Year :</p>
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0">$ 32,695</h5>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default RevenueAnalytics;