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
import { Plus, Search, Pencil, Trash, ExternalLink } from "lucide-react";
import {
  getAllReferences,
  createReference,
  getReferenceById,
  updateReference,
  updateReferenceStatus,
  deleteReference,
} from "../../api/referencesApi";
import { createReferenceSchema, updateReferenceSchema } from "../../schemas/reference.schema";
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
              Add Reference
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
                  No references found
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
// MAIN REFERENCES LIST COMPONENT
// ========================================
const ReferencesList = () => {
  const { id: celebrityId } = useParams();
  const navigate = useNavigate();

  // ========== STATE ==========
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "",
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
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllReferences(celebrityId);
      const dataArray = Array.isArray(result?.data) ? result.data : [];
      setReferences(dataArray);
    } catch (error) {
      console.error("Error fetching references:", error);
      toast.error("Failed to load references");
      setReferences([]);
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
    const schema = editId ? updateReferenceSchema : createReferenceSchema;
    const dataToValidate = editId ? formData : { ...formData, celebrityId };
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
        const response = await updateReference(editId, payload);
        if (response?.success === false) {
          toast.error(response?.msg || "Failed to update reference");
          return;
        }
        toast.success("Reference updated successfully");
      } else {
        const response = await createReference(payload);
        if (response?.success === false) {
          toast.error(response?.msg || "Failed to create reference");
          return;
        }
        toast.success("Reference created successfully");
      }

      setIsAddEditModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      type: "",
    });
    setErrors({});
    setEditId(null);
  };

  // ✅ Handle Add
  const handleAdd = () => {
    resetForm();
    setIsAddEditModalOpen(true);
  };

  // ✅ Handle Edit
  const handleEdit = async (id) => {
    if (!id) {
      toast.error("Invalid reference ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await getReferenceById(id);
      const referenceData = 
        response?.data?.reference || 
        response?.data || 
        response?.msg || 
        response;

      if (referenceData && typeof referenceData === "object") {
        setFormData({
          title: referenceData?.title || "",
          url: referenceData?.url || "",
          type: referenceData?.type || "",
        });
        setEditId(id);
        setIsAddEditModalOpen(true);
      } else {
        toast.error("Failed to load reference");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load reference");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Update Status - OPTIMISTIC UI
  const handleStatusChange = async (currentStatus, id) => {
    if (!id) return;

    const newStatus = currentStatus == 1 ? 0 : 1;

    // Optimistic update
    setReferences((prev) =>
      prev.map((ref) => (ref?._id === id ? { ...ref, status: newStatus } : ref))
    );

    try {
      const res_data = await updateReferenceStatus(id, newStatus);
      if (res_data?.success === false) {
        // Revert on failure
        setReferences((prev) =>
          prev.map((ref) =>
            ref?._id === id ? { ...ref, status: currentStatus } : ref
          )
        );
        toast.error(res_data?.msg || "Failed to update status");
      } else {
        toast.success("Status updated successfully");
      }
    } catch (error) {
      // Revert on error
      setReferences((prev) =>
        prev.map((ref) =>
          ref?._id === id ? { ...ref, status: currentStatus } : ref
        )
      );
      console.error("Error:", error);
      toast.error("Failed to update status");
    }
  };

  // ✅ Delete Reference
  const handleDeleteClick = (id) => {
    if (!id) {
      toast.error("Invalid reference ID");
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
      const data = await deleteReference(deleteId);
      if (data?.success === false) {
        toast.error(data?.msg || "Failed to delete reference");
        return;
      }
      toast.success("Reference deleted successfully");
      setReferences((prev) => prev.filter((row) => row?._id !== deleteId));
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
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
      Header: "Title",
      accessor: "title",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>{value || "N/A"}</strong>
      ),
    },
   {
  Header: "URL",
  accessor: "url",
  Cell: ({ value }) =>
    value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#4285F4",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {value.length > 40 ? value.substring(0, 40) + "..." : value}
        <ExternalLink size={14} />
      </a>
    ) : (
      "N/A"
    ),
},

    {
      Header: "Type",
      accessor: "type",
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
          {value || "Other"}
        </span>
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
    { title: "References", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <FixedSectionTab activeTabId="references" />
        <Container fluid>
          {/* <Breadcrumbs title="References" breadcrumbItems={breadcrumbItems} /> */}

          <Card
            style={{
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <CardBody>
              <div className="mb-4">
                <h4 className="mb-0" style={{ fontSize: "20px", fontWeight: "600" }}>
                  References List
                </h4>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading references...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={references}
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
              {!editId ? "Add" : "Edit"} Reference
            </span>
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody style={{ padding: "24px" }}>
              <FormGroup>
                <Label for="title" style={{ fontWeight: "500", fontSize: "14px" }}>
                  Title <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData?.title}
                  onChange={handleInputChange}
                  placeholder="Enter reference title"
                  invalid={!!errors?.title}
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    padding: "10px 12px",
                  }}
                />
                {errors?.title && (
                  <span className="text-danger small d-block mt-1">
                    {errors.title}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="url" style={{ fontWeight: "500", fontSize: "14px" }}>
                  URL <span className="text-danger">*</span>
                </Label>
                <Input
                  type="url"
                  id="url"
                  name="url"
                  value={formData?.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  invalid={!!errors?.url}
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    padding: "10px 12px",
                  }}
                />
                {errors?.url && (
                  <span className="text-danger small d-block mt-1">
                    {errors.url}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="type" style={{ fontWeight: "500", fontSize: "14px" }}>
                  Type
                </Label>
                <Input
                  type="select"
                  id="type"
                  name="type"
                  value={formData?.type}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    padding: "10px 12px",
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="News">News</option>
                  <option value="Wiki">Wiki</option>
                  <option value="Interview">Interview</option>
                  <option value="Gov Link">Gov Link</option>
                  <option value="Other">Other</option>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0" }}>
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
                    {!editId ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  !editId ? "Add Reference" : "Update Reference"
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
          title="Delete Reference"
          message="Are you sure you want to delete this reference? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default ReferencesList;