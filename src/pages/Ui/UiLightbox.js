// import React, { Component } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   CardText,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Container,
//   Form,
//   Input,
//   Label,
// } from "reactstrap";
// import { Link } from "react-router-dom";

// //Lightbox
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";

// import ModalVideo from "react-modal-video";
// import "react-modal-video/scss/modal-video.scss";

// // import image
// import img1 from "../../assets/images/small/img-1.jpg";
// import img2 from "../../assets/images/small/img-2.jpg";
// import img3 from "../../assets/images/small/img-3.jpg";
// import img4 from "../../assets/images/small/img-4.jpg";
// import img5 from "../../assets/images/small/img-5.jpg";
// import img6 from "../../assets/images/small/img-6.jpg";
// import img7 from "../../assets/images/small/img-7.jpg";

// //Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";

// const images = [img1, img2, img3, img4, img5, img6];

// class UiLightbox extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       photoIndex: 0,
//       isFits: false,
//       isEffects: false,
//       isGallery: false,
//       isGalleryZoom: false,
//       isOpen: false,
//       isOpen1: false,
//       modal_standard: false,
//       breadcrumbItems: [
//         { title: "UI Elements", link: "#" },
//         { title: "Lightbox", link: "#" },
//       ],
//     };
//     this.openModal = this.openModal.bind(this);
//     this.openModal1 = this.openModal1.bind(this);
//     this.tog_standard = this.tog_standard.bind(this);
//   }

//   tog_standard() {
//     this.setState((prevState) => ({
//       modal_standard: !prevState.modal_standard,
//     }));
//   }

//   openModal() {
//     this.setState({ isOpen: true });
//   }

//   openModal1() {
//     this.setState({ isOpen1: true });
//   }

//   render() {
//     const { photoIndex } = this.state;

//     return (
//       <React.Fragment>
//         <div className="page-content">
//           <Container fluid={true}>
//             <Breadcrumbs
//               title="Lightbox"
//               breadcrumbItems={this.state.breadcrumbItems}
//             />

//             {this.state.isFits ? (
//               // <Lightbox
//               //   mainSrc={images[photoIndex]}
//               //   enableZoom={false}
//               //   imageCaption={
//               //     "Caption. Can be aligned it to any side and contain any HTML."
//               //   }
//               //   onCloseRequest={() => this.setState({ isFits: false })}
//               // />
//               <Lightbox
//                 open={isFits}
//                 close={() => this.setState({ isFits: false })}
//                 index={isFits}
//                 slides={images.map((image) => ({ src: image }))}
//               />
//             ) : null}

//             {this.state.isEffects ? (
//               // <Lightbox
//               //   mainSrc={images[3]}
//               //   enableZoom={false}
//               //   onCloseRequest={() => this.setState({ isEffects: false })}
//               // />
//               <Lightbox
//                 open={isEffects}
//                 close={() => setisEffects(false)}
//                 index={currentIndex}
//                 slides={images.map((image) => ({ src: image }))}
//               />
//             ) : null}

//             {this.state.isGallery ? (
//               // <Lightbox
//               //   mainSrc={images[photoIndex]}
//               //   nextSrc={images[(photoIndex + 1) % images.length]}
//               //   prevSrc={
//               //     images[(photoIndex + images.length - 1) % images.length]
//               //   }
//               //   enableZoom={false}
//               //   onCloseRequest={() => this.setState({ isGallery: false })}
//               //   onMovePrevRequest={() =>
//               //     this.setState({
//               //       photoIndex: (photoIndex + images.length - 1) % images.length
//               //     })
//               //   }
//               //   onMoveNextRequest={() =>
//               //     this.setState({
//               //       photoIndex: (photoIndex + 1) % images.length
//               //     })
//               //   }
//               //   imageCaption={"Project " + parseFloat(photoIndex + 1)}
//               // />
//               <Lightbox
//                 open={isGallery}
//                 close={() => setisGallery(false)}
//                 index={photoIndex}
//                 slides={images.map((image) => ({ src: image }))}
//               />
//             ) : null}

//             {this.state.isGalleryZoom ? (
//               // <Lightbox
//               //   mainSrc={images[photoIndex]}
//               //   nextSrc={images[(photoIndex + 1) % images.length]}
//               //   prevSrc={
//               //     images[(photoIndex + images.length - 1) % images.length]
//               //   }
//               //   onCloseRequest={() => this.setState({ isGalleryZoom: false })}
//               //   onMovePrevRequest={() =>
//               //     this.setState({
//               //       photoIndex: (photoIndex + images.length - 1) % images.length
//               //     })
//               //   }
//               //   onMoveNextRequest={() =>
//               //     this.setState({
//               //       photoIndex: (photoIndex + 1) % images.length
//               //     })
//               //   }
//               // />

//               <Lightbox
//                 open={isGalleryZoom}
//                 close={() => setisGallery(false)}
//                 index={photoIndex}
//                 slides={images.map((image) => ({ src: image }))}
//               />
//             ) : null}

//             <Row>
//               <Col xs={6}>
//                 <Card>
//                   <CardBody>
//                     <h4 className="card-title">Single image lightbox</h4>
//                     <p className="card-title-desc">
//                       Three simple popups with different scaling settings.
//                     </p>
//                     <Row>
//                       <Col xs={6}>
//                         <div>
//                           <h5 className="mt-0 font-size-14">
//                             Fits (Horz/Vert)
//                           </h5>
//                           <img
//                             onClick={() => this.setState({ isFits: true })}
//                             className="img-fluid"
//                             alt="Skote"
//                             src={img2}
//                             width="145"
//                           />
//                         </div>
//                       </Col>
//                       <Col xs={6}>
//                         <div>
//                           <h5 className="mt-0 font-size-14">Effects</h5>
//                           <img
//                             onClick={() => this.setState({ isEffects: true })}
//                             className="img-fluid"
//                             alt=""
//                             src={img3}
//                             width="75"
//                           />

//                           <CardText className="mt-2 mb-0 text-muted">
//                             No gaps, zoom animation, close icon in top-right
//                             corner.
//                           </CardText>
//                         </div>
//                       </Col>
//                     </Row>
//                   </CardBody>
//                 </Card>
//               </Col>

//               <Col xs={6}>
//                 <Card>
//                   <CardBody>
//                     <h4 className="card-title">Lightbox gallery</h4>
//                     <p className="card-title-desc">
//                       In this example lazy-loading of images is enabled for the
//                       next image based on move direction.{" "}
//                     </p>
//                     <div className="popup-gallery">
//                       <div className="img-fluid float-start">
//                         <img
//                           src={img1}
//                           onClick={() =>
//                             this.setState({ isGallery: true, photoIndex: 0 })
//                           }
//                           alt=""
//                           width="120"
//                         />
//                       </div>
//                       <div className="img-fluid float-start">
//                         <img
//                           src={img2}
//                           onClick={() =>
//                             this.setState({ isGallery: true, photoIndex: 1 })
//                           }
//                           alt=""
//                           width="120"
//                         />
//                       </div>
//                       <div className="img-fluid float-start">
//                         <img
//                           src={img3}
//                           onClick={() =>
//                             this.setState({ isGallery: true, photoIndex: 2 })
//                           }
//                           alt=""
//                           width="120"
//                         />
//                       </div>
//                       <div className="img-fluid float-start">
//                         <img
//                           src={img4}
//                           onClick={() =>
//                             this.setState({ isGallery: true, photoIndex: 3 })
//                           }
//                           alt=""
//                           width="120"
//                         />
//                       </div>
//                       <div className="img-fluid float-start">
//                         <img
//                           src={img5}
//                           onClick={() =>
//                             this.setState({ isGallery: true, photoIndex: 4 })
//                           }
//                           alt=""
//                           width="120"
//                         />
//                       </div>
//                       <div className="img-fluid float-start">
//                         <img
//                           src={img6}
//                           onClick={() =>
//                             this.setState({ isGallery: true, photoIndex: 5 })
//                           }
//                           alt=""
//                           width="120"
//                         />
//                       </div>
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>

//             <Row>
//               <Col xs={6}>
//                 <Card>
//                   <CardBody>
//                     <h4 className="card-title">Zoom Gallery</h4>
//                     <p className="card-title-desc">
//                       Zoom effect works only with images.
//                     </p>

//                     <div className="zoom-gallery">
//                       <img
//                         src={img3}
//                         className="float-start"
//                         onClick={() =>
//                           this.setState({ isGalleryZoom: true, photoIndex: 2 })
//                         }
//                         alt=""
//                         width="275"
//                       />
//                       <img
//                         src={img7}
//                         className="float-start"
//                         onClick={() =>
//                           this.setState({ isGalleryZoom: true, photoIndex: 4 })
//                         }
//                         alt=""
//                         width="275"
//                       />
//                     </div>
//                   </CardBody>
//                 </Card>
//               </Col>

//               <Col xs={6}>
//                 <Card>
//                   <CardBody>
//                     <h4 className="card-title">Popup with video or map</h4>
//                     <p className="card-title-desc">
//                       In this example lazy-loading of images is enabled for the
//                       next image based on move direction.{" "}
//                     </p>

//                     <Row>
//                       <Col>
//                         <Button color="light" onClick={this.openModal}>
//                           Open YouTube Video
//                         </Button>{" "}
//                         {"  "}
//                         <Button color="light" onClick={this.openModal1}>
//                           Open Vimeo Video
//                         </Button>{" "}
//                         <Button color="light" onClick={this.openModal1}>
//                           Open Google Map
//                         </Button>{" "}
//                         <ModalVideo
//                           videoId="L61p2uyiMSo"
//                           channel="youtube"
//                           isOpen={this.state.isOpen}
//                           onClose={() => this.setState({ isOpen: false })}
//                         />
//                         <ModalVideo
//                           videoId="L61p2uyiMSo"
//                           channel="youtube"
//                           isOpen={this.state.isOpen1}
//                           onClose={() => this.setState({ isOpen1: false })}
//                         />
//                       </Col>
//                     </Row>
//                   </CardBody>
//                 </Card>

//                 <Card>
//                   <CardBody>
//                     <h4 className="card-title mb-4">Popup with form</h4>
//                     <div>
//                       <Link
//                         onClick={() =>
//                           this.setState({ isModal: !this.state.modal })
//                         }
//                         to="#"
//                         className="popup-form btn btn-primary"
//                       >
//                         Popup form
//                       </Link>
//                     </div>

//                     <Modal
//                       size="xl"
//                       isOpen={this.state.isModal}
//                       centered={true}
//                       toggle={() =>
//                         this.setState({ isModal: !this.state.isModal })
//                       }
//                     >
//                       <ModalHeader
//                         toggle={() =>
//                           this.setState({ isModal: !this.state.isModal })
//                         }
//                       >
//                         Form
//                       </ModalHeader>
//                       <ModalBody>
//                         <Form>
//                           <Row>
//                             <Col lg={4}>
//                               <div className="mb-3">
//                                 <Label className="form-label" htmlFor="name">
//                                   Name
//                                 </Label>
//                                 <Input
//                                   type="text"
//                                   className="form-control"
//                                   id="name"
//                                   placeholder="Enter Name"
//                                   required
//                                 />
//                               </div>
//                             </Col>
//                             <Col lg={4}>
//                               <div className="mb-3">
//                                 <Label className="form-label" htmlFor="email">
//                                   Email
//                                 </Label>
//                                 <Input
//                                   type="email"
//                                   className="form-control"
//                                   id="email"
//                                   placeholder="Enter Email"
//                                   required
//                                 />
//                               </div>
//                             </Col>
//                             <Col lg={4}>
//                               <div className="mb-3">
//                                 <Label
//                                   className="form-label"
//                                   htmlFor="password"
//                                 >
//                                   Password
//                                 </Label>
//                                 <Input
//                                   type="password"
//                                   className="form-control"
//                                   id="password"
//                                   placeholder="Enter Password"
//                                   required
//                                 />
//                               </div>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col lg={12}>
//                               <div className="mb-3">
//                                 <Label className="form-label" htmlFor="subject">
//                                   Subject
//                                 </Label>
//                                 <textarea
//                                   className="form-control"
//                                   id="subject"
//                                   rows="3"
//                                 ></textarea>
//                               </div>
//                             </Col>
//                           </Row>
//                           <Row>
//                             <Col lg={12}>
//                               <div className="text-end">
//                                 <Button type="submit" color="primary">
//                                   Submit
//                                 </Button>
//                               </div>
//                             </Col>
//                           </Row>
//                         </Form>
//                       </ModalBody>
//                     </Modal>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// export default UiLightbox;

import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Container,
  CardHeader,
} from "reactstrap";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";
import Breadcrumbs from "../../components/Common/Breadcrumb";

// Import images
import img1 from "../../assets/images/small/img-1.jpg";
import img2 from "../../assets/images/small/img-2.jpg";
import img3 from "../../assets/images/small/img-3.jpg";
import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";

const images = [img1, img2, img3, img4, img5, img6];

class UiLightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentIndex: 0,
      isEffects: false,
      photoIndex: 0,
      isGallery: false,
      isFits: 0,
      isOpen: false,
      isOpen1: false,
      breadcrumbItems: [
        { title: "UI Elements", link: "#" },
        { title: "Lightbox", link: "#" },
      ],
    };

    this.toggleYouTubeVideo = this.toggleYouTubeVideo.bind(this);
    this.toggleVimeoVideo = this.toggleVimeoVideo.bind(this);
  }

  // Toggles for YouTube and Vimeo Video modals
  toggleYouTubeVideo() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  toggleVimeoVideo() {
    this.setState({ isOpen1: !this.state.isOpen1 });
  }

  render() {
    document.title = "Lightbox | Minia - React Admin & Dashboard Template";

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Lightbox"
              breadcrumbItems={this.state.breadcrumbItems}
            />

            <Row>
              <Col lg={12}>
                <Card>
                  <CardHeader>
                    <h5 className="card-title">Single Image Lightbox</h5>
                    <p className="card-title-desc">
                      Glightbox Single Image Lightbox Example
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col lg={3} sm={6}>
                        <div className="mt-4">
                          <img
                            onClick={() =>
                              this.setState({ open: true, isFits: 0 })
                            }
                            className="img-fluid"
                            alt="Minia"
                            src={img1}
                          />
                          {this.state.open && (
                            <Lightbox
                              open={this.state.open}
                              close={() => this.setState({ open: false })}
                              index={this.state.isFits}
                              slides={images.map((image) => ({ src: image }))}
                            />
                          )}
                        </div>
                      </Col>
                      <Col lg={3} sm={6}>
                        <div className="mt-4">
                          <img
                            onClick={() => this.setState({ isEffects: true })}
                            className="img-fluid"
                            alt=""
                            src={img2}
                          />
                          {this.state.isEffects && (
                            <Lightbox
                              open={this.state.isEffects}
                              close={() => this.setState({ isEffects: false })}
                              index={this.state.currentIndex}
                              slides={images.map((image) => ({ src: image }))}
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <CardHeader>
                    <h5 className="card-title">Images with Description</h5>
                    <p className="card-title-desc">
                      Glightbox Images with Description Example
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col lg={3} sm={6}>
                        <div className="mt-4">
                          <img
                            src={img4}
                            onClick={() =>
                              this.setState({ isGallery: true, photoIndex: 3 })
                            }
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </Col>
                      <Col lg={3} sm={6}>
                        <div className="mt-4">
                          <img
                            src={img5}
                            onClick={() =>
                              this.setState({ isGallery: true, photoIndex: 4 })
                            }
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                      </Col>
                      <Col lg={3} sm={6}>
                        <div className="mt-4">
                          <img
                            src={img1}
                            onClick={() =>
                              this.setState({ isGallery: true, photoIndex: 0 })
                            }
                            className="img-fluid"
                            alt=""
                          />
                          {this.state.isGallery && (
                            <Lightbox
                              open={this.state.isGallery}
                              close={() => this.setState({ isGallery: false })}
                              index={this.state.photoIndex}
                              slides={images.map((image) => ({ src: image }))}
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <CardHeader>
                    <h5 className="card-title">Popup with Video or Map</h5>
                    <p className="card-title-desc">
                      Glightbox Popup with Video or Map Example
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <div className="d-flex align-items-start gap-3 flex">
                        <Button color="light" onClick={this.toggleYouTubeVideo}>
                          Open YouTube Video
                        </Button>
                        <Button color="light" onClick={this.toggleVimeoVideo}>
                          Open Vimeo Video
                        </Button>
                        <ModalVideo
                          videoId="L61p2uyiMSo"
                          channel="youtube"
                          isOpen={this.state.isOpen}
                          onClose={this.toggleYouTubeVideo}
                        />
                        <ModalVideo
                          videoId="L61p2uyiMSo"
                          channel="youtube"
                          isOpen={this.state.isOpen1}
                          onClose={this.toggleVimeoVideo}
                        />
                      </div>
                    </Row>
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

export default UiLightbox;
