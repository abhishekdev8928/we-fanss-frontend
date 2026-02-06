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
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
  fetchTriviaTypes,
  addTriviaTypes,
  updateTriviaTypes,
  deleteTriviaTypes,
  getTriviaTypesById,
  updateTriviaTypesStatus,
} from "../../api/triviaTypesApi";
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
            resource={RESOURCES.TRIVIA_TYPE}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <button
                onClick={onAddClick}
                className="theme-btn bg-theme"
               
              >
                <Plus size={20} />
                Add Trivia Type
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
                  No trivia types found
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
// MAIN TRIVIA TYPES MASTER LIST COMPONENT
// ========================================
const TriviaTypesMasterList = () => {
  // ========== STATE ==========
  const [category, setcategory] = useState({ name: "" });
  const [rolelist, setcategorylist] = useState([]);
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
      const result = await fetchTriviaTypes();
      const data = result?.data || result?.msg || result;

      if (Array.isArray(data)) {
        setcategorylist(data);
      } else {
        setcategorylist([]);
      }
    } catch (error) {
      console.error("Error fetching trivia types:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load trivia types.";
      toast.error(errorMessage);
      setcategorylist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const result = await updateTriviaTypesStatus(id, newStatus);
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
      const result = await getTriviaTypesById(id);
      const triviaType = result?.data;

      if (triviaType) {
        setcategory({ name: triviaType?.name || "" });
        setItemIdToEdit(triviaType?._id);
        setModalOpen(true);
      } else {
        toast.error("Failed to load trivia type data");
      }
    } catch (error) {
      console.error("Error fetching trivia type by ID:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load trivia type data";
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
      const result = await deleteTriviaTypes(deleteId);
      const success = result?.success || result?.status;
      const message = result?.message || result?.msg;

      if (success) {
        toast.success(message || "Trivia type deleted successfully");
        setDeleteModalOpen(false);
        setDeleteId(null);
        fetchData();
      } else {
        toast.error(message || "Failed to delete trivia type");
      }
    } catch (error) {
      console.error("Error deleting trivia type:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete trivia type";
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
    if (!category?.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = { name: category?.name?.trim() };
      let res_data;

      if (itemIdToEdit) {
        res_data = await updateTriviaTypes(itemIdToEdit, payload);
      } else {
        res_data = await addTriviaTypes(payload);
      }

      const success = res_data?.success || res_data?.status;
      const message = res_data?.message || res_data?.msg;

      if (!success) {
        const errorMsg =
          message ||
          res_data?.error?.message ||
          "Operation failed";

        if (errorMsg?.toLowerCase()?.includes("already exist")) {
          setErrors({ name: errorMsg });
        }

        toast.error(errorMsg);
        return;
      }

      toast.success(
        message ||
          (itemIdToEdit
            ? "Trivia type updated successfully"
            : "Trivia type added successfully")
      );
      handleModalClose();
      fetchData();
    } catch (error) {
      console.error("Add/Update Trivia Type Error:", error);

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
  const handleModalClose = () => {
    setModalOpen(false);
    setItemIdToEdit(null);
    setcategory({ name: "" });
    setErrors({});
  };

  const handleModalOpen = () => {
    setcategory({ name: "" });
    setErrors({});
    setItemIdToEdit(null);
    setModalOpen(true);
  };

  const handleInput = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setcategory({ ...category, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== PERMISSIONS ==========
  const canEdit = hasPermission(RESOURCES.TRIVIA_TYPE, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.TRIVIA_TYPE, OPERATIONS.DELETE);
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
      Header: "Trivia Type Name",
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
        const triviaType = row?.original;

        return (
          <div className="d-flex gap-2">
            {/* Edit Button */}
            <PrivilegeAccess
              resource={RESOURCES.TRIVIA_TYPE}
              action={OPERATIONS.EDIT}
            >
              <Button
                onClick={() => handleEdit(triviaType?._id)}
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
                }}
              >
                <Pencil size={20} strokeWidth="2" />
              </Button>
            </PrivilegeAccess>

            {/* Delete Button */}
            <PrivilegeAccess
              resource={RESOURCES.TRIVIA_TYPE}
              action={OPERATIONS.DELETE}
            >
              <Button
                onClick={() => handleDeleteClick(triviaType?._id)}
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

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Trivia Types Master", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Trivia Types Master List"
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
                  <p className="mt-2">Loading trivia types...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={rolelist}
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
            {!itemIdToEdit ? "Add" : "Edit"} Trivia Type
          </ModalHeader>
          <form onSubmit={handleAddSubmit}>
            <ModalBody>
              <div className="mb-3">
                <label className="form-label">
                  Trivia Type Name <span className="text-danger">*</span>
                </label>
                <Input
                  type="text"
                  value={category?.name || ""}
                  onChange={handleInput}
                  name="name"
                  placeholder="Enter trivia type name"
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
                {!itemIdToEdit ? "Add Trivia Type" : "Update Trivia Type"}
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
          title="Delete Trivia Type"
          message="Are you sure you want to delete this trivia type? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default TriviaTypesMasterList;