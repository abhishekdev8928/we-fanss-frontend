import React, { Fragment, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Container,
  Table,
  Row,
  Col,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
} from "reactstrap";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
  getAllRelatedPersonalities,
  createRelatedPersonality,
  getRelatedPersonalityById,
  updateRelatedPersonality,
  updateRelatedPersonalityStatus,
  deleteRelatedPersonality,
} from "../../api/relatedPersonalityApi";
import { getCelebrityOptions } from "../../api/optionsApi";
import {
  createRelatedPersonalitySchema,
  updateRelatedPersonalitySchema,
} from "../../schemas/relatedPersonality.schema";
import { validateForm } from "../../utils/validateForm";
import FixedSectionTab from "../Section/FixedSectionTab";
import DeleteConfirmModal from "../../components/Modals/DeleteModal";

// ========================================
// GLOBAL FILTER COMPONENT
// ========================================
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows?.length || 0;
  const [value, setValue] = useState(globalFilter);

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Col md={4}>
      <div style={{ position: "relative" }}>
        <Input
          type="text"
          className="form-control"
          placeholder="Search record..."
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          style={{
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "10px 40px 10px 16px",
          }}
        />
        <Search
          size={18}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#999",
            pointerEvents: "none",
          }}
        />
      </div>
    </Col>
  );
}

function Filter() {
  return null;
}

// ========================================
// TABLE CONTAINER COMPONENT
// ========================================
const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  onAddClick,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  return (
    <Fragment>
      {/* HEADER ROW - Page Size, Search, Add Button */}
      <Row className="mb-3">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              padding: "10px 16px",
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </Col>

        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}

        <Col md={6}>
          <div className="d-flex justify-content-end">
            <Button
              onClick={onAddClick}
              className="theme-btn bg-theme"
              style={{
                color: "white",
                borderRadius: "8px",
                padding: "10px 16px",
                border: "none",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
              }}
            >
              <Plus size={20} />
              Add Related Personality
            </Button>
          </div>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="table-responsive react-table">
        <Table
          {...getTableProps()}
          className={className}
          style={{ borderCollapse: "separate", borderSpacing: "0" }}
        >
          <thead style={{ backgroundColor: "#F5F5F5" }}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#666",
                      borderBottom: "none",
                    }}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="bx bx-chevron-down ms-1"></i>
                        ) : (
                          <i className="bx bx-chevron-up ms-1"></i>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        style={{
                          padding: "16px",
                          fontSize: "14px",
                          color: "#333",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <i className="bx bx-info-circle me-2"></i>
                  No related personalities found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}
      {page.length > 0 && (
        <Row className="justify-content-end align-items-center mt-4">
          <Col className="col-auto">
            <div className="d-flex gap-2 align-items-center">
              <Button
                color="light"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {"<<"}
              </Button>
              <Button
                color="light"
                onClick={previousPage}
                disabled={!canPreviousPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {"<"}
              </Button>

              <select
                className="form-select"
                value={pageIndex}
                onChange={(e) => gotoPage(Number(e.target.value))}
                style={{
                  width: "140px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {pageOptions.map((pageNum) => (
                  <option key={pageNum} value={pageNum}>
                    Page {pageNum + 1} of {pageOptions.length}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={1}
                max={pageOptions.length}
                style={{
                  width: "70px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />

              <Button
                color="light"
                onClick={nextPage}
                disabled={!canNextPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {">"}
              </Button>
              <Button
                color="light"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {">>"}
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  customPageSize: PropTypes.number,
  className: PropTypes.string,
  isGlobalFilter: PropTypes.bool,
  onAddClick: PropTypes.func,
};

// ========================================
// MAIN RELATED PERSONALITIES LIST COMPONENT
// ========================================
const RelatedPersonalitiesList = () => {
  const { id: celebrityId } = useParams();
  const navigate = useNavigate();

  // ========== STATE ==========
  const [relatedPersonalities, setRelatedPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [celebrityOptions, setCelebrityOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    relatedCelebrity: "",
    relationshipType: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // ========== HELPER FUNCTIONS ==========
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  // ========== API CALLS ==========
  const fetchCelebrityOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const result = await getCelebrityOptions([celebrityId]);
      setCelebrityOptions(result?.data || []);
    } catch (error) {
      console.error("Error fetching celebrity options:", error);
      toast.error("Failed to load celebrity options");
      setCelebrityOptions([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [celebrityId]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllRelatedPersonalities(celebrityId);
      const dataArray = Array.isArray(result?.data) ? result.data : [];
      setRelatedPersonalities(dataArray);
    } catch (error) {
      console.error("Error fetching related personalities:", error);
      toast.error("Failed to load related personalities");
      setRelatedPersonalities([]);
    } finally {
      setLoading(false);
    }
  }, [celebrityId]);

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ✅ Validate Form
  const validateFormData = () => {
    const schema = editId
      ? updateRelatedPersonalitySchema
      : createRelatedPersonalitySchema;

    const dataToValidate = editId
      ? formData
      : { ...formData, celebrity: celebrityId };

    const validation = validateForm(schema, dataToValidate);

    if (!validation?.success) {
      setErrors(validation?.errors || {});
      return false;
    }

    setErrors({});
    return true;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateFormData()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        celebrity: celebrityId,
      };

      if (editId) {
        const response = await updateRelatedPersonality(editId, payload);
        if (response?.success === false) {
          toast.error(response?.message || "Failed to update related personality");
          return;
        }
        toast.success("Related personality updated successfully");
      } else {
        const response = await createRelatedPersonality(payload);
        if (response?.success === false) {
          toast.error(response?.message || "Failed to create related personality");
          return;
        }
        toast.success("Related personality created successfully");
      }

      setIsAddEditModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({
      relatedCelebrity: "",
      relationshipType: "",
      notes: "",
    });
    setErrors({});
    setEditId(null);
  };

  // ✅ Handle Add
  const handleAdd = () => {
    resetForm();
    fetchCelebrityOptions();
    setIsAddEditModalOpen(true);
  };

  // ✅ Handle Edit
  const handleEdit = async (id) => {
    if (!id) {
      toast.error("Invalid related personality ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await getRelatedPersonalityById(id);
      const personalityData =
        response?.data || response?.message || response;

      if (personalityData && typeof personalityData === "object") {
        setFormData({
          relatedCelebrity: personalityData?.relatedCelebrity?._id || "",
          relationshipType: personalityData?.relationshipType || "",
          notes: personalityData?.notes || "",
        });
        setEditId(id);
        fetchCelebrityOptions();
        setIsAddEditModalOpen(true);
      } else {
        toast.error("Failed to load related personality");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load related personality");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Update Status - OPTIMISTIC UI
  const handleStatusChange = async (currentStatus, id) => {
    if (!id) return;

    const newStatus = currentStatus == 1 ? 0 : 1;

    // Optimistic update
    setRelatedPersonalities((prev) =>
      prev.map((item) =>
        item?._id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const res_data = await updateRelatedPersonalityStatus(id, newStatus);
      if (res_data?.success === false) {
        // Revert on failure
        setRelatedPersonalities((prev) =>
          prev.map((item) =>
            item?._id === id ? { ...item, status: currentStatus } : item
          )
        );
        toast.error(res_data?.message || "Failed to update status");
      } else {
        toast.success("Status updated successfully");
      }
    } catch (error) {
      // Revert on error
      setRelatedPersonalities((prev) =>
        prev.map((item) =>
          item?._id === id ? { ...item, status: currentStatus } : item
        )
      );
      console.error("Error:", error);
      toast.error("Failed to update status");
    }
  };

  // ✅ Delete Related Personality
  const handleDeleteClick = (id) => {
    if (!id) {
      toast.error("Invalid related personality ID");
      return;
    }
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete");
      return;
    }

    try {
      const data = await deleteRelatedPersonality(deleteId);
      if (data?.success === false) {
        toast.error(data?.message || "Failed to delete related personality");
        return;
      }
      toast.success("Related personality deleted successfully");
      setRelatedPersonalities((prev) =>
        prev.filter((row) => row?._id !== deleteId)
      );
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ✅ Close modal handler
  const handleModalClose = () => {
    setIsAddEditModalOpen(false);
    resetForm();
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    if (celebrityId) {
      fetchData();
    }
  }, [celebrityId, fetchData]);

  // ========== TABLE COLUMNS ==========
  const columns = [
    {
      Header: "No",
      accessor: (_row, i) => i + 1,
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Celebrity",
      accessor: "celebrity",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>
          {value?.identityProfile?.name || "N/A"}
        </strong>
      ),
    },
    {
      Header: "Related Celebrity",
      accessor: "relatedCelebrity",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>
          {value?.identityProfile?.name || "N/A"}
        </strong>
      ),
    },
    {
      Header: "Relationship Type",
      accessor: "relationshipType",
      Cell: ({ value }) => (
        <span
          style={{
            backgroundColor: "#F5F5F5",
            color: "#666",
            padding: "4px 12px",
            borderRadius: "100px",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          {value || "N/A"}
        </span>
      ),
    },
    {
      Header: "Notes",
      accessor: "notes",
      Cell: ({ value }) =>
        value ? (
          value.length > 50 ? (
            <span title={value}>{value.substring(0, 50) + "..."}</span>
          ) : (
            value
          )
        ) : (
          "—"
        ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => {
        const isActive = row?.original?.status == 1;

        return (
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id={`switch-${row?.original?._id}`}
              checked={isActive}
              onChange={() =>
                handleStatusChange(row?.original?.status, row?.original?._id)
              }
              style={{
                width: "48px",
                height: "24px",
                cursor: "pointer",
                backgroundColor: isActive ? "#4285F4" : "#ccc",
                borderColor: isActive ? "#1E90FF" : "#ccc",
              }}
            />
          </div>
        );
      },
    },
    {
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            onClick={() => handleEdit(row?.original?._id)}
            disabled={isSubmitting}
            style={{
              backgroundColor: "#4285F41F",
              color: "#1E90FF",
              border: "none",
              borderRadius: "4px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pencil size={20} strokeWidth="2" />
          </Button>

          <Button
            onClick={() => handleDeleteClick(row?.original?._id)}
            disabled={isSubmitting}
            style={{
              backgroundColor: "#FFE5E5",
              color: "#FF5555",
              border: "none",
              borderRadius: "6px",
              padding: "8px 12px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trash size={20} color="#BA2526" />
          </Button>
        </div>
      ),
    },
  ];

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Celebrity List", link: "/dashboard/celebrity-list" },
    { title: "Related Personalities", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <FixedSectionTab activeTabId="related" />
        <Container fluid>
          {/* <Breadcrumbs
            title="Related Personalities"
            breadcrumbItems={breadcrumbItems}
          /> */}

          <Card
            style={{
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <CardBody>
              <div className="mb-4">
                <h4
                  className="mb-0"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  Related Personalities List
                </h4>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading related personalities...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={relatedPersonalities}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={handleAdd}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== ADD/EDIT MODAL ========== */}
        <Modal
          isOpen={isAddEditModalOpen}
          toggle={handleModalClose}
          size="md"
          backdrop="static"
          style={{ marginTop: "80px" }}
        >
          <ModalHeader toggle={handleModalClose}>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              {!editId ? "Add" : "Edit"} Related Personality
            </span>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody style={{ padding: "24px" }}>
              <FormGroup>
                <Label
                  for="relatedCelebrity"
                  style={{ fontWeight: "500", fontSize: "14px" }}
                >
                  Related Celebrity <span className="text-danger">*</span>
                </Label>
                {isLoadingOptions ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading celebrities...</span>
                  </div>
                ) : (
                  <Input
                    type="select"
                    id="relatedCelebrity"
                    name="relatedCelebrity"
                    value={formData?.relatedCelebrity}
                    onChange={handleInputChange}
                    invalid={!!errors?.relatedCelebrity}
                    disabled={isSubmitting}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      padding: "10px 12px",
                    }}
                  >
                    <option value="">Select Related Celebrity</option>
                    {celebrityOptions.map((celebrity) => (
                      <option key={celebrity?.id} value={celebrity?.id}>
                        {celebrity?.label}
                      </option>
                    ))}
                  </Input>
                )}
                {errors?.relatedCelebrity && (
                  <span className="text-danger small d-block mt-1">
                    {errors.relatedCelebrity}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label
                  for="relationshipType"
                  style={{ fontWeight: "500", fontSize: "14px" }}
                >
                  Relationship Type <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="relationshipType"
                  name="relationshipType"
                  value={formData?.relationshipType}
                  onChange={handleInputChange}
                  invalid={!!errors?.relationshipType}
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    padding: "10px 12px",
                  }}
                >
                  <option value="">Select Relationship Type</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Co-star">Co-star</option>
                  <option value="Rival">Rival</option>
                  <option value="Family">Family</option>
                  <option value="Politically">Politically</option>
                  <option value="Other">Other</option>
                </Input>
                {errors?.relationshipType && (
                  <span className="text-danger small d-block mt-1">
                    {errors.relationshipType}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label
                  for="notes"
                  style={{ fontWeight: "500", fontSize: "14px" }}
                >
                  Notes
                </Label>
                <Input
                  type="textarea"
                  id="notes"
                  name="notes"
                  value={formData?.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes (optional)"
                  rows="3"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    padding: "10px 12px",
                  }}
                />
                {errors?.notes && (
                  <span className="text-danger small d-block mt-1">
                    {errors.notes}
                  </span>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter
              style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0" }}
            >
              <Button
                color="secondary"
                onClick={handleModalClose}
                disabled={isSubmitting}
                style={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoadingOptions}
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
                    {!editId ? "Adding..." : "Updating..."}
                  </>
                ) : !editId ? (
                  "Add Related Personality"
                ) : (
                  "Update Related Personality"
                )}
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* ========== DELETE CONFIRMATION MODAL ========== */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Related Personality"
          message="Are you sure you want to delete this related personality? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default RelatedPersonalitiesList;