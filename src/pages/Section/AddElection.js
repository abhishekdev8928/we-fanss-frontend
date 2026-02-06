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
  FormGroup,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { toast } from "react-toastify";
import { getLanguageOptions, addElection } from "../../api/electionApi";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const AddElection = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Add Election", link: "#" },
  ]);
  const navigate = useNavigate();

  const { id } = useParams();
  const celebrityId = id;

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
    statusnew: "Draft",
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [languagesOptions, setLanguageOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLanguageOptions();
  }, []);

  const fetchLanguageOptions = async () => {
    try {
      const data = await getLanguageOptions();
      const options = (data?.msg || []).map((item) => ({
        value: item?._id,
        label: item?.name?.trim() || item?.name,
      }));
      setLanguageOptions(options);
    } catch (err) {
      console.error("Error fetching language options:", err);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e?.target || {};
    if (!name) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (selectedDates, name) => {
    const formattedDate = selectedDates?.[0]?.toISOString()?.split("T")[0];
    setFormData((prev) => ({ ...prev, [name]: formattedDate }));
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) setSelectedFile(file);
  };

  // ✅ Handle Watch Links repeater
  const handleAddWatchLink = () => {
    setFormData((prev) => ({
      ...prev,
      reference: [...(prev?.reference || []), { label: "", url: "", type: "" }],
    }));
  };

  const handleRemoveWatchLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      reference: prev?.reference?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleWatchLinkChange = (index, field, value) => {
    const updated = [...(formData?.reference || [])];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, reference: updated }));
  };

  // ✅ Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.election_year?.toString()?.trim()) {
      newErrors.election_year = "Election year is required";
    }

    if (!formData?.type?.trim()) {
      newErrors.type = "Election type is required";
    }

    if (!formData?.state?.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!celebrityId) {
      toast.error("Celebrity ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // ✅ Append all form fields with proper validation
      formDataToSend.append("election_year", formData?.election_year || "");
      formDataToSend.append("type", formData?.type || "");
      formDataToSend.append("state", formData?.state || "");
      formDataToSend.append("constituency", formData?.constituency || "");
      formDataToSend.append("party", formData?.party || "");
      formDataToSend.append("role", formData?.role || "");
      formDataToSend.append("result", formData?.result || "");
      formDataToSend.append("vote_share", formData?.vote_share || "");
      formDataToSend.append("votes", formData?.votes || "");
      formDataToSend.append("opponent", formData?.opponent || "");
      formDataToSend.append("notes", formData?.notes || "");
      formDataToSend.append("reference", JSON.stringify(formData?.reference || []));
      formDataToSend.append("sort", formData?.sort || "");
      formDataToSend.append("statusnew", formData?.statusnew || "Draft");
      formDataToSend.append("celebrityId", celebrityId); // ✅ REQUIRED

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const adminid = localStorage.getItem("adminid");
      if (adminid) {
        formDataToSend.append("createdBy", adminid);
      }

      // Call backend API
      const result = await addElection(formDataToSend);

      if (result?.success === false || !result?.status) {
        toast.error(result?.msg || result?.message || "Failed to add election");
        return;
      }

      toast.success("Election added successfully!");
      navigate(`/dashboard/list-election/${celebrityId}`);

      // Reset form
      setFormData({
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
        statusnew: "Draft",
        image: "",
      });
      setSelectedFile(null);
      setErrors({});
    } catch (err) {
      console.error("Add Election Error:", err);
      toast.error(err?.response?.data?.message || "Something went wrong while adding the election");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Add Election" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card
              style={{
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: "12px",
              }}
            >
              <CardBody>
                <form onSubmit={handleAddSubmit}>
                  <Row>
                    {/* ✅ Election Year - REQUIRED */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Election Year <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="election_year"
                          value={formData?.election_year}
                          onChange={handleInput}
                          placeholder="Enter election year"
                          type="number"
                          disabled={isSubmitting}
                          invalid={!!errors?.election_year}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                        {errors?.election_year && (
                          <span className="text-danger small d-block mt-1">
                            {errors.election_year}
                          </span>
                        )}
                      </FormGroup>
                    </Col>

                    {/* ✅ Election Type - REQUIRED */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Election Type <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="select"
                          name="type"
                          onChange={handleInput}
                          value={formData?.type}
                          disabled={isSubmitting}
                          invalid={!!errors?.type}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        >
                          <option value="">Select Election Type</option>
                          <option value="Lok Sabha">Lok Sabha</option>
                          <option value="Vidhan Sabha">Vidhan Sabha</option>
                          <option value="Rajya Sabha">Rajya Sabha</option>
                          <option value="Municipal">Municipal</option>
                          <option value="Panchayat">Panchayat</option>
                          <option value="Other">Other</option>
                        </Input>
                        {errors?.type && (
                          <span className="text-danger small d-block mt-1">
                            {errors.type}
                          </span>
                        )}
                      </FormGroup>
                    </Col>

                    {/* ✅ State - REQUIRED */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          State <span className="text-danger">*</span>
                        </Label>
                        <Input
                          name="state"
                          value={formData?.state}
                          onChange={handleInput}
                          placeholder="Enter state"
                          type="text"
                          disabled={isSubmitting}
                          invalid={!!errors?.state}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                        {errors?.state && (
                          <span className="text-danger small d-block mt-1">
                            {errors.state}
                          </span>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Constituency */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Constituency
                        </Label>
                        <Input
                          name="constituency"
                          value={formData?.constituency}
                          onChange={handleInput}
                          placeholder="Enter constituency"
                          type="text"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Party / Affiliation */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Party / Affiliation
                        </Label>
                        <Input
                          name="party"
                          value={formData?.party}
                          onChange={handleInput}
                          placeholder="Enter party or affiliation"
                          type="text"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Role in Election */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Role in Election
                        </Label>
                        <Input
                          type="select"
                          name="role"
                          onChange={handleInput}
                          value={formData?.role}
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        >
                          <option value="">Select Role</option>
                          <option value="Candidate">Candidate</option>
                          <option value="Campaign Lead">Campaign Lead</option>
                          <option value="Star Campaigner">Star Campaigner</option>
                          <option value="Support">Support</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Result */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Result
                        </Label>
                        <Input
                          type="select"
                          name="result"
                          onChange={handleInput}
                          value={formData?.result}
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        >
                          <option value="">Select Result</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                          <option value="Withdrawn">Withdrawn</option>
                          <option value="Nominated">Nominated</option>
                          <option value="Unknown">Unknown</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* Vote Share % */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Vote Share %
                        </Label>
                        <Input
                          name="vote_share"
                          value={formData?.vote_share}
                          onChange={handleInput}
                          placeholder="Enter vote share percentage"
                          type="text"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Total Votes Received */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Total Votes Received
                        </Label>
                        <Input
                          name="votes"
                          value={formData?.votes}
                          onChange={handleInput}
                          placeholder="Enter total votes"
                          type="number"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Opponent(s) */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Opponent(s)
                        </Label>
                        <Input
                          name="opponent"
                          value={formData?.opponent}
                          onChange={handleInput}
                          placeholder="Enter opponent names"
                          type="text"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Key Highlights / Notes */}
                    <Col md="12">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Key Highlights / Notes
                        </Label>
                        <Input
                          type="textarea"
                          name="notes"
                          value={formData?.notes}
                          onChange={handleInput}
                          placeholder="Enter key highlights or notes"
                          rows="3"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Media (Image/Video) */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Media (Image/Video)
                        </Label>
                        <Input
                          type="file"
                          name="image"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                        {formData?.old_image && (
                          <div className="mt-2">
                            <img
                              src={`${process.env.REACT_APP_API_BASE_URL}/election/${formData.old_image}`}
                              alt="Preview"
                              width="100"
                              className="rounded border"
                            />
                          </div>
                        )}
                      </FormGroup>
                    </Col>

                    {/* Sort Order */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Sort Order
                        </Label>
                        <Input
                          name="sort"
                          value={formData?.sort}
                          onChange={handleInput}
                          placeholder="Enter sort order"
                          type="number"
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        />
                      </FormGroup>
                    </Col>

                    {/* Status */}
                    <Col md="6">
                      <FormGroup>
                        <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                          Status
                        </Label>
                        <Input
                          type="select"
                          name="statusnew"
                          onChange={handleInput}
                          value={formData?.statusnew}
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            padding: "10px 12px",
                          }}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* ✅ REFERENCE LINKS SECTION */}
                    <Col md="12" className="mt-4">
                      <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                        Reference Link(s)
                      </h5>
                      {formData?.reference?.map((link, index) => (
                        <Row key={index} className="align-items-end mb-3">
                          <Col md="3">
                            <FormGroup>
                              <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                                Label
                              </Label>
                              <Input
                                type="text"
                                value={link?.label}
                                placeholder="e.g. News Article"
                                onChange={(e) =>
                                  handleWatchLinkChange(index, "label", e?.target?.value)
                                }
                                disabled={isSubmitting}
                                style={{
                                  borderRadius: "8px",
                                  border: "1px solid #e0e0e0",
                                  padding: "10px 12px",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="7">
                            <FormGroup>
                              <Label style={{ fontWeight: "500", fontSize: "14px" }}>
                                URL
                              </Label>
                              <Input
                                type="url"
                                value={link?.url}
                                placeholder="https://..."
                                onChange={(e) =>
                                  handleWatchLinkChange(index, "url", e?.target?.value)
                                }
                                disabled={isSubmitting}
                                style={{
                                  borderRadius: "8px",
                                  border: "1px solid #e0e0e0",
                                  padding: "10px 12px",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md="2">
                            <Button
                              type="button"
                              color="danger"
                              onClick={() => handleRemoveWatchLink(index)}
                              disabled={isSubmitting}
                              style={{
                                borderRadius: "8px",
                                padding: "10px",
                                width: "100%",
                              }}
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        type="button"
                        color="secondary"
                        onClick={handleAddWatchLink}
                        disabled={isSubmitting}
                        style={{
                          borderRadius: "8px",
                          padding: "10px 16px",
                        }}
                      >
                        + Add Reference Link
                      </Button>
                    </Col>
                  </Row>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="theme-btn bg-theme"
                      style={{
                        color: "white",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        border: "none",
                        fontWeight: "500",
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Adding...
                        </>
                      ) : (
                        "Add Election"
                      )}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate(`/dashboard/list-election/${celebrityId}`)}
                      disabled={isSubmitting}
                      style={{
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: "500",
                      }}
                    >
                      Cancel
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

export default AddElection;