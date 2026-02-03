import React, { Component } from "react";
import {
  Col, Row, Card, CardBody, Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ButtonDropdown, Container, ButtonGroup, Label, UncontrolledDropdown, Form, Input, CardTitle
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class UiDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "UI Elements", link: "#" },
        { title: "Dropdowns", link: "#" },
      ],
    };
  }

  render() {
    document.title = "Dropdown | Nazox - React Admin & Dashboard Template"
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>

            <Breadcrumbs title="Dropdowns" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>

                    <h4 className="card-title">Single button dropdowns</h4>
                    <p className="card-title-desc">Any single <code
                      className="highlighter-rouge">.btn</code> can be turned into a dropdown toggle with some markup changes. Here’s how you can put them to work with either <code className="highlighter-rouge">&lt;button&gt;</code> elements:</p>
                    <Row>
                      <Col sm={6}>
                        <Dropdown
                          isOpen={this.state.singlebtn}
                          toggle={() =>
                            this.setState({ singlebtn: !this.state.singlebtn })
                          }
                        >
                          <DropdownToggle color="secondary" caret>
                            Dropdown button{" "}
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                      <Col sm={6}>
                        <Dropdown
                          isOpen={this.state.singlebtn1}
                          toggle={() =>
                            this.setState({ singlebtn1: !this.state.singlebtn1 })
                          }
                          className="mt-4 mt-sm-0"
                        >
                          <DropdownToggle color="secondary" caret>
                            Dropdown link <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Variant</h4>
                    <p className="card-title-desc">The best part is you can do this with any button variant, too:</p>

                    <div className="">
                      <ButtonGroup className="me-1 mt-2">
                        <Dropdown
                          isOpen={this.state.btnprimary1}
                          toggle={() =>
                            this.setState({ btnprimary1: !this.state.btnprimary1 })
                          }
                        >
                          <DropdownToggle tag="button" className="btn btn-primary">
                            Primary <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>{" "}
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="me-1 mt-2">
                        <Dropdown
                          isOpen={this.state.btnlight1}
                          toggle={() =>
                            this.setState({ btnlight1: !this.state.btnlight1 })
                          }
                        >
                          <DropdownToggle tag="button" className="btn btn-secondary">
                          Secondary <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>{" "}
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="me-1 mt-2">
                        <Dropdown
                          isOpen={this.state.btnsuccess1}
                          toggle={() =>
                            this.setState({ btnsuccess1: !this.state.btnsuccess1 })
                          }
                        >
                          <DropdownToggle tag="button" className="btn btn-success">
                            Success <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                    &nbsp;</ButtonGroup>
                      <ButtonGroup className="me-1 mt-2">
                        <Dropdown
                          isOpen={this.state.btnInfo1}
                          toggle={() =>
                            this.setState({ btnInfo1: !this.state.btnInfo1 })
                          }
                        >
                          <DropdownToggle tag="button" className="btn btn-info">
                            Info <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                    &nbsp;
                    </ButtonGroup>
                      <ButtonGroup className="me-1 mt-2">
                        <Dropdown
                          isOpen={this.state.btnWarning1}
                          toggle={() =>
                            this.setState({ btnWarning1: !this.state.btnWarning1 })
                          }
                        >
                          <DropdownToggle tag="button" className="btn btn-warning">
                            Warning <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="me-1 mt-2">
                        <Dropdown
                          isOpen={this.state.btnDanger1}
                          toggle={() =>
                            this.setState({ btnDanger1: !this.state.btnDanger1 })
                          }
                        >
                          <DropdownToggle tag="button" className="btn btn-danger">
                            Danger <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem>Action</DropdownItem>
                            <DropdownItem>Another action</DropdownItem>
                            <DropdownItem>Something else here</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </ButtonGroup>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>


            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Split button dropdowns</h4>
                    <p className="card-title-desc">The best part is you can do this with any button variant, too:</p>

                    <div className="d-flex">
                      <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_primary1}
                          toggle={() =>
                            this.setState({
                              drp_primary1: !this.state.drp_primary1
                            })
                          }
                        >
                          <Button id="caret" color="primary">
                            Primary
                        </Button>
                          <DropdownToggle caret color="primary">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_secondary1}
                          toggle={() =>
                            this.setState({
                              drp_secondary1: !this.state.drp_secondary1
                            })
                          }
                        >
                          <Button id="caret" color="secondary">
                            Secondary
                        </Button>
                          <DropdownToggle caret color="secondary">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_success1}
                          toggle={() =>
                            this.setState({
                              drp_success1: !this.state.drp_success1
                            })
                          }
                        >
                          <Button id="caret" color="success">
                            Success
                        </Button>
                          <DropdownToggle caret color="success">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                        <ButtonDropdown
                          isOpen={this.state.drp_info1}
                          toggle={() =>
                            this.setState({ drp_info1: !this.state.drp_info1 })
                          }
                        >
                          <Button id="caret" color="info">
                            Info
                        </Button>
                          <DropdownToggle caret color="info">
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem header>Header</DropdownItem>
                            <DropdownItem disabled>Action</DropdownItem>
                            <DropdownItem>Another Action</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem>Another Action</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_warning1}
                        toggle={() =>
                          this.setState({
                            drp_warning1: !this.state.drp_warning1
                          })
                        }
                      >
                        <Button id="caret" color="warning">
                          Warning
                        </Button>
                        <DropdownToggle caret color="warning">
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>
                    &nbsp;
                    <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_danger1}
                        toggle={() =>
                          this.setState({
                            drp_danger1: !this.state.drp_danger1
                          })
                        }
                      >
                        <Button id="caret" color="danger">
                          Danger
                        </Button>
                        <DropdownToggle caret color="danger">
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>
                  </div>

                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Sizing</h4>
                    <p className="card-title-desc"> Button dropdowns work with buttons of all sizes, including default and split dropdown buttons.</p>
                    <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_secondary}
                        toggle={() =>
                          this.setState({
                            drp_secondary: !this.state.drp_secondary
                          })
                        }
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          size="lg"
                        >
                          Large button{" "}
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>{" "}
                  &nbsp;
                  <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_light_large}
                        toggle={() =>
                          this.setState({
                            drp_light_large: !this.state.drp_light_large
                          })
                        }
                      >
                        <Button id="caret" color="secondary" size="lg">
                          Large button
                        </Button>
                        <DropdownToggle caret color="secondary" size="lg"><i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>
                  &nbsp;
                  <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_secondary_sm}
                        toggle={() =>
                          this.setState({
                            drp_secondary_sm: !this.state.drp_secondary_sm
                          })
                        }
                      >
                        <DropdownToggle
                          caret
                          color="info"
                          size="sm"
                        >
                          Small button &nbsp;{" "}
                          <i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>{" "}
                  &nbsp;
                  <ButtonGroup className="mb-2">
                      <ButtonDropdown
                        isOpen={this.state.drp_light_sm}
                        toggle={() =>
                          this.setState({
                            drp_light_sm: !this.state.drp_light_sm
                          })
                        }
                      >
                        <Button id="caret" color="secondary" size="sm">
                          Small Button
                        </Button>
                        <DropdownToggle caret color="secondary" size="sm"><i className="mdi mdi-chevron-down"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </ButtonGroup>{" "}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                <h4 className="card-title">Menu Content</h4>
                <p className="card-title-desc">Example of dropdown menu Headers, Text, Forms content</p>
                <div className="d-flex flex-wrap gap-2">
                    <UncontrolledDropdown
                    >
                      <DropdownToggle color="primary" type="button">
                        Header <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu>
                        <div className="dropdown-header noti-title">
                          <h5 className="font-size-13 text-muted text-truncate mn-0">Welcome Jessie!</h5>
                        </div>
                        <DropdownItem href="#">Action</DropdownItem>
                        <DropdownItem href="#">Another action</DropdownItem>
                        <DropdownItem href="#">Something else here</DropdownItem>
                        <div className="dropdown-divider"></div>
                        <DropdownItem href="#">Separated link</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>

                    <UncontrolledDropdown>
                      <DropdownToggle type="button" className="btn btn-success">
                        Text <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-md p-3">
                        <p>
                          Some example text that's free-flowing within the dropdown menu.
                        </p>
                        <p className="mb-0">
                          And this is more example text.
                        </p>
                      </DropdownMenu>
                    </UncontrolledDropdown>

                    <UncontrolledDropdown>
                      <DropdownToggle type="button" className="btn btn-light dropdown-toggle">
                        Forms <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-md p-4">
                        <Form>
                          <div className="mb-2">
                            <Label className="form-label" htmlFor="exampleDropdownFormEmail">Email address</Label>
                            <Input type="email" className="form-control" id="exampleDropdownFormEmail" placeholder="email@example.com" />
                          </div>
                          <div className="mb-2">
                            <Label className="form-label" htmlFor="exampleDropdownFormPassword">Password</Label>
                            <Input type="password" className="form-control" id="exampleDropdownFormPassword" placeholder="Password" />
                          </div>
                          <div className="mb-2">
                            <div className="form-check custom-checkbox">
                              <Input type="checkbox" className="form-check-input" id="rememberdropdownCheck" />
                              <Label className="form-check-label" htmlFor="rememberdropdownCheck">Remember me</Label>
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary">Sign in</button>
                        </Form>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </CardBody>
              </Card>
              </Col>
              <Col xl={6}>
              <Card>
                <CardBody>
                  <CardTitle>Dropdown Menu Dark</CardTitle>
                  <p className="card-title-desc">Opt into darker dropdowns to match a dark navbar or custom style by adding <code>.dropdown-menu-dark</code> onto an existing <code>.dropdown-menu</code>. No changes are required to the dropdown items.</p>

                  <UncontrolledDropdown>
                    <DropdownToggle type="button" className="btn btn-secondary">
                      Menu is right-aligned <i className="mdi mdi-chevron-down"></i>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-dark">
                      <DropdownItem href="#">Action</DropdownItem>
                      <DropdownItem href="#">Another action</DropdownItem>
                      <DropdownItem href="#">Something else here</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </CardBody>
              </Card>
              </Col>
            </Row>



            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dropup variation</h4>
                    <p className="card-title-desc">Trigger dropdown menus above elements by adding <code className="highlighter-rouge">.dropup</code> to the parent element.</p>
                    <div className="d-flex">
                      <Dropdown
                        isOpen={this.state.dropup1}
                        direction="up"
                        toggle={() =>
                          this.setState({ dropup1: !this.state.dropup1 })
                        }
                      >
                        <DropdownToggle color="secondary">
                          Dropup <i className="mdi mdi-chevron-up"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    <ButtonDropdown
                        direction="up"
                        isOpen={this.state.drp_up11}
                        toggle={() =>
                          this.setState({
                            drp_up11: !this.state.drp_up11
                          })
                        }
                      >
                        <Button id="caret" color="secondary">
                          Split dropup
                      </Button>
                        <DropdownToggle caret color="secondary">
                          <i className="mdi mdi-chevron-up"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Menu alignment</h4>
                    <p className="card-title-desc">Add <code className="highlighter-rouge">.dropdown-menu-right</code> to a <code className="highlighter-rouge">.dropdown-menu</code> to right align the dropdown menu.</p>
                    <ButtonDropdown
                      isOpen={this.state.drop_align}
                      direction="right"
                      toggle={() =>
                        this.setState({ drop_align: !this.state.drop_align })
                      }
                    >
                      <DropdownToggle
                        caret
                        color="secondary"
                        className="btn btn-secondary"
                      >
                        Menu is right-aligned{" "}
                        <i className="mdi mdi-chevron-down"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-right-custom">
                        <DropdownItem disabled>Action</DropdownItem>
                        <DropdownItem>Another Action</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem>Another Action</DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </CardBody>
                </Card>
              </Col>
            </Row>


            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dropright variation</h4>
                    <p className="card-title-desc">Trigger dropdown menus at the right of the elements by adding <code>.dropend</code> to the parent element.</p>

                    <div className="d-flex">
                      <Dropdown
                        isOpen={this.state.info_dropup1}
                        direction="right"
                        toggle={() =>
                          this.setState({
                            info_dropup1: !this.state.info_dropup1
                          })
                        }
                      >
                        <DropdownToggle color="info" caret>
                          Dropright <i className="mdi mdi-chevron-right"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    <ButtonDropdown
                        direction="right"
                        isOpen={this.state.infodrp_up11}
                        toggle={() =>
                          this.setState({
                            infodrp_up11: !this.state.infodrp_up11
                          })
                        }
                      >
                        <Button id="caret" color="info">
                          Split dropend
                        </Button>
                        <DropdownToggle caret color="info">
                          <i className="mdi mdi-chevron-right"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h4 className="card-title">Dropleft variation</h4>
                    <p className="card-title-desc">Trigger dropdown menus at the right of the elements by adding <code>.dropstart</code> to the parent element.</p>

                    <div className="d-flex">
                      <Dropdown
                        isOpen={this.state.info_dropup111}
                        direction="left"
                        toggle={() =>
                          this.setState({
                            info_dropup111: !this.state.info_dropup111
                          })
                        }
                      >
                        <DropdownToggle color="info">
                          <i className="mdi mdi-chevron-left"></i> Dropleft
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>Action</DropdownItem>
                          <DropdownItem>Another action</DropdownItem>
                          <DropdownItem>Something else here</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    &nbsp;
                    <ButtonDropdown
                        direction="left"
                        isOpen={this.state.infodrp_up1111}
                        toggle={() =>
                          this.setState({
                            infodrp_up1111: !this.state.infodrp_up1111
                          })
                        }
                      >

                        <DropdownToggle caret color="info">
                          <i className="mdi mdi-chevron-left"></i>
                        </DropdownToggle>
                        <Button id="caret" color="info">
                          Split dropstart
                        </Button>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>


          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default UiDropdown;
