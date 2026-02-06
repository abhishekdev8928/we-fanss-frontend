import React, { Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Table,
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
  fetchSocialLink,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getSocialLinkById,
  updateSocialLinkStatus,
} from "../../api/SocialLinkApi";
import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
import { usePrivilegeStore } from "../../config/store/privilegeStore";
import DeleteConfirmModal from "../../components/Modals/DeleteModal";

// ========================================
// GLOBAL FILTER COMPONENT
// ========================================
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
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
          <PrivilegeAccess
            resource={RESOURCES.SOCIAL_LINK}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <button
                onClick={onAddClick}
                className="theme-btn bg-theme"
               
              >
                <Plus size={20} />
                Add Social Link
              </button>
            </div>
          </PrivilegeAccess>
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
                  No social links found
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
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canPreviousPage ? "pointer" : "not-allowed",
                  opacity: canPreviousPage ? 1 : 0.5,
                }}
              >
                {"<<"}
              </button>
              <button
                onClick={previousPage}
                disabled={!canPreviousPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canPreviousPage ? "pointer" : "not-allowed",
                  opacity: canPreviousPage ? 1 : 0.5,
                }}
              >
                {"<"}
              </button>

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

              <button
                onClick={nextPage}
                disabled={!canNextPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canNextPage ? "pointer" : "not-allowed",
                  opacity: canNextPage ? 1 : 0.5,
                }}
              >
                {">"}
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  backgroundColor: "white",
                  cursor: canNextPage ? "pointer" : "not-allowed",
                  opacity: canNextPage ? 1 : 0.5,
                }}
              >
                {">>"}
              </button>
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
// MAIN SOCIAL LINK MASTER LIST COMPONENT
// ========================================
const SocialLinkMasterList = () => {
  // ========== STATE ==========
  const [socialLink, setSocialLink] = useState({ name: "" });
  const [socialLinkList, setSocialLinkList] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const { hasPermission } = usePrivilegeStore();

  // ========== HELPER FUNCTIONS ==========
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ========== API CALLS ==========
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchSocialLink();
      const data = result?.data || result?.msg || result;

      if (Array.isArray(data)) {
        setSocialLinkList(data);
      } else {
        setSocialLinkList([]);
      }
    } catch (error) {
      console.error("Error fetching social links:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load social links.";
      toast.error(errorMessage);
      setSocialLinkList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const result = await updateSocialLinkStatus(id, newStatus);
      const success = result?.success || result?.status;
      const message = result?.message || result?.msg;

      if (!success) {
        toast.error(message || "Failed to update status");
        return;
      }

      toast.success(message || "Status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update status";
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (id) => {
    try {
      const result = await getSocialLinkById(id);
      const socialLinkData = result?.data;

      if (socialLinkData) {
        setSocialLink({ name: socialLinkData?.name || "" });
        setEditId(socialLinkData?._id);
        setIsAddEditModalOpen(true);
      } else {
        toast.error("Failed to load social link data");
      }
    } catch (error) {
      console.error("Error fetching social link by ID:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load social link data";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const result = await deleteSocialLink(deleteId);
      const success = result?.success || result?.status;
      const message = result?.message || result?.msg;

      if (success) {
        toast.success(message || "Social link deleted successfully");
        setDeleteModalOpen(false);
        setDeleteId(null);
        fetchData();
      } else {
        toast.error(message || "Failed to delete social link");
      }
    } catch (error) {
      console.error("Error deleting social link:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete social link";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!socialLink?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { name: socialLink?.name?.trim() };
      let response;

      if (editId) {
        response = await updateSocialLink(editId, payload);
      } else {
        response = await addSocialLink(payload);
      }

      const success = response?.success || response?.status;
      const message = response?.message || response?.msg;

      if (!success) {
        const errorMsg = message || response?.error?.message || "Operation failed";

        if (errorMsg?.toLowerCase()?.includes("already exist")) {
          setErrors({ name: errorMsg });
        }

        toast.error(errorMsg);
        return;
      }

      toast.success(
        message ||
          (editId
            ? "Social link updated successfully"
            : "Social link added successfully")
      );
      handleAddEditModalClose();
      fetchData();
    } catch (error) {
      console.error("Add/Update Social Link Error:", error);

      // Handle backend validation errors
      if (error?.response?.data?.error?.details) {
        const backendErrors = {};
        error?.response?.data?.error?.details?.forEach((detail) => {
          backendErrors[detail?.field] = detail?.message;
        });
        setErrors(backendErrors);
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong.";
      toast.error(errorMessage);
    }
  };

  // ========== MODAL HANDLERS ==========
  const handleAddEditModalClose = () => {
    setIsAddEditModalOpen(false);
    setEditId(null);
    setSocialLink({ name: "" });
    setErrors({});
  };

  const handleModalOpen = () => {
    setSocialLink({ name: "" });
    setErrors({});
    setEditId(null);
    setIsAddEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setSocialLink({ ...socialLink, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== PERMISSIONS ==========
  const canEdit = hasPermission(RESOURCES.SOCIAL_LINK, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.SOCIAL_LINK, OPERATIONS.DELETE);
  const hasAnyAction = canEdit || canDelete;

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
      Header: "Social Link Name",
      accessor: "name",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>{value}</strong>
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
                handleStatusChange(
                  row?.original?.status,
                  row?.original?._id
                )
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
  ];

  // ========== OPTIONS COLUMN ==========
  if (hasAnyAction) {
    columns.push({
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => {
        const socialLinkItem = row?.original;

        return (
          <div className="d-flex gap-2">
            {/* Edit Button */}
            <PrivilegeAccess
              resource={RESOURCES.SOCIAL_LINK}
              action={OPERATIONS.EDIT}
            >
              <button
                onClick={() => handleEdit(socialLinkItem?._id)}
                className="theme-edit-btn"
                style={{
                  backgroundColor: "#4285F41F",
                  color: "#1E90FF",
                  border: "none",
                  borderRadius: "6px",
                  width: "40px",
                  height: "40px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Pencil size={20} strokeWidth="2" />
              </button>
            </PrivilegeAccess>

            {/* Delete Button */}
            <PrivilegeAccess
              resource={RESOURCES.SOCIAL_LINK}
              action={OPERATIONS.DELETE}
            >
              <button
                onClick={() => handleDeleteClick(socialLinkItem?._id)}
                className="theme-delete-btn"
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
                  cursor: "pointer",
                }}
              >
                <Trash size={20} color="#BA2526" />
              </button>
            </PrivilegeAccess>
          </div>
        );
      },
    });
  }

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Social Link Master", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Social Link Master List"
            breadcrumbItems={breadcrumbItems}
          />

          <Card
            style={{
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading social links...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={socialLinkList}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={handleModalOpen}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== ADD / EDIT MODAL ========== */}
        <Modal isOpen={isAddEditModalOpen} toggle={handleAddEditModalClose}>
          <ModalHeader toggle={handleAddEditModalClose}>
            {!editId ? "Add" : "Edit"} Social Link
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <div className="mb-3">
                <label className="form-label">
                  Social Link Name <span className="text-danger">*</span>
                </label>
                <Input
                  type="text"
                  value={socialLink?.name || ""}
                  onChange={handleInputChange}
                  name="name"
                  placeholder="Enter social link name"
                  className={errors?.name ? "is-invalid" : ""}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 16px",
                  }}
                />
                {errors?.name && (
                  <div className="invalid-feedback d-block">
                    {errors?.name}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <button
                type="submit"
                className="theme-btn bg-theme"
                style={{
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {!editId ? "Add Social Link" : "Update Social Link"}
              </button>
              <button
                type="button"
                onClick={handleAddEditModalClose}
                style={{
                  borderRadius: "8px",
                  padding: "8px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </ModalFooter>
          </form>
        </Modal>

        {/* ========== DELETE CONFIRMATION MODAL ========== */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Social Link"
          message="Are you sure you want to delete this social link? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default SocialLinkMasterList;