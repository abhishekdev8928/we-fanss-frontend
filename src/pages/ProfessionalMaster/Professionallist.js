

import { formatDate} from "../../utils/helper"
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
import { Link } from "react-router-dom";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  getprofessionalmasters,
  deleteprofessionalmaster,
  updateprofessionalmasterStatus,
} from "../../api/professionalmasterApi";


// 🔎 Global filter component
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

// 🔎 Reusable TableContainer component
const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
  privileges,
  isAdmin,
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

// ✅ Main Component
const ProfessionalMasterList = () => {
  const [professionalmasterList, setProfessionalmasterList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 👇 Open modal and set ID
  const handleDelete = (id) => {
    setDeleteId(id);
    setModalOpen2(true);
  };

  // 👇 Close modal and reset ID
  const handleClose = () => {
    setModalOpen2(false);
    setDeleteId(null);
  };

  const [privileges, setPrivileges] = useState({});
  const [roleName, setRoleName] = useState(
    localStorage.getItem("role_name") || ""
  );
  const isAdmin = "admin";

  // Toggle status
  const handleChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const res_data = await updateprofessionalmasterStatus(id, newStatus);

      if (res_data.success === false) {
        toast.error(res_data.message || res_data.msg || "Failed to update status");
        return;
      }

      toast.success("Professional Master status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again!");
    }
  };

  // Fetch data
  const fetchData = async () => {
    try {
      const result = await getprofessionalmasters();
      setProfessionalmasterList(result.data || []);
    } catch (error) {
      console.error("Error fetching professional masters:", error);
      toast.error("Failed to load professional master data.");
    }
  };

  // Confirm delete
  const handleYesNo = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const data = await deleteprofessionalmaster(deleteId);

      if (data.success === false) {
        toast.error(data.message || data.msg || "Failed to delete professional master");
        return;
      }

      toast.success("Professional master deleted successfully");
      setProfessionalmasterList((prevItems) =>
        prevItems.filter((row) => row._id !== deleteId)
      );
      setModalOpen2(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting professional master:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Table columns WITHOUT image
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Created Date",
        accessor: "createdAt",
        Cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ row }) => {
          const isActive = row.original.status == 1;
          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row.original._id}`}
                checked={isActive}
                onChange={() =>
                  handleChange(row.original.status, row.original._id)
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
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {(isAdmin || privileges.professionmasterupdate === "1") && (
              <Link
                to={`/dashboard/update-professional/${row.original._id}`}
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>
            )}

            {(isAdmin || privileges.professionmasterdelete === "1") && (
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDelete(row.original._id)}
              >
                Delete
              </Button>
            )}
          </div>
        ),
      },
    ],
    [professionalmasterList, privileges, isAdmin]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Profession Master", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Profession Master"
            breadcrumbItems={breadcrumbItems}
          />
          
          {/* Add button */}
          {(isAdmin || privileges.professionmasteradd === "1") && (
            <div className="d-flex justify-content-end mb-2">
              <Link to="/dashboard/add-professional" className="btn btn-primary">
                Add Professional
              </Link>
            </div>
          )}

          {/* Table */}
          {isAdmin || privileges.professionmasterlist === "1" ? (
            <Card>
              <CardBody>
                <TableContainer
                  columns={columns}
                  data={professionalmasterList}
                  customPageSize={10}
                  isGlobalFilter={true}
                  setModalOpen={setModalOpen}
                  privileges={privileges}
                  isAdmin={isAdmin}
                />
              </CardBody>
            </Card>
          ) : (
            <p className="text-center text-danger mt-4">
              You do not have permission to view this list.
            </p>
          )}
        </Container>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={modalOpen2} toggle={() => setModalOpen2(false)}>
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete the record?
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
            <Button color="danger" onClick={handleYesNo}>
              Delete
            </Button>
            <Button color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default ProfessionalMasterList;