import React, { Component } from "react";
import { Form, Card, CardBody, Col, Row, Container, CardHeader } from "reactstrap";

// Form Editor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class FormEditors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbItems: [
        { title: "Forms", link: "#" },
        { title: "Form Editors", link: "#" },
      ],
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>

            <Breadcrumbs title="Form Editor" breadcrumbItems={this.state.breadcrumbItems} />

            <Row>
              <Col>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0">Ckeditor Classic Editor</h4>
                </CardHeader>
                <CardBody>
                  <Form method="post">
                    <CKEditor
                      editor={ClassicEditor}
                      data="<p>Hello from CKEditor 5!</p>"
                      onReady={(editor) => {
                        // You can store the "editor" and use when it is needed.
                        
                      }}
                    />
                  </Form>
                </CardBody>
              </Card>
              </Col>
            </Row>

          </Container>
        </div>
      </React.Fragment>
    );
  };
};

export default FormEditors;
