import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
import React, { Fragment, useState, useEffect } from "react";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
  fetchLanguage,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  getLanguageById,
  updateLanguageStatus,
} from "../../api/LanguageApi";
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
          <PrivilegeAccess resource={RESOURCES.LANGUAGE} action={OPERATIONS.ADD}>
            <div className="d-flex justify-content-end">
              <button
                onClick={onAddClick}
                className="theme-btn bg-theme"
                
              >
                <Plus size={20} />
                Add Language
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
                  No languages found
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

// ========================================
// MAIN LANGUAGE MASTER LIST COMPONENT
// ========================================
const LanguageMasterList = () => {
  // ========== STATE ==========
  const [language, setLanguage] = useState({ name: "", code: "" });
  const [categorylist, setcategorylist] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [itemIdToEdit, setItemIdToEdit] = useState(null);
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
      const response = await fetchLanguage();

      if (response?.success) {
        setcategorylist(response?.data || []);
      } else {
        setcategorylist([]);
        toast.error(response?.message || "Failed to load languages");
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      setcategorylist([]);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load languages";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const response = await updateLanguageStatus(id, newStatus);

      if (response?.success) {
        toast.success(response?.message || "Status updated successfully");
        await fetchData();
      } else {
        toast.error(response?.message || "Failed to update status");
      }
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
      const response = await getLanguageById(id);

      if (response?.success && response?.data) {
        setLanguage({
          name: response?.data?.name || "",
          code: response?.data?.code || "",
        });
        setItemIdToEdit(response?.data?._id);
        setModalOpen(true);
      } else {
        toast.error(response?.message || "Failed to load language data");
      }
    } catch (error) {
      console.error("Error fetching language by ID:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load language data";
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
      const response = await deleteLanguage(deleteId);

      if (response?.success) {
        toast.success(response?.message || "Language deleted successfully");
        setDeleteModalOpen(false);
        setDeleteId(null);
        await fetchData();
      } else {
        toast.error(response?.message || "Failed to delete language");
      }
    } catch (error) {
      console.error("Error deleting language:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete language";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!language?.name?.trim()) newErrors.name = "Name is required";
    if (!language?.code?.trim()) newErrors.code = "Code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: language?.name?.trim(),
        code: language?.code?.trim(),
      };

      const response = itemIdToEdit
        ? await updateLanguage(itemIdToEdit, payload)
        : await addLanguage(payload);

      if (response?.success) {
        const successMessage =
          response?.message ||
          (itemIdToEdit
            ? "Language updated successfully"
            : "Language added successfully");
        toast.success(successMessage);
        setLanguage({ name: "", code: "" });
        setErrors({});
        setItemIdToEdit(null);
        setModalOpen(false);
        await fetchData();
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving language:", error);

      // Handle backend validation errors
      if (error?.response?.data?.error?.details) {
        const backendErrors = {};
        error?.response?.data?.error?.details?.forEach((detail) => {
          backendErrors[detail?.field] = detail?.message;
        });
        setErrors(backendErrors);
      }

      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
    }
  };

  // ========== MODAL HANDLERS ==========
  const handleModalClose = () => {
    setModalOpen(false);
    setLanguage({ name: "", code: "" });
    setErrors({});
    setItemIdToEdit(null);
  };

  const handleModalOpen = () => {
    setLanguage({ name: "", code: "" });
    setErrors({});
    setItemIdToEdit(null);
    setModalOpen(true);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== PERMISSIONS ==========
  const canEdit = hasPermission(RESOURCES.LANGUAGE, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.LANGUAGE, OPERATIONS.DELETE);
  const hasAnyAction = canEdit || canDelete;

  // ========== TABLE COLUMNS ==========
  const getTableColumns = () => {
    const baseColumns = [
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
        Header: "Language Name",
        accessor: "name",
        Cell: ({ value }) => (
          <strong style={{ fontWeight: "500" }}>{value}</strong>
        ),
      },
      {
        Header: "Code",
        accessor: "code",
        Cell: ({ value }) => (
          <span
            style={{
              backgroundColor: "#F5F5F5",
              padding: "4px 12px",
              borderRadius: "4px",
              fontWeight: "500",
              fontSize: "13px",
            }}
          >
            {value}
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

    if (hasAnyAction) {
      baseColumns.push({
        Header: "Options",
        disableSortBy: true,
        Cell: ({ row }) => {
          const languageItem = row?.original;

          return (
            <div className="d-flex gap-2">
              {/* Edit Button */}
              <PrivilegeAccess
                resource={RESOURCES.LANGUAGE}
                action={OPERATIONS.EDIT}
              >
                <Button
                  onClick={() => handleEdit(languageItem?._id)}
                  className="theme-edit-btn"
                  style={{
                    backgroundColor: "#4285F41F",
                    flexShrink:"0",
                    color: "#1E90FF",
                    border: "none",
                    borderRadius: "6px",
                    width: "40px",
                    height: "40px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pencil size={20}  />
                </Button>
              </PrivilegeAccess>

              {/* Delete Button */}
              <PrivilegeAccess
                resource={RESOURCES.LANGUAGE}
                action={OPERATIONS.DELETE}
              >
                <Button
                  onClick={() => handleDeleteClick(languageItem?._id)}
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
                  }}
                >
                  <Trash size={20} color="#BA2526" />
                </Button>
              </PrivilegeAccess>
            </div>
          );
        },
      });
    }

    return baseColumns;
  };

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Language Master", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Language Master List"
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
                  <p className="mt-2">Loading languages...</p>
                </div>
              ) : (
                <TableContainer
                  columns={getTableColumns()}
                  data={categorylist}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={handleModalOpen}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== ADD / EDIT MODAL ========== */}
        <Modal isOpen={modalOpen} toggle={handleModalClose}>
          <ModalHeader toggle={handleModalClose}>
            {!itemIdToEdit ? "Add" : "Edit"} Language
          </ModalHeader>
          <form onSubmit={handleAddSubmit}>
            <ModalBody>
              <div className="mb-3">
                <label className="form-label">
                  Language Name <span className="text-danger">*</span>
                </label>
                <Input
                  type="text"
                  value={language?.name || ""}
                  onChange={(e) => {
                    setLanguage({ ...language, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  name="name"
                  placeholder="Enter language name"
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

              <div className="mb-3">
                <label className="form-label">
                  Language Code <span className="text-danger">*</span>
                </label>
                <Input
                  type="text"
                  value={language?.code || ""}
                  onChange={(e) => {
                    setLanguage({ ...language, code: e.target.value });
                    setErrors({ ...errors, code: "" });
                  }}
                  name="code"
                  placeholder="e.g., EN, HI, ES"
                  className={errors?.code ? "is-invalid" : ""}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 16px",
                  }}
                />
                {errors?.code && (
                  <div className="invalid-feedback d-block">
                    {errors?.code}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                className="theme-btn bg-theme"
                style={{
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  border: "none",
                  fontWeight: "500",
                }}
              >
                {!itemIdToEdit ? "Add Language" : "Update Language"}
              </Button>
              <Button
                color="secondary"
                onClick={handleModalClose}
                style={{
                  borderRadius: "8px",
                  padding: "8px 20px",
                }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* ========== DELETE CONFIRMATION MODAL ========== */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Language"
          message="Are you sure you want to delete this language? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default LanguageMasterList;