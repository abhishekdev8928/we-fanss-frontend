import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UpdateEmploye = () => {
  const { id } = useParams();

  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/" },
    { title: "Update Employee", link: "#" },
  ]);

  const [employee, setEmployee] = useState({
    username: "",
    email: "",
    password: "",
    role_id: "",
    role_name: "",
  });

  const [roleOptions, setRoleOptions] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch role dropdown
  const fetchRoles = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/categoryOptions`
      );
      const data = await res.json();
      const options = (data.msg || []).map((role) => ({
        value: role._id,
        label: role.name?.trim() || role.name,
      }));
      setRoleOptions(options);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  // Fetch employee by ID
  const fetchEmployee = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/getemployeeByid/${id}`
      );
      const data = await res.json();
      if (res.ok && data.msg) {
        const emp = data.msg;
        setEmployee({
          username: emp.username || "",
          email: emp.email || "",
          password: "", // optional: leave blank if not changing
          role_id: emp.role_id || "",
          role_name: emp.role_name || "",
        });
      } else {
        toast.error("Employee not found");
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchEmployee();
  }, [id]);

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!employee.username) newErrors.username = "Username is required";
    if (!employee.email) newErrors.email = "Email is required";
    if (!employee.role_id) newErrors.role_id = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const body = {
        username: employee.username,
        email: employee.email,
        password: employee.password, // optional
        role_id: employee.role_id,
        role_name: employee.role_name,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/updateemployee/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.msg === "Email already exist") {
          setErrors({ email: data.msg });
        } else {
          toast.error(data.msg || "Something went wrong");
        }
        return;
      }

      toast.success("Employee updated successfully!");
    } catch (err) {
      console.error("Update employee error:", err);
      toast.error("Failed to update employee");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="UPDATE EMPLOYEE" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleUpdateSubmit}>
                  <Row>
                    {/* Username */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
                          value={employee.username}
                          onChange={handleInput}
                        />
                        {errors.username && (
                          <span className="text-danger">{errors.username}</span>
                        )}
                      </div>
                    </Col>

                    {/* Email */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          value={employee.email}
                          onChange={handleInput}
                        />
                        {errors.email && (
                          <span className="text-danger">{errors.email}</span>
                        )}
                      </div>
                    </Col>

                    {/* Password */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter password (leave blank to keep current)"
                          value={employee.password}
                          onChange={handleInput}
                        />
                        {errors.password && (
                          <span className="text-danger">{errors.password}</span>
                        )}
                      </div>
                    </Col>

                    {/* Role */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Select Role</Label>
                        <Select
                          options={roleOptions}
                          value={roleOptions.find(
                            (opt) => opt.value === employee.role_id
                          ) || null}
                          onChange={(selected) =>
                            setEmployee((prev) => ({
                              ...prev,
                              role_id: selected?.value || "",
                              role_name: selected?.label || "",
                            }))
                          }
                          placeholder="Choose role..."
                          isClearable
                        />
                        {errors.role_id && (
                          <span className="text-danger">{errors.role_id}</span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Button color="primary" type="submit" className="mt-3">
                    Update Employee
                  </Button>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UpdateEmploye;
