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
  Spinner,
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
import prvi from "../../assets/images/privileges.png";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { 
  getAllRoles, 
  createRole, 
  updateRole, 
  updateRoleStatus, 
  deleteRole 
} from "../../api/roleApi";

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
              Add
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

const RoleMasterList = () => {
  // 🔥 STATE MANAGEMENT
  const [role, setRole] = useState({ name: "" });
  const [rolelist, setRolelist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔥 MODAL STATES
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);

  // 🔥 ERROR HANDLING
  const [errors, setErrors] = useState({});

  // ========== FETCH ROLES ==========
  const fetchData = async () => {
    setLoading(true);
    try {
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
      toast.error(error);
      setRolelist([]); // ✅ Set empty array on error
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
        toast.success(data.message || "Role updated successfully!");
      } else {
        // CREATE
        const data = await createRole(role);
        toast.success(data.message || "Role added successfully!");
      }

      handleCloseModal();
      fetchData(); // Refresh list
    } catch (error) {
      if (error.includes("already exist")) {
        setErrors({ name: error });
      } else {
        toast.error(error);
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
      toast.success(data.message || "Status updated successfully!");
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error);
    }
  };

  // ========== EDIT ROLE ==========
  const handleEdit = async (id) => {
    try {
      // Find role from existing list (no API call needed)
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
  const handleDelete = (id) => {
    setDeleteId(id);
    setModalOpen2(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) {
      toast.error("No role selected for deletion");
      return;
    }

    try {
      const data = await deleteRole(deleteId);
      toast.success(data.message || "Role deleted successfully!");
      setModalOpen2(false);
      setDeleteId(null);
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error);
    }
  };

  // ========== MODAL HANDLERS ==========
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
    setRole({ name: "" });
    setErrors({});
  };

  const handleCloseDeleteModal = () => {
    setModalOpen2(false);
    setDeleteId(null);
  };

  // ========== TABLE COLUMNS ==========
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
      },
      { 
        Header: "Role", 
        accessor: "name" 
      },
      {
        Header: "Privileges",
        Cell: ({ row }) => (
          <div>
            <Link to={`/dashboard/privileges/${row.original._id}`}>
              <img className="Privilege_Icon" src={prvi} alt="Privilege Icon" height="30px" />
            </Link>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ row }) => {
          const isActive = row.original.isActive || row.original.status === 1;

          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original._id}`}
                checked={isActive}
                onChange={() =>
                  handleStatusToggle(row.original._id, isActive)
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
        Header: "Option",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              onClick={() => handleEdit(row.original._id)}
              size="sm"
            >
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [rolelist]
  );

  // ========== BREADCRUMBS ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Role Master", link: "#" },
  ];

  // ========== FETCH ON MOUNT ==========
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="ROLE MASTER" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading roles...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={rolelist}
                  customPageSize={10}
                  isGlobalFilter={true}
                  setModalOpen={setModalOpen}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== ADD/EDIT MODAL ========== */}
        <Modal isOpen={modalOpen} toggle={handleCloseModal}>
          <ModalHeader toggle={handleCloseModal}>
            {editId ? "Edit" : "Add"} Master Role
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Input
                type="text"
                value={role.name}
                onChange={(e) => setRole({ name: e.target.value })}
                name="name"
                placeholder="Role Name"
                className="mb-2"
                disabled={submitting}
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {editId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editId ? "Update" : "Add"
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
        <Modal isOpen={modalOpen2} toggle={handleCloseDeleteModal}>
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete this role?
            </h4>
            <div className="d-flex justify-content-center">
              <img
                src={deleteimg}
                alt="Delete Icon"
                width={"70%"}
                className="mb-3 m-auto"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={confirmDelete}>
              Delete
            </Button>
            <Button color="secondary" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default RoleMasterList;