import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { withTranslation } from "react-i18next";
import "../../breadcrumbs.css";

class Breadcrumbs extends Component {
  render() {
    const { breadcrumbItems, title, t } = this.props;

    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0">{t(title)}</h4>

              <div className="page-title-right">
                <Breadcrumb className="custom-breadcrumb m-0">
                  {breadcrumbItems.map((item, index) => (
                    <Fragment key={index}>
                      <BreadcrumbItem active={index === breadcrumbItems.length - 1}>
                        {index === breadcrumbItems.length - 1 ? (
                          t(item.title)
                        ) : (
                          <Link to={item.link}>{t(item.title)}</Link>
                        )}
                      </BreadcrumbItem>

                     
                      {index < breadcrumbItems.length - 1 && (
                        <span style={{color:"#757575"}} className="breadcrumb-separator mx-2">/</span>
                      )}
                    </Fragment>
                  ))}
                </Breadcrumb>
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default withTranslation()(Breadcrumbs);
