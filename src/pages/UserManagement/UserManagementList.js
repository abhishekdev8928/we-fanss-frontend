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
  Label,
  FormGroup,
  Badge,
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
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Plus, Search, Pencil, Trash, Eye } from "lucide-react";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole,
} from "../../api/userManagementApi";
import { register } from "../../api/authApi";
import { getAllRoles } from "../../api/roleApi";
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
          placeholder="Search users..."
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
              Add New User
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
                  No users found
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
// MAIN USER MANAGEMENT COMPONENT
// ========================================
const UserManagementList = () => {
  // ========== STATE ==========
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [qrModal, setQrModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Reset form when modals close
  useEffect(() => {
    if (!addModal && !editModal) {
      resetForm();
    }
  }, [addModal, editModal]);

  // ========== HELPER FUNCTIONS ==========
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ========== API CALLS ==========
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      const userList = response?.data?.users || [];

      const transformedUsers = userList.map((user) => {
        let roleName = "N/A";

        if (user?.role) {
          if (typeof user.role === "string") {
            roleName = user.role;
          } else if (typeof user.role === "object" && user.role.name) {
            roleName = user.role.name;
          }
        }

        return {
          _id: user?._id || "",
          name: user?.name || "",
          email: user?.email || "",
          profilePic: user?.profilePic || null,
          roleName: roleName,
          roleId: user?.role?._id || null,
          isActive: user?.isActive || false,
          isVerified: user?.isVerified || false,
          totpEnabled: user?.totpEnabled || false,
          totpQrCode: user?.totpQrCode || null,
          lastLogin: user?.lastLogin || null,
          lastLoginDevice: user?.lastLoginDevice || null,
        };
      });

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response?.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    }
  };

  // ========== FORM HANDLING ==========
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (isEdit = false) => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isEdit && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateForm(false)) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast.success("User created successfully");
      setAddModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async () => {
    if (!validateForm(true)) return;

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password;
      }

      await updateUserRole(editingUserId, updateData);
      toast.success("User updated successfully");
      setEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error?.message || "Failed to update user");
    }
  };

  const openEditModal = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.roleId,
    });
    setEditModal(true);
  };

  const handleDeleteClick = (userId) => {
    setDeleteId(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((row) => row._id !== deleteId));
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, { isActive: !currentStatus });
      toast.success("Status updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const openQrModal = (user) => {
    setViewingUser(user);
    setQrModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "" });
    setErrors({});
    setEditingUserId(null);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // ========== TABLE COLUMNS ==========
  const columns = [
    {
      Header: "No",
      accessor: (_row, i) => i + 1,
      disableSortBy: true,
    },
    {
      Header: "Profile",
      accessor: "profilePic",
      disableSortBy: true,
      Cell: ({ row }) => {
        const user = row.original;
        return user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#4F46E5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        );
      },
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ value }) => <strong style={{ fontWeight: "500" }}>{value || "—"}</strong>,
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Role",
      accessor: "roleName",
      Cell: ({ value }) => <span className="text-capitalize">{value || "—"}</span>,
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ row }) => {
        const user = row.original;
        const isActive = user?.isActive;

        return (
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id={`switch-${user?._id}`}
              checked={isActive}
              onChange={() => handleToggleStatus(user?._id, isActive)}
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
      Header: "2FA",
      accessor: "totpQrCode",
      disableSortBy: true,
      Cell: ({ row }) => {
        const user = row.original;
        return user?.totpQrCode ? (
          <img
            src={user.totpQrCode}
            alt="QR"
            style={{
              width: "50px",
              height: "50px",
              cursor: "pointer",
              border: "1px solid #e0e0e0",
              padding: "4px",
              borderRadius: "6px",
            }}
            onClick={() => openQrModal(user)}
          />
        ) : (
          <span className="text-muted" style={{ fontSize: "13px" }}>No QR</span>
        );
      },
    },
    {
      Header: "Last Login",
      accessor: "lastLogin",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="d-flex gap-2">
            {/* View Details Button */}
            <button
              onClick={() => openQrModal(user)}
              style={{
                backgroundColor: "#10B98114",
                color: "#10B981",
                border: "none",
                borderRadius: "6px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="View Details"
            >
              <Eye size={20} />
            </button>

            {/* Edit Button */}
            <button
              onClick={() => openEditModal(user)}
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
              title="Edit User"
            >
              <Pencil size={20} strokeWidth="2" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteClick(user?._id)}
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
              title="Delete User"
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
    { title: "User Management", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="User Management" breadcrumbItems={breadcrumbItems} />

          <Card style={{ border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading users...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={users}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={() => {
                    resetForm();
                    setAddModal(true);
                  }}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== ADD USER MODAL ========== */}
        <Modal isOpen={addModal} toggle={() => setAddModal(false)} size="md">
          <ModalHeader toggle={() => setAddModal(false)}>Add New User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                invalid={!!errors.name}
                autoComplete="off"
                style={{ borderRadius: "6px" }}
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                invalid={!!errors.email}
                autoComplete="new-email"
                style={{ borderRadius: "6px" }}
              />
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Password *</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                invalid={!!errors.password}
                autoComplete="new-password"
                style={{ borderRadius: "6px" }}
              />
              {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Role *</Label>
              <Input
                type="select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                invalid={!!errors.role}
                style={{ borderRadius: "6px" }}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </Input>
              {errors.role && <div className="text-danger small mt-1">{errors.role}</div>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleAddUser}
              className="theme-btn bg-theme"
              style={{ border: "none" }}
            >
              Add User
            </Button>
            <Button color="secondary" onClick={() => setAddModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* ========== EDIT USER MODAL ========== */}
        <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="md">
          <ModalHeader toggle={() => setEditModal(false)}>Edit User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                invalid={!!errors.name}
                autoComplete="off"
                style={{ borderRadius: "6px" }}
              />
              {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                invalid={!!errors.email}
                autoComplete="off"
                style={{ borderRadius: "6px" }}
              />
              {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
            </FormGroup>

            <FormGroup>
              <Label>Password (Leave blank to keep current)</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                style={{ borderRadius: "6px" }}
              />
              <small className="text-muted">Only fill to change password</small>
            </FormGroup>

            <FormGroup>
              <Label>Role *</Label>
              <Input
                type="select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                invalid={!!errors.role}
                style={{ borderRadius: "6px" }}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </Input>
              {errors.role && <div className="text-danger small mt-1">{errors.role}</div>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleUpdateUser}
              className="theme-btn bg-theme"
              style={{ border: "none" }}
            >
              Update User
            </Button>
            <Button color="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* ========== DELETE CONFIRMATION MODAL ========== */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />

        {/* ========== USER DETAILS/QR MODAL ========== */}
        <Modal isOpen={qrModal} toggle={() => setQrModal(false)} size="lg">
          <ModalHeader toggle={() => setQrModal(false)}>
            User Details - {viewingUser?.name}
          </ModalHeader>
          <ModalBody>
            {viewingUser && (
              <Row>
                <Col md={6}>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                    User Information
                  </h5>
                  <div className="mb-3">
                    <strong>Name:</strong> {viewingUser.name || "—"}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {viewingUser.email || "—"}
                  </div>
                  <div className="mb-3">
                    <strong>Role:</strong>{" "}
                    <span className="text-capitalize">{viewingUser.roleName || "—"}</span>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>{" "}
                    {viewingUser.isActive ? (
                      <Badge color="success">Active</Badge>
                    ) : (
                      <Badge color="danger">Inactive</Badge>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>Verified:</strong>{" "}
                    {viewingUser.isVerified ? (
                      <Badge color="success">Yes</Badge>
                    ) : (
                      <Badge color="warning">No</Badge>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>2FA Enabled:</strong>{" "}
                    {viewingUser.totpEnabled ? (
                      <Badge color="success">Yes</Badge>
                    ) : (
                      <Badge color="secondary">No</Badge>
                    )}
                  </div>
                  <div className="mb-3">
                    <strong>Last Login:</strong> {formatDate(viewingUser.lastLogin)}
                  </div>
                  {viewingUser.lastLoginDevice && (
                    <div className="mb-3">
                      <strong>Last Device:</strong> {viewingUser.lastLoginDevice}
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                    2FA QR Code
                  </h5>
                  {viewingUser.totpQrCode ? (
                    <div className="text-center">
                      <img
                        src={viewingUser.totpQrCode}
                        alt="QR Code"
                        style={{
                          maxWidth: "300px",
                          width: "100%",
                          border: "1px solid #e0e0e0",
                          padding: "12px",
                          borderRadius: "8px",
                        }}
                      />
                      <p className="text-muted mt-3" style={{ fontSize: "14px" }}>
                        Scan with authenticator app
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted">No QR code available</p>
                  )}
                </Col>
              </Row>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setQrModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default UserManagementList;