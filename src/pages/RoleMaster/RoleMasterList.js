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
  FormGroup,
  Label,
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
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash, ShieldCheck } from "lucide-react";
import { 
  getAllRoles, 
  createRole, 
  updateRole, 
  updateRoleStatus, 
  deleteRole 
} from "../../api/roleApi";
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
          placeholder="Search roles..."
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
    usePagination,
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
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
              }}
            >
              <Plus size={20} />
              Add Role
            </Button>
          </div>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="table-responsive react-table">
        <Table {...getTableProps()} className={className} style={{ borderCollapse: "separate", borderSpacing: "0" }}>
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
                      verticalAlign: "middle",
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
                          verticalAlign: "middle",
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
                  No roles found
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
// MAIN ROLE MASTER COMPONENT
// ========================================
const RoleMasterList = () => {
  // ========== STATE ==========
  const [role, setRole] = useState({ name: "" });
  const [rolelist, setRolelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  // Error handling
  const [errors, setErrors] = useState({});

  // ========== API CALLS ==========
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllRoles();

      // ✅ FIX: Ensure we always set an array
      let roles = [];

      if (Array.isArray(data)) {
        roles = data;
      } else if (data && Array.isArray(data.roles)) {
        roles = data.roles;
      } else if (data && Array.isArray(data.msg)) {
        roles = data.msg;
      } else if (data && Array.isArray(data.data)) {
        roles = data.data;
      }

      setRolelist(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
      setRolelist([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== CREATE/UPDATE ROLE ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!role.name || !role.name.trim()) {
      newErrors.name = "Role Name is required";
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      if (editId) {
        // UPDATE
        const data = await updateRole(editId, role);
        toast.success(data?.message || "Role updated successfully!");
      } else {
        // CREATE
        const data = await createRole(role);
        toast.success(data?.message || "Role added successfully!");
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      if (error?.includes("already exist")) {
        setErrors({ name: error });
      } else {
        toast.error(error || "Operation failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ========== TOGGLE STATUS ==========
  const handleStatusToggle = async (roleId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const data = await updateRoleStatus(roleId, newStatus);
      toast.success(data?.message || "Status updated successfully!");
      fetchData();
    } catch (error) {
      toast.error(error || "Failed to update status");
    }
  };

  // ========== EDIT ROLE ==========
  const handleEdit = async (id) => {
    try {
      const roleToEdit = rolelist.find((r) => r._id === id);

      if (roleToEdit) {
        setRole({ name: roleToEdit.name });
        setEditId(id);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error editing role:", error);
      toast.error("Failed to load role details");
    }
  };

  // ========== DELETE ROLE ==========
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No role selected for deletion");
      return;
    }

    try {
      const data = await deleteRole(deleteId);
      toast.success(data?.message || "Role deleted successfully!");
      setRolelist((prev) => prev.filter((row) => row._id !== deleteId));
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      toast.error(error || "Failed to delete role");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ========== MODAL HANDLERS ==========
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
    setRole({ name: "" });
    setErrors({});
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== TABLE COLUMNS ==========
  const columns = [
    {
      Header: "No",
      accessor: (_row, i) => i + 1,
      disableSortBy: true,
    },
    {
      Header: "Role Name",
      accessor: "name",
      Cell: ({ value }) => <strong style={{ fontWeight: "500" }}>{value || "—"}</strong>,
    },
    {
      Header: "Privileges",
      disableSortBy: true,
      Cell: ({ row }) => {
        const roleData = row.original;

        return (
          <Link
            to={`/dashboard/privileges/${roleData._id}`}
            style={{
              backgroundColor: "#8B5CF614",
              color: "#8B5CF6",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck size={18} />
            Manage Privileges
          </Link>
        );
      },
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ row }) => {
        const roleData = row.original;
        const isActive = roleData?.isActive || roleData?.status === 1;

        return (
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id={`switch-${roleData?._id}`}
              checked={isActive}
              onChange={() => handleStatusToggle(roleData?._id, isActive)}
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
      Cell: ({ row }) => {
        const roleData = row.original;

        return (
          <div className="d-flex gap-2">
            {/* Edit Button */}
            <button
              onClick={() => handleEdit(roleData._id)}
              style={{
                backgroundColor: "#4285F41F",
                color: "#1E90FF",
                border: "none",
                borderRadius: "6px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="Edit Role"
            >
              <Pencil size={20} strokeWidth="2" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteClick(roleData._id)}
              style={{
                backgroundColor: "#FFE5E5",
                color: "#FF5555",
                border: "none",
                borderRadius: "6px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="Delete Role"
            >
              <Trash size={20} color="#BA2526" />
            </button>
          </div>
        );
      },
    },
  ];

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Role Master", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Role Master" breadcrumbItems={breadcrumbItems} />

          <Card style={{ border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading roles...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={rolelist}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={() => {
                    setRole({ name: "" });
                    setEditId(null);
                    setErrors({});
                    setModalOpen(true);
                  }}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== ADD/EDIT ROLE MODAL ========== */}
        <Modal isOpen={modalOpen} toggle={handleCloseModal} size="md">
          <ModalHeader toggle={handleCloseModal}>
            {editId ? "Edit Role" : "Add New Role"}
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label>Role Name *</Label>
                <Input
                  type="text"
                  value={role.name}
                  onChange={(e) => setRole({ name: e.target.value })}
                  name="name"
                  placeholder="Enter role name"
                  disabled={submitting}
                  invalid={!!errors.name}
                  style={{ borderRadius: "6px" }}
                  autoComplete="off"
                />
                {errors.name && (
                  <div className="text-danger small mt-1">{errors.name}</div>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                disabled={submitting}
                className="theme-btn bg-theme"
                style={{ border: "none" }}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {editId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editId ? "Update Role" : "Add Role"
                )}
              </Button>
              <Button 
                color="secondary" 
                onClick={handleCloseModal}
                disabled={submitting}
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
          title="Delete Role"
          message="Are you sure you want to delete this role? This action cannot be undone and will affect all users assigned to this role."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default RoleMasterList;