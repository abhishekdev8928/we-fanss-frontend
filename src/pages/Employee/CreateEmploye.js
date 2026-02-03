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

const CreateEmploye = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/" },
    { title: "Add Employee", link: "#" },
  ]);

  const [roleOptions, setRoleOptions] = useState([]);
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role_id: "",
    role_name: "",
    password: "",
   
  });

  const [errors, setErrors] = useState({});

  // ✅ Fetch role dropdown
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



  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Handle input
  const handleInput = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!employee.name) newErrors.name = "Name is required";
    if (!employee.email) newErrors.email = "Email is required";
    if (!employee.password) newErrors.password = "Password is required";
    if (!employee.role_id) newErrors.role_id = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const adminid = localStorage.getItem("adminid");
      const body = {
       
        name: employee.name,
        email: employee.email,
        password: employee.password,
        role_id: employee.role_id,
        role_name: employee.role_name,
        createdBy: adminid,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/employee/addemployee`,
        {
          method: "POST",
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

      toast.success("Employee added successfully!");
      setEmployee({
        name: "",
        email: "",
        role_id: "",
        role_name: "",
        password: "",
      
      });
      setErrors({});
    } catch (err) {
      console.error("Add employee error:", err);
      toast.error("Failed to add employee.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="ADD EMPLOYEE" breadcrumbItems={breadcrumbItems} />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <Row>
                    {/* Name */}
                    <Col md="6">
                      <div className="mb-3">
                        <Label>Name</Label>
                        <Input
                          name="name"
                          type="text"
                          value={employee.name}
                          onChange={handleInput}
                          placeholder="Enter name"
                        />
                        {errors.name && (
                          <span className="text-danger">{errors.name}</span>
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
                          value={employee.email}
                          onChange={handleInput}
                          placeholder="Enter email"
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
                          value={employee.password}
                          onChange={handleInput}
                          placeholder="Enter password"
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
                          )}
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

                  <Button color="primary" type="submit">
                    Add Employee
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

export default CreateEmploye;
