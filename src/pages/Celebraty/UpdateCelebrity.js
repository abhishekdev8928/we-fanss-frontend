// UpdateCelebrityForm.jsx - COMPLETE Version matching AddCelebrityForm
import React, { useState, useEffect } from "react";
import RichTextEditor from "../../components/editor/RichTextEditor";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  getLanguageOptions,
  getProfessionsOptions,
  updateCelebraty,
  getSocialLinksOptions,
  getCelebratyById,
} from "../../api/celebratyApi";
import { useAuthStore, useRoleName } from "../../config/store/authStore";


const knownForRegionOptions = [
  { value: "India", label: "India" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "South Korea", label: "South Korea" },
  { value: "Japan", label: "Japan" },
  { value: "Europe", label: "Europe" },
  { value: "Middle East", label: "Middle East" },
];

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const UpdateCelebrityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const STORE = useAuthStore((s) => s.roleName)
  const isAdmin  = ["Super Admin" , "Admin"].includes(useRoleName());

  console.log("from here " , isAdmin , STORE , useRoleName())

  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "#" },
    { title: "Update Celebrity", link: "#" },
  ]);

  const [activeTab, setActiveTab] = useState("1");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [oldGallery, setOldGallery] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [languagesOptions, setLanguageOptions] = useState([]);
  const [professionsOptions, setProfessionsOptions] = useState([]);
  const [socialLinksOptions, setSocialLinksOptions] = useState([]);

  // ✅ NEW: States for tags and keywords input
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [formData, setFormData] = useState({
    // A) Identity & Profile
    name: "",
    slug: "",
    shortinfo: "",
    biography: "",
    status: "Draft",
    previewImage: "",
    old_image: "",
    removeOldImage: false,

    // B) Personal Details
    dob: "",
    birthplace: "",
    gender: "",
    nationality: "",
    religion: "",

    // C) Family & Relationships
    fatherName: "",
    showFather: false,
    motherName: "",
    showMother: false,
    spouseName: "",
    showSpouse: false,
    children: [],
    siblings: [],

    // D) Professional Identity
    professions: [],
    primaryProfession: "",
    languages: [],
    primaryLanguage: "",
    careerStartYear: "",
    careerEndYear: "",
    isCareerOngoing: true,

    // E) Location & Public Presence
    currentCity: "",
    knownForRegion: [],

    // F) Physical & Public Attributes
    height: "",
    signatureStyle: "",

    // G) Social Links
    socialLinks: [],

    // H) SEO Metadata
    tags: [],
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoKeywords: [],

    // I) Admin Controls (if admin)
    isFeatured: false,
    verificationStatus: "Not Claimed",
    internalNotes: "",
  });

  const [editorKey, setEditorKey] = useState(0);

  // ✅ Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#dee2e6",
      },
    }),
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
    },
    accept: { "image/*": [] },
    multiple: true,
  });

  useEffect(() => {
    fetchLanguageOptions();
    fetchProfessionsOptions();
    fetchSocialLinksOptions();
    fetchCelebrityData();
  }, [id]);

  const fetchCelebrityData = async () => {
    try {
      setLoading(true);
      const res_data = await getCelebratyById(id);
      const celebrityData = res_data.data || res_data.msg;

      if (!celebrityData) {
        toast.error("Celebrity not found");
        navigate("/dashboard/celebrity-list");
        return;
      }

      // ✅ Helper function to extract ID from object or string
      const extractId = (item) => {
        if (!item) return "";
        return typeof item === "object" ? item._id : item;
      };

      // ✅ Helper function to extract array of IDs
      const extractIds = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map(extractId).filter(Boolean);
      };

      // ✅ Map celebrity data to form structure
      setFormData({
        // A) Identity & Profile
        name: celebrityData.identityProfile?.name || "",
        slug: celebrityData.identityProfile?.slug || "",
        shortinfo: celebrityData.identityProfile?.shortinfo || "",
        biography: celebrityData.identityProfile?.biography || "",
        status: celebrityData.identityProfile?.status || "Draft",
        old_image: celebrityData.identityProfile?.image || "",
        previewImage: "",
        removeOldImage: false,

        // B) Personal Details
        dob: celebrityData.personalDetails?.dob
          ? new Date(celebrityData.personalDetails.dob).toISOString().split("T")[0]
          : "",
        birthplace: celebrityData.personalDetails?.birthplace || "",
        gender: celebrityData.personalDetails?.gender || "",
        nationality: celebrityData.personalDetails?.nationality || "",
        religion: celebrityData.personalDetails?.religion || "",

        // C) Family & Relationships
        fatherName: celebrityData.familyRelationships?.father?.name || "",
        showFather: celebrityData.familyRelationships?.father?.showOnPublicProfile || false,
        motherName: celebrityData.familyRelationships?.mother?.name || "",
        showMother: celebrityData.familyRelationships?.mother?.showOnPublicProfile || false,
        spouseName: celebrityData.familyRelationships?.spouse?.name || "",
        showSpouse: celebrityData.familyRelationships?.spouse?.showOnPublicProfile || false,
        children: celebrityData.familyRelationships?.children || [],
        siblings: celebrityData.familyRelationships?.siblings || [],

        // D) Professional Identity
        professions: extractIds(celebrityData.professionalIdentity?.professions),
        primaryProfession: extractId(celebrityData.professionalIdentity?.primaryProfession),
        languages: extractIds(celebrityData.professionalIdentity?.languages),
        primaryLanguage: extractId(celebrityData.professionalIdentity?.primaryLanguage),
        careerStartYear: celebrityData.professionalIdentity?.careerStartYear || "",
        careerEndYear: celebrityData.professionalIdentity?.careerEndYear || "",
        isCareerOngoing: celebrityData.professionalIdentity?.isCareerOngoing !== false,

        // E) Location & Public Presence
        currentCity: celebrityData.locationPresence?.currentCity || "",
        knownForRegion: celebrityData.locationPresence?.knownForRegion || [],

        // F) Physical & Public Attributes
        height: celebrityData.publicAttributes?.height || "",
        signatureStyle: celebrityData.publicAttributes?.signatureStyle || "",

        // G) Social Links
        socialLinks: (celebrityData.socialLinks || []).map((link) => ({
          platform: extractId(link.platform),
          url: link.url || "",
          label: link.label || "",
        })),

        // H) SEO Metadata
        tags: celebrityData.seoMetadata?.tags || [],
        seoMetaTitle: celebrityData.seoMetadata?.seoMetaTitle || "",
        seoMetaDescription: celebrityData.seoMetadata?.seoMetaDescription || "",
        seoKeywords: celebrityData.seoMetadata?.seoKeywords || [],

        // I) Admin Controls
        isFeatured: celebrityData.adminControls?.isFeatured || false,
        verificationStatus: celebrityData.adminControls?.verificationStatus || "Not Claimed",
        internalNotes: celebrityData.adminControls?.internalNotes || "",
      });

      // ✅ Set old gallery
      setOldGallery(celebrityData.identityProfile?.gallery || []);
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.error("Fetch Celebrity error:", error);
      toast.error("Failed to fetch Celebrity data");
      navigate("/dashboard/celebrity-list");
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinksOptions = async () => {
    try {
      const response = await getSocialLinksOptions();
      const data = response.data || response.msg || response;
      const options = (Array.isArray(data) ? data : []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setSocialLinksOptions(options);
    } catch (err) {
      console.error("Error fetching social link options:", err);
      toast.error("Failed to fetch social links");
    }
  };

  const fetchLanguageOptions = async () => {
    try {
      const response = await getLanguageOptions();
      const data = response.data || response.msg || response;
      const options = (Array.isArray(data) ? data : []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setLanguageOptions(options);
    } catch (err) {
      console.error("Error fetching language options:", err);
      toast.error("Failed to fetch languages");
    }
  };

  const fetchProfessionsOptions = async () => {
    try {
      const response = await getProfessionsOptions();
      const data = response.data || response.msg || response;
      const options = (Array.isArray(data) ? data : []).map((item) => ({
        value: item._id,
        label: item.name?.trim() || item.name,
      }));
      setProfessionsOptions(options);
    } catch (err) {
      console.error("Error fetching profession options:", err);
      toast.error("Failed to fetch professions");
    }
  };

  const isValidSocialUrl = (url) => {
    if (!url || url.trim() === "") return true;
    const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9_-]+(\.[a-z]{2,})(\/.*)?$/;
    return pattern.test(url.trim());
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generatedSlug,
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Handle tag input on Enter key
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  // ✅ Handle keyword input on Enter key
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.seoKeywords.includes(keywordInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          seoKeywords: [...prev.seoKeywords, keywordInput.trim()],
        }));
      }
      setKeywordInput("");
    }
  };

  // ✅ Remove tag
  const removeTag = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove),
    }));
  };

  // ✅ Remove keyword
  const removeKeyword = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Auto-set primary profession when only one is selected
  useEffect(() => {
    if (formData.professions.length === 1 && !formData.primaryProfession) {
      setFormData((prev) => ({
        ...prev,
        primaryProfession: formData.professions[0],
      }));
    }
  }, [formData.professions]);

  // Auto-set primary language when only one is selected
  useEffect(() => {
    if (formData.languages.length === 1 && !formData.primaryLanguage) {
      setFormData((prev) => ({
        ...prev,
        primaryLanguage: formData.languages[0],
      }));
    }
  }, [formData.languages]);

  const validateForm = () => {
    const newErrors = {};

    // A) Identity & Profile - Required
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    }

    // D) Professional Identity - Required
    if (!formData.professions?.length) {
      newErrors.professions = "At least one profession is required";
    }

    if (!formData.primaryProfession) {
      newErrors.primaryProfession = "Primary profession is required";
    } else if (!formData.professions.includes(formData.primaryProfession)) {
      newErrors.primaryProfession = "Primary profession must be from selected professions";
    }

    // Primary Language validation (if languages selected)
    if (formData.primaryLanguage && formData.languages.length > 0) {
      if (!formData.languages.includes(formData.primaryLanguage)) {
        newErrors.primaryLanguage = "Primary language must be from selected languages";
      }
    }

    // Validate social links
    const socialLinkErrors = [];
    formData.socialLinks.forEach((link, index) => {
      if (link.platform && link.url) {
        if (!isValidSocialUrl(link.url)) {
          socialLinkErrors[index] = "Please enter a valid URL";
        }
      } else if (link.platform && !link.url) {
        socialLinkErrors[index] = "URL is required for this platform";
      } else if (!link.platform && link.url) {
        socialLinkErrors[index] = "Please select a platform";
      }
    });

    if (socialLinkErrors.some((err) => err)) {
      newErrors.socialLinks = socialLinkErrors;
    }

    // Career year validation
    if (formData.careerStartYear && formData.careerEndYear) {
      if (!formData.isCareerOngoing && parseInt(formData.careerEndYear) < parseInt(formData.careerStartYear)) {
        newErrors.careerEndYear = "End year must be after start year";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // A) Identity & Profile
      formDataToSend.append("identityProfile[name]", formData.name.trim());
      formDataToSend.append("identityProfile[slug]", formData.slug.trim());
      if (formData.shortinfo) {
        formDataToSend.append("identityProfile[shortinfo]", formData.shortinfo.trim());
      }
      if (formData.biography) {
        formDataToSend.append("identityProfile[biography]", formData.biography.trim());
      }
      formDataToSend.append("identityProfile[status]", formData.status);

      // B) Personal Details
      if (formData.dob) {
        formDataToSend.append("personalDetails[dob]", formData.dob);
      }
      if (formData.birthplace) {
        formDataToSend.append("personalDetails[birthplace]", formData.birthplace.trim());
      }
      if (formData.gender) {
        formDataToSend.append("personalDetails[gender]", formData.gender);
      }
      if (formData.nationality) {
        formDataToSend.append("personalDetails[nationality]", formData.nationality.trim());
      }
      if (formData.religion) {
        formDataToSend.append("personalDetails[religion]", formData.religion.trim());
      }

      // C) Family & Relationships
      if (formData.fatherName) {
        formDataToSend.append("familyRelationships[father][name]", formData.fatherName.trim());
        formDataToSend.append(
          "familyRelationships[father][showOnPublicProfile]",
          formData.showFather.toString()
        );
      }
      if (formData.motherName) {
        formDataToSend.append("familyRelationships[mother][name]", formData.motherName.trim());
        formDataToSend.append(
          "familyRelationships[mother][showOnPublicProfile]",
          formData.showMother.toString()
        );
      }
      if (formData.spouseName) {
        formDataToSend.append("familyRelationships[spouse][name]", formData.spouseName.trim());
        formDataToSend.append(
          "familyRelationships[spouse][showOnPublicProfile]",
          formData.showSpouse.toString()
        );
      }
      if (formData.children.length > 0) {
        formDataToSend.append("familyRelationships[children]", JSON.stringify(formData.children));
      }
      if (formData.siblings.length > 0) {
        formDataToSend.append("familyRelationships[siblings]", JSON.stringify(formData.siblings));
      }

      // D) Professional Identity
      formDataToSend.append(
        "professionalIdentity[professions]",
        JSON.stringify(formData.professions)
      );
      formDataToSend.append(
        "professionalIdentity[primaryProfession]",
        formData.primaryProfession
      );
      if (formData.languages.length > 0) {
        formDataToSend.append(
          "professionalIdentity[languages]",
          JSON.stringify(formData.languages)
        );
      }
      if (formData.primaryLanguage) {
        formDataToSend.append(
          "professionalIdentity[primaryLanguage]",
          formData.primaryLanguage
        );
      }
      if (formData.careerStartYear) {
        formDataToSend.append(
          "professionalIdentity[careerStartYear]",
          formData.careerStartYear.toString()
        );
      }
      if (formData.careerEndYear && !formData.isCareerOngoing) {
        formDataToSend.append(
          "professionalIdentity[careerEndYear]",
          formData.careerEndYear.toString()
        );
      }
      formDataToSend.append(
        "professionalIdentity[isCareerOngoing]",
        formData.isCareerOngoing.toString()
      );

      // E) Location & Public Presence
      if (formData.currentCity) {
        formDataToSend.append("locationPresence[currentCity]", formData.currentCity.trim());
      }
      if (formData.knownForRegion.length > 0) {
        formDataToSend.append(
          "locationPresence[knownForRegion]",
          JSON.stringify(formData.knownForRegion)
        );
      }

      // F) Physical & Public Attributes
      if (formData.height) {
        formDataToSend.append("publicAttributes[height]", formData.height.trim());
      }
      if (formData.signatureStyle) {
        formDataToSend.append("publicAttributes[signatureStyle]", formData.signatureStyle.trim());
      }

      // G) Social Links
      const validSocialLinks = formData.socialLinks
        .filter((link) => link.platform && link.url)
        .map((link) => ({
          platform: link.platform,
          url: link.url.trim(),
          label: link.label || "",
        }));

      if (validSocialLinks.length > 0) {
        formDataToSend.append("socialLinks", JSON.stringify(validSocialLinks));
      }

      // H) SEO Metadata
      if (formData.tags.length > 0) {
        formDataToSend.append("seoMetadata[tags]", JSON.stringify(formData.tags));
      }
      if (formData.seoMetaTitle) {
        formDataToSend.append("seoMetadata[seoMetaTitle]", formData.seoMetaTitle.trim());
      }
      if (formData.seoMetaDescription) {
        formDataToSend.append("seoMetadata[seoMetaDescription]", formData.seoMetaDescription.trim());
      }
      if (formData.seoKeywords.length > 0) {
        formDataToSend.append("seoMetadata[seoKeywords]", JSON.stringify(formData.seoKeywords));
      }

      // I) Admin Controls
      formDataToSend.append(
        "adminControls[isFeatured]",
        formData.isFeatured.toString()
      );
      formDataToSend.append("adminControls[verificationStatus]", formData.verificationStatus);
      if (formData.internalNotes) {
        formDataToSend.append("adminControls[internalNotes]", formData.internalNotes.trim());
      }

      // FILES
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }
      if (formData.removeOldImage) {
        formDataToSend.append("removeOldImage", "true");
      }

      // Gallery
      formDataToSend.append("oldGallery", JSON.stringify(oldGallery));
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formDataToSend.append("gallery", file);
        });
      }

      console.log("Updating celebrity data...");

      const result = await updateCelebraty(id, formDataToSend);

      const success = result.success || result.status;
      const message = result.message || result.msg;

      if (!success) {
        toast.error(message || "Failed to update celebrity.");
        return;
      }

      toast.success(message || "Celebrity Updated Successfully");
      navigate("/dashboard/celebrity-list");
    } catch (err) {
      console.error("Update celebrity Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Something went wrong while updating celebrity.";

      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="UPDATE Celebrity" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  {/* TABS FOR ORGANIZED FORM */}
                  <Nav tabs className="mb-3">
                    <NavItem>
                      <NavLink
                        className={activeTab === "1" ? "active" : ""}
                        onClick={() => setActiveTab("1")}
                        style={{ cursor: "pointer" }}
                      >
                        Basic Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "active" : ""}
                        onClick={() => setActiveTab("2")}
                        style={{ cursor: "pointer" }}
                      >
                        Personal & Family
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "3" ? "active" : ""}
                        onClick={() => setActiveTab("3")}
                        style={{ cursor: "pointer" }}
                      >
                        Professional
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "4" ? "active" : ""}
                        onClick={() => setActiveTab("4")}
                        style={{ cursor: "pointer" }}
                      >
                        Social & SEO
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <TabContent activeTab={activeTab}>
                    {/* TAB 1: BASIC INFO */}
                    <TabPane tabId="1">
                      <Row>
                        <Col md="6" className="mb-3">
                          <Label>
                            Name <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInput}
                            placeholder="Enter celebrity name"
                            type="text"
                            className={errors.name ? "is-invalid" : ""}
                          />
                          {errors.name && (
                            <div className="invalid-feedback d-block">{errors.name}</div>
                          )}
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>
                            Slug <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="slug"
                            value={formData.slug}
                            onChange={handleInput}
                            placeholder="auto-generated-slug"
                            type="text"
                            className={errors.slug ? "is-invalid" : ""}
                          />
                          {errors.slug && (
                            <div className="invalid-feedback d-block">{errors.slug}</div>
                          )}
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Status</Label>
                          <Input
                            type="select"
                            name="status"
                            onChange={handleInput}
                            value={formData.status}
                          >
                            <option value="Draft">Draft</option>
                            <option value="In Review">In Review</option>
                            <option value="Published">Published</option>
                            <option value="Archived">Archived</option>
                          </Input>
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label className="form-label">Profile Image</Label>
                          <Input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error("Image size should be less than 5MB");
                                  e.target.value = null;
                                  return;
                                }
                                setSelectedFile(file);
                                setFormData((prev) => ({
                                  ...prev,
                                  previewImage: URL.createObjectURL(file),
                                }));
                              }
                            }}
                          />

                          {(formData.previewImage || formData.old_image) && (
                            <div className="mt-2 position-relative d-inline-block">
                              <img
                                src={
                                  formData.previewImage
                                    ? formData.previewImage
                                    : `${API_BASE}${formData.old_image}`
                                }
                                alt="Preview"
                                width="100"
                                height="100"
                                className="rounded border"
                                style={{ objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setFormData((prev) => ({
                                    ...prev,
                                    previewImage: "",
                                    old_image: "",
                                    removeOldImage: true,
                                  }));
                                }}
                                style={{
                                  position: "absolute",
                                  top: "-8px",
                                  right: "-8px",
                                  background: "red",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "22px",
                                  height: "22px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                title="Remove Image"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </Col>

                        <Col md="12" className="mb-3">
                          <Label className="form-label">Gallery Images</Label>
                          <div
                            {...getRootProps()}
                            className={`border border-dashed p-4 text-center rounded bg-light ${
                              isDragActive ? "bg-primary bg-opacity-10" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <p className="mb-0 text-primary fw-bold">Drop images here...</p>
                            ) : (
                              <p className="mb-0 text-muted">
                                Drag & drop images here, or <strong>click to select</strong>
                              </p>
                            )}
                          </div>

                          {/* Old Gallery */}
                          {oldGallery.length > 0 && (
                            <div className="mt-3">
                              <small className="text-muted">Existing Gallery:</small>
                              <div className="d-flex flex-wrap gap-3 mt-2">
                                {oldGallery.map((file, idx) => (
                                  <div
                                    key={`old-${idx}`}
                                    className="position-relative"
                                    style={{ width: 100, height: 100 }}
                                  >
                                    <img
                                      src={`${API_BASE}${file}`}
                                      alt={`gallery-${idx}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        border: "1px solid #ddd",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOldGallery((prev) => prev.filter((_, i) => i !== idx))
                                      }
                                      style={{
                                        position: "absolute",
                                        top: -8,
                                        right: -8,
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 22,
                                        height: 22,
                                        cursor: "pointer",
                                        fontSize: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* New Gallery Files */}
                          {galleryFiles.length > 0 && (
                            <div className="mt-3">
                              <small className="text-muted">New Images to Upload:</small>
                              <div className="d-flex flex-wrap gap-3 mt-2">
                                {galleryFiles.map((file, idx) => (
                                  <div
                                    key={idx}
                                    className="position-relative"
                                    style={{ width: 100, height: 100 }}
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`gallery-${idx}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        border: "1px solid #ddd",
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                                      }}
                                      style={{
                                        position: "absolute",
                                        top: -8,
                                        right: -8,
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 22,
                                        height: 22,
                                        cursor: "pointer",
                                        fontSize: 14,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </Col>

                        <Col md="12" className="mb-3">
                          <Label>Short Intro</Label>
                          <Input
                            type="textarea"
                            name="shortinfo"
                            value={formData.shortinfo}
                            onChange={handleInput}
                            placeholder="Brief introduction"
                            rows="3"
                          />
                        </Col>

                        <Col md="12" className="mb-3">
                          <Label>Biography</Label>
                          <RichTextEditor
                            key={editorKey}
                            value={formData.biography}
                            height={400}
                            onChange={(data) =>
                              setFormData((prev) => ({
                                ...prev,
                                biography: data,
                              }))
                            }
                          />
                        </Col>
                      </Row>
                    </TabPane>

                    {/* TAB 2: PERSONAL & FAMILY - Same as Add Celebrity */}
                    <TabPane tabId="2">
                      <Row>
                        <Col md="12">
                          <h5 className="mb-3">Personal Details</h5>
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Date of Birth</Label>
                          <Input
                            name="dob"
                            value={formData.dob}
                            onChange={handleInput}
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Birthplace</Label>
                          <Input
                            name="birthplace"
                            value={formData.birthplace}
                            onChange={handleInput}
                            placeholder="City, State, Country"
                            type="text"
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Gender</Label>
                          <Input type="select" name="gender" onChange={handleInput} value={formData.gender}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </Input>
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Nationality</Label>
                          <Input
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInput}
                            placeholder="e.g. Indian"
                            type="text"
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Religion</Label>
                          <Input
                            name="religion"
                            value={formData.religion}
                            onChange={handleInput}
                            placeholder="Optional"
                            type="text"
                          />
                        </Col>

                        <Col md="12">
                          <hr className="my-4" />
                          <h5 className="mb-3">Family & Relationships</h5>
                        </Col>

                        <Col md="10" className="mb-3">
                          <Label>Father Name</Label>
                          <Input
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInput}
                            placeholder="Father's name"
                            type="text"
                          />
                        </Col>
                        <Col md="2" className="mb-3 d-flex align-items-end">
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="showFather"
                              name="showFather"
                              checked={formData.showFather}
                              onChange={handleInput}
                            />
                            <Label check for="showFather" className="small">
                              Show Public
                            </Label>
                          </div>
                        </Col>

                        <Col md="10" className="mb-3">
                          <Label>Mother Name</Label>
                          <Input
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInput}
                            placeholder="Mother's name"
                            type="text"
                          />
                        </Col>
                        <Col md="2" className="mb-3 d-flex align-items-end">
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="showMother"
                              name="showMother"
                              checked={formData.showMother}
                              onChange={handleInput}
                            />
                            <Label check for="showMother" className="small">
                              Show Public
                            </Label>
                          </div>
                        </Col>

                        <Col md="10" className="mb-3">
                          <Label>Spouse / Partner</Label>
                          <Input
                            name="spouseName"
                            value={formData.spouseName}
                            onChange={handleInput}
                            placeholder="Spouse's name"
                            type="text"
                          />
                        </Col>
                        <Col md="2" className="mb-3 d-flex align-items-end">
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="showSpouse"
                              name="showSpouse"
                              checked={formData.showSpouse}
                              onChange={handleInput}
                            />
                            <Label check for="showSpouse" className="small">
                              Show Public
                            </Label>
                          </div>
                        </Col>

                        {/* Children and Siblings - Same structure as Add Celebrity */}
                        <Col md="12" className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Label>Children</Label>
                            <Button
                              color="primary"
                              size="sm"
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  children: [
                                    ...prev.children,
                                    { name: "", relation: "", showOnPublicProfile: false },
                                  ],
                                }))
                              }
                            >
                              + Add Child
                            </Button>
                          </div>

                          {formData.children.length > 0 && (
                            <div>
                              {formData.children.map((child, index) => (
                                <div key={index} className="mb-2 p-3 border rounded">
                                  <Row className="g-2">
                                    <Col md="5">
                                      <Input
                                        type="text"
                                        placeholder="Name"
                                        value={child.name}
                                        onChange={(e) => {
                                          const updated = [...formData.children];
                                          updated[index].name = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            children: updated,
                                          }));
                                        }}
                                      />
                                    </Col>
                                    <Col md="4">
                                      <Input
                                        type="text"
                                        placeholder="Relation (Son/Daughter)"
                                        value={child.relation}
                                        onChange={(e) => {
                                          const updated = [...formData.children];
                                          updated[index].relation = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            children: updated,
                                          }));
                                        }}
                                      />
                                    </Col>
                                    <Col md="2">
                                      <div className="form-check">
                                        <Input
                                          type="checkbox"
                                          id={`childShow${index}`}
                                          checked={child.showOnPublicProfile}
                                          onChange={(e) => {
                                            const updated = [...formData.children];
                                            updated[index].showOnPublicProfile = e.target.checked;
                                            setFormData((prev) => ({
                                              ...prev,
                                              children: updated,
                                            }));
                                          }}
                                        />
                                        <Label check for={`childShow${index}`} className="small">
                                          Public
                                        </Label>
                                      </div>
                                    </Col>
                                    <Col md="1">
                                      <Button
                                        color="danger"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                          const updated = formData.children.filter((_, i) => i !== index);
                                          setFormData((prev) => ({
                                            ...prev,
                                            children: updated,
                                          }));
                                        }}
                                      >
                                        ×
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                            </div>
                          )}
                        </Col>

                        <Col md="12" className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Label>Siblings</Label>
                            <Button
                              color="primary"
                              size="sm"
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  siblings: [
                                    ...prev.siblings,
                                    { name: "", relation: "", showOnPublicProfile: false },
                                  ],
                                }))
                              }
                            >
                              + Add Sibling
                            </Button>
                          </div>

                          {formData.siblings.length > 0 && (
                            <div>
                              {formData.siblings.map((sibling, index) => (
                                <div key={index} className="mb-2 p-3 border rounded">
                                  <Row className="g-2">
                                    <Col md="5">
                                      <Input
                                        type="text"
                                        placeholder="Name"
                                        value={sibling.name}
                                        onChange={(e) => {
                                          const updated = [...formData.siblings];
                                          updated[index].name = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            siblings: updated,
                                          }));
                                        }}
                                      />
                                    </Col>
                                    <Col md="4">
                                      <Input
                                        type="text"
                                        placeholder="Relation (Brother/Sister)"
                                        value={sibling.relation}
                                        onChange={(e) => {
                                          const updated = [...formData.siblings];
                                          updated[index].relation = e.target.value;
                                          setFormData((prev) => ({
                                            ...prev,
                                            siblings: updated,
                                          }));
                                        }}
                                      />
                                    </Col>
                                    <Col md="2">
                                      <div className="form-check">
                                        <Input
                                          type="checkbox"
                                          id={`siblingShow${index}`}
                                          checked={sibling.showOnPublicProfile}
                                          onChange={(e) => {
                                            const updated = [...formData.siblings];
                                            updated[index].showOnPublicProfile = e.target.checked;
                                            setFormData((prev) => ({
                                              ...prev,
                                              siblings: updated,
                                            }));
                                          }}
                                        />
                                        <Label check for={`siblingShow${index}`} className="small">
                                          Public
                                        </Label>
                                      </div>
                                    </Col>
                                    <Col md="1">
                                      <Button
                                        color="danger"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                          const updated = formData.siblings.filter((_, i) => i !== index);
                                          setFormData((prev) => ({
                                            ...prev,
                                            siblings: updated,
                                          }));
                                        }}
                                      >
                                        ×
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              ))}
                            </div>
                          )}
                        </Col>
                      </Row>
                    </TabPane>

                    {/* TAB 3: PROFESSIONAL - Same as Add Celebrity (Continuing in next message due to length) */}
                    <TabPane tabId="3">
                      <Row>
                        <Col md="6" className="mb-3">
                          <Label>
                            Professions <span className="text-danger">*</span>
                          </Label>
                          <Select
                            isMulti
                            name="professions"
                            options={professionsOptions}
                            styles={customSelectStyles}
                            value={professionsOptions.filter((opt) =>
                              formData.professions.includes(opt.value)
                            )}
                            onChange={(selectedOptions) => {
                              const selected = selectedOptions
                                ? selectedOptions.map((opt) => opt.value)
                                : [];
                              setFormData((prev) => ({
                                ...prev,
                                professions: selected,
                                primaryProfession: selected.includes(prev.primaryProfession)
                                  ? prev.primaryProfession
                                  : selected.length === 1
                                  ? selected[0]
                                  : "",
                              }));
                              setErrors((prev) => ({ ...prev, professions: "" }));
                            }}
                            placeholder="Select professions..."
                            className={errors.professions ? "is-invalid" : ""}
                          />
                          {errors.professions && (
                            <div className="text-danger mt-1">{errors.professions}</div>
                          )}
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>
                            Primary Profession <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="primaryProfession"
                            options={professionsOptions.filter((opt) =>
                              formData.professions.includes(opt.value)
                            )}
                            styles={customSelectStyles}
                            value={professionsOptions.find(
                              (opt) => opt.value === formData.primaryProfession
                            )}
                            onChange={(selected) => {
                              setFormData((prev) => ({
                                ...prev,
                                primaryProfession: selected ? selected.value : "",
                              }));
                              setErrors((prev) => ({ ...prev, primaryProfession: "" }));
                            }}
                            placeholder="Select primary profession..."
                            isClearable
                            className={errors.primaryProfession ? "is-invalid" : ""}
                          />
                          {errors.primaryProfession && (
                            <div className="text-danger mt-1">{errors.primaryProfession}</div>
                          )}
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Languages</Label>
                          <Select
                            isMulti
                            name="languages"
                            options={languagesOptions}
                            styles={customSelectStyles}
                            value={languagesOptions.filter((opt) =>
                              formData.languages.includes(opt.value)
                            )}
                            onChange={(selectedOptions) => {
                              const selected = selectedOptions
                                ? selectedOptions.map((opt) => opt.value)
                                : [];
                              setFormData((prev) => ({
                                ...prev,
                                languages: selected,
                                primaryLanguage: selected.includes(prev.primaryLanguage)
                                  ? prev.primaryLanguage
                                  : selected.length === 1
                                  ? selected[0]
                                  : "",
                              }));
                            }}
                            placeholder="Select languages..."
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Primary Language</Label>
                          <Select
                            name="primaryLanguage"
                            options={languagesOptions.filter((opt) =>
                              formData.languages.includes(opt.value)
                            )}
                            styles={customSelectStyles}
                            value={languagesOptions.find((opt) => opt.value === formData.primaryLanguage)}
                            onChange={(selected) => {
                              setFormData((prev) => ({
                                ...prev,
                                primaryLanguage: selected ? selected.value : "",
                              }));
                            }}
                            placeholder="Select primary language..."
                            isClearable
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Career Start Year</Label>
                          <Input
                            type="number"
                            name="careerStartYear"
                            value={formData.careerStartYear}
                            onChange={handleInput}
                            placeholder="YYYY"
                            min="1900"
                            max={new Date().getFullYear()}
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Career End Year</Label>
                          <div className="d-flex gap-2 align-items-center">
                            <Input
                              type="number"
                              name="careerEndYear"
                              value={formData.careerEndYear}
                              onChange={handleInput}
                              placeholder="YYYY"
                              min="1900"
                              max={new Date().getFullYear() + 10}
                              disabled={formData.isCareerOngoing}
                              className={errors.careerEndYear ? "is-invalid" : ""}
                            />
                            <div className="form-check">
                              <Input
                                type="checkbox"
                                id="isCareerOngoing"
                                name="isCareerOngoing"
                                checked={formData.isCareerOngoing}
                                onChange={handleInput}
                              />
                              <Label check for="isCareerOngoing" className="small">
                                Ongoing
                              </Label>
                            </div>
                          </div>
                          {errors.careerEndYear && (
                            <div className="text-danger mt-1">{errors.careerEndYear}</div>
                          )}
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Current City / Base Location</Label>
                          <Input
                            name="currentCity"
                            value={formData.currentCity}
                            onChange={handleInput}
                            placeholder="e.g. Mumbai, India"
                            type="text"
                          />
                        </Col>

                        <Col md="6" className="mb-3">
  <Label>Known For Region</Label>
  <Select
    isMulti
    name="knownForRegion"
    options={knownForRegionOptions}
    styles={customSelectStyles}
    value={knownForRegionOptions.filter((opt) =>
      formData.knownForRegion.includes(opt.value)
    )}
    onChange={(selected) => {
      setFormData((prev) => ({
        ...prev,
        knownForRegion: selected ? selected.map((opt) => opt.value) : [],
      }));
    }}
    placeholder="Select regions..."
  />
</Col>


                        <Col md="6" className="mb-3">
                          <Label>Height</Label>
                          <Input
                            name="height"
                            value={formData.height}
                            onChange={handleInput}
                            type="text"
                          />
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Signature Style / Known For</Label>
                          <Input
                            name="signatureStyle"
                            value={formData.signatureStyle}
                            onChange={handleInput}
                            placeholder="e.g. Romantic roles, open-arm pose"
                            type="text"
                          />
                        </Col>
                      </Row>
                    </TabPane>

                    {/* TAB 4: SOCIAL & SEO - Same as Add Celebrity */}
                    <TabPane tabId="4">
                      <Row>
                        <Col md="12" className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Label>Social Links</Label>
                            <Button
                              color="primary"
                              size="sm"
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  socialLinks: [...prev.socialLinks, { platform: "", url: "", label: "" }],
                                }))
                              }
                            >
                              + Add Link
                            </Button>
                          </div>

                          {formData.socialLinks.length > 0 ? (
                            <div>
                              {formData.socialLinks.map((item, index) => {
                                const platformOption = socialLinksOptions.find(
                                  (opt) => opt.value === item.platform
                                );

                                const availableOptions = socialLinksOptions.filter((option) => {
                                  const isAlreadySelected = formData.socialLinks.some(
                                    (link, idx) => idx !== index && link.platform === option.value
                                  );
                                  return !isAlreadySelected;
                                });

                                return (
                                  <div key={index} className="mb-3 p-3 border rounded">
                                    <Row className="g-2 align-items-start">
                                      <Col md="4">
                                        <Label className="small">Platform</Label>
                                        <Select
                                          options={availableOptions}
                                          styles={customSelectStyles}
                                          value={platformOption}
                                          onChange={(selected) => {
                                            const updated = [...formData.socialLinks];
                                            updated[index].platform = selected ? selected.value : "";
                                            setFormData((prev) => ({
                                              ...prev,
                                              socialLinks: updated,
                                            }));
                                          }}
                                          placeholder="Select Platform"
                                          isClearable
                                        />
                                      </Col>

                                      <Col md="5">
                                        <Label className="small">URL</Label>
                                        <Input
                                          type="text"
                                          placeholder="https://example.com/profile"
                                          value={item.url || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.socialLinks];
                                            updated[index].url = e.target.value;

                                            const urlValid = isValidSocialUrl(e.target.value);
                                            const newErrors = [...(errors.socialLinks || [])];
                                            newErrors[index] = !e.target.value
                                              ? ""
                                              : urlValid
                                              ? ""
                                              : "Please enter a valid URL";

                                            setErrors((prev) => ({
                                              ...prev,
                                              socialLinks: newErrors,
                                            }));
                                            setFormData((prev) => ({
                                              ...prev,
                                              socialLinks: updated,
                                            }));
                                          }}
                                          className={errors.socialLinks?.[index] ? "is-invalid" : ""}
                                        />
                                        {errors.socialLinks?.[index] && (
                                          <div className="invalid-feedback d-block">
                                            {errors.socialLinks[index]}
                                          </div>
                                        )}
                                      </Col>

                                      <Col md="2">
                                        <Label className="small">Label (Optional)</Label>
                                        <Input
                                          type="text"
                                          placeholder="e.g. Fan Club"
                                          value={item.label || ""}
                                          onChange={(e) => {
                                            const updated = [...formData.socialLinks];
                                            updated[index].label = e.target.value;
                                            setFormData((prev) => ({
                                              ...prev,
                                              socialLinks: updated,
                                            }));
                                          }}
                                        />
                                      </Col>

                                      <Col md="1" className="d-flex align-items-end">
                                        <Button
                                          color="danger"
                                          size="sm"
                                          type="button"
                                          onClick={() => {
                                            const updated = formData.socialLinks.filter((_, i) => i !== index);
                                            const updatedErrors = (errors.socialLinks || []).filter(
                                              (_, i) => i !== index
                                            );
                                            setFormData((prev) => ({
                                              ...prev,
                                              socialLinks: updated,
                                            }));
                                            setErrors((prev) => ({
                                              ...prev,
                                              socialLinks: updatedErrors,
                                            }));
                                          }}
                                          style={{ marginTop: "24px" }}
                                        >
                                          ×
                                        </Button>
                                      </Col>
                                    </Row>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center text-muted p-3 border rounded">
                              No social links added yet
                            </div>
                          )}
                        </Col>

                        {

                          isAdmin && (
                           <>

                            <Col md="12">
                          <hr className="my-4" />
                          <h5 className="mb-3">SEO Metadata</h5>
                        </Col>

                        
                        <Col md="12" className="mb-3">
                          <Label>Tags</Label>
                          <Input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Type a tag and press Enter..."
                          />
                          <small className="text-muted">Press Enter to add tag</small>

                          {formData.tags.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-2">
                              {formData.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="badge bg-primary d-flex align-items-center"
                                  style={{ fontSize: "14px", padding: "6px 10px" }}
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    style={{
                                      marginLeft: "8px",
                                      background: "transparent",
                                      border: "none",
                                      color: "white",
                                      cursor: "pointer",
                                      fontSize: "16px",
                                    }}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </Col>

                        <Col md="12" className="mb-3">
                          <Label>SEO Meta Title</Label>
                          <Input
                            name="seoMetaTitle"
                            value={formData.seoMetaTitle}
                            onChange={handleInput}
                            placeholder="Max 60 characters"
                            type="text"
                            maxLength="60"
                          />
                          <small className="text-muted">
                            {formData.seoMetaTitle.length}/60 characters
                          </small>
                        </Col>

                        <Col md="12" className="mb-3">
                          <Label>SEO Meta Description</Label>
                          <Input
                            type="textarea"
                            name="seoMetaDescription"
                            value={formData.seoMetaDescription}
                            onChange={handleInput}
                            placeholder="Max 160 characters"
                            rows="3"
                            maxLength="160"
                          />
                          <small className="text-muted">
                            {formData.seoMetaDescription.length}/160 characters
                          </small>
                        </Col>

                       
                        <Col md="12" className="mb-3">
                          <Label>SEO Keywords</Label>
                          <Input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={handleKeywordKeyDown}
                            placeholder="Type a keyword and press Enter..."
                          />
                          <small className="text-muted">Press Enter to add keyword</small>

                          {formData.seoKeywords.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-2">
                              {formData.seoKeywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="badge bg-secondary d-flex align-items-center"
                                  style={{ fontSize: "14px", padding: "6px 10px" }}
                                >
                                  {keyword}
                                  <button
                                    type="button"
                                    onClick={() => removeKeyword(index)}
                                    style={{
                                      marginLeft: "8px",
                                      background: "transparent",
                                      border: "none",
                                      color: "white",
                                      cursor: "pointer",
                                      fontSize: "16px",
                                    }}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </Col>

                        <Col md="12">
                          <hr className="my-4" />
                          <h5 className="mb-3">Admin Controls</h5>
                        </Col>

                        <Col md="6" className="mb-3">
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="isFeatured"
                              name="isFeatured"
                              checked={formData.isFeatured}
                              onChange={handleInput}
                            />
                            <Label check for="isFeatured">
                              Featured / Priority
                            </Label>
                          </div>
                        </Col>

                        <Col md="6" className="mb-3">
                          <Label>Verification Status</Label>
                          <Input
                            type="select"
                            name="verificationStatus"
                            onChange={handleInput}
                            value={formData.verificationStatus}
                          >
                            <option value="Not Claimed">Not Claimed</option>
                            <option value="Claim Requested">Claim Requested</option>
                            <option value="Verified">Verified</option>
                          </Input>
                        </Col>

                        <Col md="12" className="mb-3">
                          <Label>Internal Notes (Admin Only)</Label>
                          <Input
                            type="textarea"
                            name="internalNotes"
                            value={formData.internalNotes}
                            onChange={handleInput}
                            placeholder="Private notes for admin reference..."
                            rows="3"
                          />
                        </Col>
                           
                           
                           
                           </>
                          )
                        }
                      </Row>
                    </TabPane>
                  </TabContent>

                  <div className="d-flex gap-2 mt-4">
                    <Button type="submit" color="primary">
                      <i className="bx bx-save me-1"></i>
                      Update Celebrity
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate("/dashboard/celebrity-list")}
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

export default UpdateCelebrityForm;