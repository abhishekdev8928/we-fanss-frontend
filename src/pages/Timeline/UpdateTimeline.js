import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Button,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { gettimelineById, updatetimeline } from "../../api/timelineApi";

const Updatetimeline = () => {
  const [timeline, settimeline] = useState({
    name: "",
    description: "",
    from_year: "",
    to_year: "",

    media: null,
    old_image: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const [celebrityId, setCelebrityId] = useState("");

  const breadcrumbItems = [
    { title: "Dashboard", link: "#" },
    { title: "Update Profession Master", link: "#" },
  ];
  // Generate year options (1980 - current year + 5)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = 1980; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }
  // Fetch timeline data
  useEffect(() => {
    const fetchtimeline = async () => {
      try {
        const res_data = await gettimelineById(id);

        if (res_data.msg) {
          const data = res_data.msg;
          settimeline({
            title: data.title || "",
            description: data.description || "",
            from_year: data.from_year || "",
            to_year: data.to_year || "",
            old_image: data.media || "",
          });
          setCelebrityId(data.celebrityId);
        } else {
          toast.error("timeline not found");
        }
      } catch (error) {
        console.error("Fetch timeline error:", error);
        toast.error("Failed to fetch timeline data");
      }
    };

    fetchtimeline();
  }, [id]);

  // Input handler
  const handleInput = (e) => {
    settimeline({ ...timeline, [e.target.name]: e.target.value });
  };
  // Handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    settimeline((prev) => ({ ...prev, [name]: files[0] }));
  };

  // ✅ Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!timeline.title) newErrors.title = "Title is required";
    if (!timeline.description)
      newErrors.description = "Description is required";
    if (!timeline.from_year) newErrors.from_year = "From Year is required";

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

      formData.append("updatedBy", adminid);
      if (timeline.media) formData.append("media", timeline.media);

      const res_data = await updatetimeline(id, formData);

      if (
        res_data.success === false ||
        res_data.msg === "timeline already exist"
      ) {
        toast.error(res_data.msg || "Failed to update timeline");
        return;
      }

      toast.success("timeline updated successfully!");
      navigate(`/dashboard/timeline-list/${celebrityId}`);
    } catch (error) {
      console.error("Update timeline Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="UPDATE 
Profession Master"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form
                  className="needs-validation"
                  onSubmit={handleUpdateSubmit}
                >
                  <Row>
                    <Col md="6">
                      <Label> Title</Label>
                      <Input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={timeline.title} // ✅ correct usage
                        onChange={handleInput}
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>
                    {/* Main Image */}
                    <Col md="6">
                      <Label className="form-label">Media</Label>
                      <Input
                        type="file"
                        name="media"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {timeline.old_image && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/timeline/${timeline.old_image}`}
                            alt="Main"
                            width="100"
                            className="rounded border"
                          />
                        </div>
                      )}
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
                      Update Timeline
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

export default Updatetimeline;
