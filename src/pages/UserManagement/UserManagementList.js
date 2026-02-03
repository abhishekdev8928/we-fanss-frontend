import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import deleteimg from "../../assets/images/delete.png";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole,
} from "../../api/userManagementApi";
import { register } from "../../api/authApi";
import { getAllRoles } from "../../api/roleApi";

const UserManagementList = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);

  // Reset form when modals close
  useEffect(() => {
    if (!addModal && !editModal) {
      resetForm();
    }
  }, [addModal, editModal]);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // Fetch users
const fetchUsers = async () => {
  try {
    const response = await getAllUsers();
    const userList = response.data.users || [];
    
    const transformedUsers = userList.map(user => {
      let roleName = "N/A";
      
      if (user.role) {
        if (typeof user.role === "string") {
          roleName = user.role;
        } else if (typeof user.role === "object" && user.role.name) {
          roleName = user.role.name;
        }
      }
      
      return {
        _id: user._id,
        name: user.name || "",
        email: user.email || "",
        profilePic: user.profilePic || null,
        roleName: roleName,
        roleId: user.role?._id || null,
        isActive: user.isActive || false,
        isVerified: user.isVerified || false,
        totpEnabled: user.totpEnabled || false,
        totpQrCode: user.totpQrCode || null,
        lastLogin: user.lastLogin || null,
        lastLoginDevice: user.lastLoginDevice || null,
      };
    });
    
    console.log("Transformed Users:", transformedUsers); // DEBUG
    
    setUsers(transformedUsers);
    setFilteredUsers(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to load users");
  }
};

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await getAllRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (isEdit = false) => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
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

  // ✅ FIXED: Add user - formData.role already contains the role ID
  const handleAddUser = async () => {
    if (!validateForm(false)) return;
    
    try {
      // formData.role already contains the role ID from the dropdown
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role, // ✅ ROLE ID (already stored from dropdown)
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

  // ✅ FIXED: Update user - formData.role already contains the role ID
  const handleUpdateUser = async () => {
    if (!validateForm(true)) return;
    
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role, // ✅ ROLE ID (already stored from dropdown)
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

  // ✅ FIXED: Edit user - set roleId instead of roleName
  const openEditModal = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.roleId, // ✅ Use roleId instead of roleName
    });
    setEditModal(true);
  };

  // Delete user
  const openDeleteModal = (userId) => {
    setDeletingUserId(userId);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(deletingUserId);
      toast.success("User deleted successfully");
      setDeleteModal(false);
      setDeletingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Toggle status
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

  // View QR
  const openQrModal = (user) => {
    setViewingUser(user);
    setQrModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "" });
    setErrors({});
    setEditingUserId(null);
  };

  // Load data on mount
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "User Management", link: "#" },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="User Management" breadcrumbItems={breadcrumbItems} />
        
        <Card>
          <CardBody>
            {/* Controls */}
            <Row className="mb-3">
              <Col md={2}>
                <select
                  className="form-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>Show 5</option>
                  <option value={10}>Show 10</option>
                  <option value={20}>Show 20</option>
                </select>
              </Col>
              
              <Col md={4}>
                <Input
                  type="text"
                  placeholder={`Search ${filteredUsers.length} records...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              
              <Col md={6} className="text-end">
                <Button 
                  color="primary" 
                  onClick={() => {
                    resetForm();
                    setAddModal(true);
                  }}
                >
                  <i className="mdi mdi-plus me-1"></i>
                  Add New User
                </Button>
              </Col>
            </Row>

            {/* Table */}
            <div className="table-responsive">
              <Table bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>QR Code</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
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
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className="text-capitalize">{user.roleName}</span>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={user.isActive}
                              onChange={() => handleToggleStatus(user._id, user.isActive)}
                            />
                            <label className="form-check-label">
                              {user.isActive ? "Active" : "Inactive"}
                            </label>
                          </div>
                        </td>
                        <td>
                          {user.totpQrCode ? (
                            <img
                              src={user.totpQrCode}
                              alt="QR"
                              style={{
                                width: "60px",
                                height: "60px",
                                cursor: "pointer",
                                border: "1px solid #ddd",
                                padding: "4px",
                                borderRadius: "4px",
                              }}
                              onClick={() => openQrModal(user)}
                            />
                          ) : (
                            <span className="text-muted">No QR</span>
                          )}
                        </td>
                        <td>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "Never"}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => openEditModal(user)}
                            >
                              <i className="mdi mdi-pencil"></i>
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => openDeleteModal(user._id)}
                            >
                              <i className="mdi mdi-delete"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Row className="mt-3">
                <Col md={6}>
                  <p className="mb-0">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                    {filteredUsers.length} entries
                  </p>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      First
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="align-self-center mx-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </Container>

      {/* Add User Modal */}
      <Modal isOpen={addModal} toggle={() => setAddModal(false)}>
        <ModalHeader toggle={() => setAddModal(false)}>
          Add New User
        </ModalHeader>
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
            />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
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
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
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
            />
            {errors.password && <div className="text-danger small">{errors.password}</div>}
          </FormGroup>

          <FormGroup>
            <Label>Role *</Label>
            <Input
              type="select"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              invalid={!!errors.role}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </Input>
            {errors.role && <div className="text-danger small">{errors.role}</div>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddUser}>
            Add User
          </Button>
          <Button color="secondary" onClick={() => setAddModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(false)}>
        <ModalHeader toggle={() => setEditModal(false)}>
          Edit User
        </ModalHeader>
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
            />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
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
            />
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </FormGroup>

          <FormGroup>
            <Label>Password (Leave blank to keep current)</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
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
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </Input>
            {errors.role && <div className="text-danger small">{errors.role}</div>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateUser}>
            Update User
          </Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalBody className="text-center py-4">
          <h4 className="mb-4">
            Do you really want to delete this user?
          </h4>
          <img src={deleteimg} alt="Delete" style={{ width: "200px" }} />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* QR Modal */}
      <Modal isOpen={qrModal} toggle={() => setQrModal(false)} size="lg">
        <ModalHeader toggle={() => setQrModal(false)}>
          User Details - {viewingUser?.name}
        </ModalHeader>
        <ModalBody>
          {viewingUser && (
            <Row>
              <Col md={6}>
                <h5>User Information</h5>
                <div className="mb-3">
                  <strong>Name:</strong> {viewingUser.name}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {viewingUser.email}
                </div>
                <div className="mb-3">
                  <strong>Role:</strong>{" "}
                  <span className="text-capitalize">{viewingUser.roleName}</span>
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
                  <strong>Last Login:</strong>{" "}
                  {viewingUser.lastLogin
                    ? new Date(viewingUser.lastLogin).toLocaleString()
                    : "Never"}
                </div>
                {viewingUser.lastLoginDevice && (
                  <div className="mb-3">
                    <strong>Last Device:</strong> {viewingUser.lastLoginDevice}
                  </div>
                )}
              </Col>
              <Col md={6}>
                <h5>2FA QR Code</h5>
                {viewingUser.totpQrCode ? (
                  <div className="text-center">
                    <img
                      src={viewingUser.totpQrCode}
                      alt="QR Code"
                      style={{ maxWidth: "300px", width: "100%" }}
                    />
                    <p className="text-muted mt-3">
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
  );
};

export default UserManagementList;
