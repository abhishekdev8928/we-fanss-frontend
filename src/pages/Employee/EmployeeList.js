import React, { useMemo, Fragment, useState, useEffect } from "react";
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
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole, // YE FUNCTION PROPERLY EXPORT HONA CHAHIYE
} from "../../api/userManagementApi";

// Debug ke liye - console me check karo ye function mil raha hai ya nahi

import { register } from "../../api/authApi";
import { getAllRoles } from "../../api/roleApi";

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
      <Input
        type="text"
        className="form-control"
        placeholder={`Search ${count} records...`}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </Col>
  );
}

function Filter() {
  return null;
}

const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  setModalOpen,
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
      <Row className="mb-2">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
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
            <Button color="primary" onClick={() => setModalOpen(true)}>
              Add New User
            </Button>
          </div>
        </Col>
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
                    <div {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            max={pageOptions.length}
            style={{ width: 70 }}
            value={pageIndex + 1}
            onChange={(e) => gotoPage(Number(e.target.value) - 1)}
          />
        </Col>
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  customPageSize: PropTypes.number,
  className: PropTypes.string,
  isGlobalFilter: PropTypes.bool,
  setModalOpen: PropTypes.func.isRequired,
};

const UserManagementList = () => {
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  
  const [errors, setErrors] = useState({});

  // Fetch users data
  const fetchData = async () => {
    try {
      const result = await getAllUsers();
      setUserList(result.data.users || []);
    } catch (error) {
      toast.error("Failed to load users.");
      console.error("Fetch users error:", error);
    }
  };

  // Fetch roles data
  const fetchRoles = async () => {
    try {
      const result = await getAllRoles();
      setRoleList(result.data || []);
    } catch (error) {
      toast.error("Failed to load roles.");
      console.error("Fetch roles error:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Only validate password for new user (add modal)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }
    
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle ADD new user
  const handleAddUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log("Adding new user with data:", formData);
      await register(formData);
      toast.success("User created successfully");
      handleCloseAddModal();
      fetchData();
    } catch (error) {
      console.error("Add user error:", error);
      const errorMessage = error?.message || error?.error || "Failed to create user";
      toast.error(errorMessage);
    }
  };

  // Handle UPDATE existing user
  const handleUpdateUser = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!editUserId) {
      toast.error("No user ID found for update");
      return;
    }
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      
      // Only include password if it's provided
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }
      
      console.log("Updating user:", editUserId, "with data:", updateData);
      await updateUserRole(editUserId, updateData);
      toast.success("User updated successfully");
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error("Update user error:", error);
      const errorMessage = error?.message || error?.error || "Failed to update user";
      toast.error(errorMessage);
    }
  };

  // Close add modal
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
    setIsEditMode(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setErrors({});
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditUserId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setErrors({});
    setAddModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (user) => {
    console.log("Opening edit modal for user:", user);
    setIsEditMode(true);
    setEditUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setErrors({});
    setEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setIsEditMode(false);
    setEditUserId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
    setErrors({});
  };

  // Handle status toggle
  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = !currentStatus;
    try {
      console.log("Updating status for user:", id, "to:", newStatus);
      await updateUserStatus(id, { isActive: newStatus });
      toast.success("Status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Failed to update status");
    }
  };

  // Open delete modal
  const handleDelete = (id) => {
    console.log("Opening delete modal for user:", id);
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }
    
    try {
      console.log("Deleting user:", deleteId);
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      handleCloseDeleteModal();
      fetchData();
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("Delete failed");
    }
  };

  // Show QR Code
  const handleShowQR = (user) => {
    console.log("Showing QR for user:", user);
    setSelectedUser(user);
    setQrCodeModal(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Profile",
        accessor: "profilePic",
        Cell: ({ row }) => (
          <div>
            {row.original.profilePic ? (
              <img
                src={row.original.profilePic}
                alt="Profile"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "32px",
                  height: "32px",
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
                {row.original.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ row }) => (
          <span className="text-capitalize">{row.original.role}</span>
        ),
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ row }) => {
          const isActive = row.original.isActive;

          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original._id}`}
                checked={isActive}
                onChange={() =>
                  handleStatusChange(row.original.isActive, row.original._id)
                }
              />
              <label
                className="form-check-label"
                htmlFor={`switch-${row.original._id}`}
              >
                {isActive ? "Active" : "Inactive"}
              </label>
            </div>
          );
        },
      },
      {
        Header: "QR Code",
        id: "qrCode",
        accessor: "totpQrCode",
        Cell: ({ row }) => (
          <div>
            {row.original.totpQrCode ? (
              <img
                src={row.original.totpQrCode}
                alt="QR Code"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                  cursor: "pointer",
                  border: "1px solid #ddd",
                  padding: "4px",
                  borderRadius: "4px",
                }}
                onClick={() => handleShowQR(row.original)}
                title="Click to view larger"
              />
            ) : (
              <span className="text-muted">No QR Code</span>
            )}
          </div>
        ),
      },
      {
        Header: "Last Login",
        accessor: "lastLogin",
        Cell: ({ row }) => {
          if (!row.original.lastLogin) return "Never";
          return new Date(row.original.lastLogin).toLocaleString();
        },
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <i className="mdi mdi-pencil"></i> Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
            >
              <i className="mdi mdi-delete"></i> Delete
            </Button>
          </div>
        ),
      },
    ],
    [userList]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "User Management", link: "#" },
  ];

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="User Management"
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={userList}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={handleOpenAddModal}
              />
            </CardBody>
          </Card>
        </Container>

        {/* Add User Modal */}
        <Modal isOpen={addModalOpen} toggle={handleCloseAddModal}>
          <ModalHeader toggle={handleCloseAddModal}>Add New User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                invalid={!!errors.name}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUser();
                  }
                }}
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                invalid={!!errors.email}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUser();
                  }
                }}
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                invalid={!!errors.password}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUser();
                  }
                }}
              />
              {errors.password && (
                <span className="text-danger">{errors.password}</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="role">Role</Label>
              <Input
                type="select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                invalid={!!errors.role}
              >
                <option value="">Select Role</option>
                {roleList.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </Input>
              {errors.role && (
                <span className="text-danger">{errors.role}</span>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("ADD BUTTON CLICKED - Calling handleAddUser");
                handleAddUser();
              }}
            >
              Add User
            </Button>
            <Button color="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Edit User Modal */}
        <Modal isOpen={editModalOpen} toggle={handleCloseEditModal}>
          <ModalHeader toggle={handleCloseEditModal}>Edit User</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="edit-name">Name</Label>
              <Input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                invalid={!!errors.name}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUpdateUser();
                  }
                }}
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="edit-email">Email</Label>
              <Input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                invalid={!!errors.email}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUpdateUser();
                  }
                }}
              />
              {errors.email && (
                <span className="text-danger">{errors.email}</span>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="edit-password">
                Password <small className="text-muted">(leave blank to keep current)</small>
              </Label>
              <Input
                type="password"
                id="edit-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password (optional)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleUpdateUser();
                  }
                }}
              />
              <small className="text-muted">
                Only fill this if you want to change the password
              </small>
            </FormGroup>

            <FormGroup>
              <Label for="edit-role">Role</Label>
              <Input
                type="select"
                id="edit-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                invalid={!!errors.role}
              >
                <option value="">Select Role</option>
                {roleList.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </Input>
              {errors.role && (
                <span className="text-danger">{errors.role}</span>
              )}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("UPDATE BUTTON CLICKED - Calling handleUpdateUser");
                console.log("Edit User ID:", editUserId);
                console.log("Is Edit Mode:", isEditMode);
                handleUpdateUser();
              }}
            >
              Update User
            </Button>
            <Button color="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModalOpen} toggle={handleCloseDeleteModal}>
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete this user?
            </h4>
            <div className="d-flex justify-content-center">
              <img
                src={deleteimg}
                alt="Delete"
                width={"70%"}
                className="mb-3 m-auto"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button color="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* View Details Modal (QR Code) */}
        <Modal
          isOpen={qrCodeModal}
          toggle={() => setQrCodeModal(false)}
          size="lg"
        >
          <ModalHeader toggle={() => setQrCodeModal(false)}>
            User Details - {selectedUser?.name}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={6}>
                <h5>User Information</h5>
                <div className="mb-3">
                  <strong>Name:</strong> {selectedUser?.name}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {selectedUser?.email}
                </div>
                <div className="mb-3">
                  <strong>Role:</strong>{" "}
                  <span className="text-capitalize">{selectedUser?.role}</span>
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>{" "}
                  {selectedUser?.isActive ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong>Verified:</strong>{" "}
                  {selectedUser?.isVerified ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-warning">No</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong>2FA Enabled:</strong>{" "}
                  {selectedUser?.totpEnabled ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </div>
                <div className="mb-3">
                  <strong>Last Login:</strong>{" "}
                  {selectedUser?.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString()
                    : "Never"}
                </div>
                {selectedUser?.lastLoginDevice && (
                  <div className="mb-3">
                    <strong>Last Device:</strong> {selectedUser.lastLoginDevice}
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h5>2FA QR Code</h5>
                {selectedUser?.totpQrCode ? (
                  <div className="text-center">
                    <img
                      src={selectedUser.totpQrCode}
                      alt="2FA QR Code"
                      style={{ width: "100%", maxWidth: "300px" }}
                      className="mb-3"
                    />
                    <p className="text-muted">
                      Scan this QR code with your authenticator app
                    </p>
                  </div>
                ) : (
                  <p className="text-muted">
                    No QR code available for this user
                  </p>
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setQrCodeModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default UserManagementList;