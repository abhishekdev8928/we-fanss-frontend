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
import { getElectionById, updateElection } from "../../api/electionApi";

const UpdateElection = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Update Election", link: "#" },
  ]);

  const navigate = useNavigate();
  const { id } = useParams(); // Election ID from route

  const [formData, setFormData] = useState({
    election_year: "",
    type: "",
    state: "",
    constituency: "",
    party: "",
    role: "",
    result: "",
    vote_share: "",
    votes: "",
    opponent: "",
    notes: "",
    reference: [],
    sort: "",
    statusnew: "",
    old_image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [celebrityId, setCelebrityId] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Fetch Election Data
  useEffect(() => {
    fetchElectionById();
  }, [id]);

  const fetchElectionById = async () => {
    try {
      const res = await getElectionById(id);
      if (res.msg) {
        const data = res.msg;
        setFormData({
          election_year: data.election_year || "",
          type: data.type || "",
          state: data.state || "",
          constituency: data.constituency || "",
          party: data.party || "",
          role: data.role || "",
          result: data.result || "",
          vote_share: data.vote_share || "",
          votes: data.votes || "",
          opponent: data.opponent || "",
          notes: data.notes || "",
          reference: data.reference || [],
          sort: data.sort || "",
          statusnew: data.statusnew || "",
          old_image: data.image || "",
        });
        setCelebrityId(data.celebrityId);
      } else {
        toast.error("Election not found");
      }
    } catch (err) {
      console.error("Fetch Election Error:", err);
      toast.error("Failed to fetch Election data");
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
    if (!formData.election_year)
      newErrors.election_year = "Election year is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.state) newErrors.state = "State is required";

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

      const result = await updateElection(id, formDataToSend);

      if (!result.status) {
        toast.error(result.msg || "Failed to update Election.");
        return;
      }

      toast.success("Election updated successfully!");
      navigate(`/list-election/${celebrityId}`);
    } catch (err) {
      console.error("Update Election Error:", err);
      toast.error("Something went wrong while updating the Election.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Update Election" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>
                  <Row>
                    <Col md="6">
                      <Label>Election Year</Label>
                      <Input
                        type="number"
                        name="election_year"
                        value={formData.election_year}
                        onChange={handleInput}
                        placeholder="e.g. 2024"
                      />
                      {errors.election_year && (
                        <span className="text-danger">{errors.election_year}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Election Type</Label>
                      <Input
                        type="select"
                        name="type"
                        value={formData.type}
                        onChange={handleInput}
                      >
                        <option value="">Select</option>
                        <option value="Lok Sabha">Lok Sabha</option>
                        <option value="Vidhan Sabha">Vidhan Sabha</option>
                        <option value="Municipal">Municipal</option>
                        <option value="Panchayat">Panchayat</option>
                        <option value="Rajya Sabha">Rajya Sabha</option>
                        <option value="Other">Other</option>
                      </Input>
                      {errors.type && (
                        <span className="text-danger">{errors.type}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>State</Label>
                      <Input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInput}
                        placeholder="State"
                      />
                      {errors.state && (
                        <span className="text-danger">{errors.state}</span>
                      )}
                    </Col>

                    <Col md="6">
                      <Label>Constituency</Label>
                      <Input
                        type="text"
                        name="constituency"
                        value={formData.constituency}
                        onChange={handleInput}
                        placeholder="Constituency"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Party / Affiliation</Label>
                      <Input
                        type="text"
                        name="party"
                        value={formData.party}
                        onChange={handleInput}
                        placeholder="Party / Affiliation"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Role in Election</Label>
                      <Input
                        type="select"
                        name="role"
                        value={formData.role}
                        onChange={handleInput}
                      >
                        <option value="">Select</option>
                        <option value="Candidate">Candidate</option>
                        <option value="Campaign Lead">Campaign Lead</option>
                        <option value="Star Campaigner">Star Campaigner</option>
                        <option value="Support">Support</option>
                      </Input>
                    </Col>

                    <Col md="6">
                      <Label>Result</Label>
                      <Input
                        type="select"
                        name="result"
                        value={formData.result}
                        onChange={handleInput}
                      >
                        <option value="">Select</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                        <option value="Withdrawn">Withdrawn</option>
                        <option value="Nominated">Nominated</option>
                        <option value="Unknown">Unknown</option>
                      </Input>
                    </Col>

                    <Col md="6">
                      <Label>Vote Share %</Label>
                      <Input
                        type="text"
                        name="vote_share"
                        value={formData.vote_share}
                        onChange={handleInput}
                        placeholder="e.g. 52%"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Total Votes Received</Label>
                      <Input
                        type="number"
                        name="votes"
                        value={formData.votes}
                        onChange={handleInput}
                        placeholder="Total Votes"
                      />
                    </Col>

                    <Col md="6">
                      <Label>Opponent(s)</Label>
                      <Input
                        type="text"
                        name="opponent"
                        value={formData.opponent}
                        onChange={handleInput}
                        placeholder="Opponent names"
                      />
                    </Col>

                    <Col md="12">
                      <Label>Key Highlights / Note</Label>
                      <Input
                        type="textarea"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInput}
                        placeholder="Highlights, achievements, etc."
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
                            src={`${process.env.REACT_APP_API_BASE_URL}/election/${formData.old_image}`}
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
                                handleReferenceChange(index, "url", e.target.value)
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
                      Update Election
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/list-election/${celebrityId}`)}
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

export default UpdateElection;
