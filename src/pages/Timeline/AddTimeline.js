import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { addtimeline } from "../../api/timelineApi";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const Addtimeline = () => {
  const [timeline, setTimeline] = useState({
    title: "",
    description: "",
    from_year: "",
    to_year: "",
    media: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { id } = useParams(); // ✅ match route
  const celebrityId = id; // use it as celebrityId
  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Add Timeline", link: "#" },
  ];

  // Generate year options (1980 - current year + 5)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = 1980; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  const handleInput = (e) => {
    const { name, value } = e.target;
    setTimeline({ ...timeline, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setTimeline((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // ✅ Validation
    if (!timeline.title) newErrors.title = "Title is required";
    if (!timeline.description)
      newErrors.description = "Description is required";
    if (!timeline.from_year) newErrors.from_year = "From year is required";
    if (
      timeline.from_year &&
      timeline.to_year &&
      timeline.from_year > timeline.to_year
    ) {
      newErrors.to_year = "To year must be greater than or equal to From year";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const adminid = localStorage.getItem("adminid");

      const formData = new FormData();
      formData.append("title", timeline.title);
      formData.append("description", timeline.description);
      formData.append("from_year", timeline.from_year);
      formData.append("to_year", timeline.to_year);
      formData.append("createdBy", adminid);
      formData.append("celebrityId", celebrityId);

      if (timeline.media) formData.append("media", timeline.media);

      const res_data = await addtimeline(formData);
      console.log("API Response:", res_data);

      if (res_data?.success === true) {
        toast.success(res_data.msg || "Timeline added successfully!");
        setErrors({});
        navigate(`/dashboard/timeline-list/${celebrityId}`);
      } else if (res_data?.msg === "timeline already exist") {
        toast.error("Timeline already exists!");
      } else {
        toast.error(res_data?.msg || "Failed to add timeline");
      }
    } catch (error) {
      console.error("Add timeline Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">

      <Container fluid>
        <Breadcrumbs title="Timeline" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    {/* Title */}
                    <Col md="6">
                      <Label>Title</Label>
                      <Input
                        name="title"
                        type="text"
                        placeholder="Enter title"
                        value={timeline.title}
                        onChange={handleInput}
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    {/* Media */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label className="form-label">Media</Label>
                        <Input
                          type="file"
                          name="media"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </Col>

                    {/* From Year */}
                    <Col md="6">
                      <Label>From Year</Label>
                      <Input
                        type="select"
                        name="from_year"
                        value={timeline.from_year}
                        onChange={handleInput}
                      >
                        <option value="">Select From Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Input>
                      {errors.from_year && (
                        <span className="text-danger">{errors.from_year}</span>
                      )}
                    </Col>

                    {/* To Year */}
                    <Col md="6">
                      <Label>To Year</Label>
                      <Input
                        type="select"
                        name="to_year"
                        value={timeline.to_year}
                        onChange={handleInput}
                      >
                        <option value="">Select To Year</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Input>
                      {errors.to_year && (
                        <span className="text-danger">{errors.to_year}</span>
                      )}
                    </Col>

                    {/* Description */}
                    <Col md="12">
                      <div className="mb-3">
                        <Label className="form-label">Description</Label>
                        <Input
                          type="textarea"
                          name="description"
                          placeholder="Enter description"
                          value={timeline.description}
                          onChange={handleInput}
                          rows="3"
                        />
                        {errors.description && (
                          <span className="text-danger">
                            {errors.description}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Add Timeline
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/timeline-list/${celebrityId}`)}
                    >
                      ← Back
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Addtimeline;
