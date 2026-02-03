import React, { useState, useEffect } from "react";
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
import { useParams, useNavigate } from "react-router-dom";
import { getPositionsById, updatePositions } from "../../api/positionsApi";

const UpdatePositions = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Update Positions", link: "#" },
  ]);

  const navigate = useNavigate();
  const { id } = useParams(); // Positions ID from route

  const [formData, setFormData] = useState({
    positions_year: "",
     title: "",
    department: "",
    level: "",
    from_date: "",
    to_date: "",
    current: "",
    state: "",
    constituency: "",
    party: "",
    reporting: "",
    work: "",
    reference: [],
    sort: "",
    statusnew: "",
    old_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [celebrityId, setCelebrityId] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Fetch Positions Data
  useEffect(() => {
    fetchPositionsById();
  }, [id]);

  const fetchPositionsById = async () => {
    try {
      const res = await getPositionsById(id);
      if (res.msg) {
        const data = res.msg;
        setFormData({
         title: data.title || "",
          department: data.department || "",
          level: data.level || "",
          from_date: data.from_date || "",
          to_date: data.to_date || "",
          current: data.current || "",
          state: data.state || "",
          constituency: data.constituency || "",
          party: data.party || "",
          reporting: data.reporting || "",
          work: data.work || "",
          reference: data.reference || [],
          sort: data.sort || "",
          statusnew: data.statusnew || "",
          old_image: data.image || "",
        });
        setCelebrityId(data.celebrityId);
      } else {
        toast.error("Positions not found");
      }
    } catch (err) {
      console.error("Fetch Positions Error:", err);
      toast.error("Failed to fetch Positions data");
    }
  };

  // ✅ Handlers
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleAddReference = () => {
    setFormData((prev) => ({
      ...prev,
      reference: [...prev.reference, { label: "", url: "" }],
    }));
  };

  const handleRemoveReference = (index) => {
    setFormData((prev) => ({
      ...prev,
      reference: prev.reference.filter((_, i) => i !== index),
    }));
  };

  const handleReferenceChange = (index, field, value) => {
    const updated = [...formData.reference];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, reference: updated }));
  };

  // ✅ Submit Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title)
      newErrors.title = "Title is required";
   
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (!["old_image", "reference"].includes(key)) {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append("reference", JSON.stringify(formData.reference));

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const adminid = localStorage.getItem("adminid");
      formDataToSend.append("updatedBy", adminid);

      const result = await updatePositions(id, formDataToSend);

      if (!result.status) {
        toast.error(result.msg || "Failed to update Positions.");
        return;
      }

      toast.success("Positions updated successfully!");
      navigate(`/dashboard/list-positions/${celebrityId}`);
    } catch (err) {
      console.error("Update Positions Error:", err);
      toast.error("Something went wrong while updating the Positions.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs
          title="Update Positions"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Position Title </Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInput}
                        placeholder="Position Title"
                        type="text"
                      />
                      {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Department / Ministry </Label>
                      <Input
                        name="department"
                        value={formData.department}
                        onChange={handleInput}
                        placeholder="Department / Ministry"
                        type="text"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Government Level</Label>
                      <Input
                        type="select"
                        name="level"
                        onChange={handleInput}
                        value={formData.level}
                      >
                        <option value="">Select</option>
                        <option value="Central">Central </option>
                        <option value="State">State </option>

                        <option value="Local">Local </option>
                        <option value="Party">Party </option>
                      </Input>
                    </Col>

                    <Col md="6">
                      <Label>From Date </Label>
                      <Input
                        name="from_date"
                        value={formData.from_date}
                        onChange={handleInput}
                        placeholder="From Date"
                        type="date"
                      />
                    </Col>
                    <Col md="6">
                      <Label>To Date </Label>
                      <Input
                        name="to_date"
                        value={formData.to_date}
                        onChange={handleInput}
                        placeholder="To Date"
                        type="date"
                      />
                    </Col>
                    <Col md="6">
                      <Label>Is Current </Label>
                      <Input
                        name="current"
                        value={formData.current}
                        onChange={handleInput}
                        placeholder="Is Current"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>State </Label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInput}
                        placeholder="State "
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Constituency / Region </Label>
                      <Input
                        name="constituency"
                        value={formData.constituency}
                        onChange={handleInput}
                        placeholder="Constituency / Region"
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Party / Affiliation </Label>
                      <Input
                        name="party"
                        value={formData.party}
                        onChange={handleInput}
                        placeholder="Party / Affiliation "
                        type="text"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Reporting To / Under </Label>
                      <Input
                        name="reporting"
                        value={formData.reporting}
                        onChange={handleInput}
                        placeholder="Reporting To / Under"
                        type="text"
                      />
                    </Col>

                    <Col md="12">
                      <Label>Major Work / Achievements </Label>
                      <Input
                        type="textarea"
                        name="work"
                        value={formData.work}
                        onChange={handleInput}
                        placeholder="Major Work / Achievements "
                      />
                    </Col>

                    <Col md="6">
                      <Label>Media (Image/Video)</Label>
                      <Input
                        type="file"
                        name="image"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                      />
                      {formData.old_image && (
                        <div className="mt-2">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/positions/${formData.old_image}`}
                            alt="Preview"
                            width="100"
                            className="rounded border"
                          />
                        </div>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Sort Order</Label>
                      <Input
                        type="number"
                        name="sort"
                        value={formData.sort}
                        onChange={handleInput}
                        placeholder="Sort Order"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Status</Label>
                      <Input
                        type="select"
                        name="statusnew"
                        value={formData.statusnew}
                        onChange={handleInput}
                      >
                        <option value="">Select</option>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </Input>
                    </Col>

                    {/* ✅ Reference Links */}
                    <Col md="12" className="mt-4">
                      <h5>Reference Link(s)</h5>
                      {formData.reference.map((link, index) => (
                        <Row key={index} className="align-items-center mb-2">
                          <Col md="3">
                            <Label>Label</Label>
                            <Input
                              type="text"
                              value={link.label}
                              onChange={(e) =>
                                handleReferenceChange(
                                  index,
                                  "label",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. News Source"
                            />
                          </Col>
                          <Col md="5">
                            <Label>URL</Label>
                            <Input
                              type="url"
                              value={link.url}
                              onChange={(e) =>
                                handleReferenceChange(
                                  index,
                                  "url",
                                  e.target.value
                                )
                              }
                              placeholder="https://..."
                            />
                          </Col>
                          <Col md="1" className="d-flex align-items-end">
                            <Button
                              type="button"
                              color="danger"
                              onClick={() => handleRemoveReference(index)}
                            >
                              ×
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        type="button"
                        color="secondary"
                        onClick={handleAddReference}
                      >
                        + Add Reference Link
                      </Button>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 mt-3">
                    <Button type="submit" color="primary">
                      Update Positions
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/list-positions/${celebrityId}`)}
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

export default UpdatePositions;
