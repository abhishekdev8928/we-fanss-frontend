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
import { Link, useParams } from "react-router-dom";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  getcustomoption,
  deletecustomoption,
  updatecustomoptionStatus,
} from "../../api/customoptionApi";
import { useNavigate } from "react-router-dom";
import { getCelebratyById } from "../../api/celebratyApi";

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
  id,
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
            {page.length > 0 ? (
              page.map((row) => {
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
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <div className="text-muted">
                    <i className="mdi mdi-information-outline me-2"></i>
                    No data available
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {page.length > 0 && (
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
  setModalOpen: PropTypes.func.isRequired,
};

// ✅ Main Component
const CustomOptionList = () => {
  const { id } = useParams();
  const celebrityId = id;
  const [customoptionList, setCustomOptionList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [celebrityName, setCelebrityName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Toggle status
  const handleChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const res_data = await updatecustomoptionStatus(id, newStatus);

      if (res_data.success === false) {
        toast.error(res_data.message || res_data.msg || "Failed to update status");
        return;
      }

      toast.success("CustomOption status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status. Please try again!");
    }
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getcustomoption(celebrityId);
      
      // Handle the nested data structure from API response
      if (result.success && result.data) {
        // Check if data is an array
        if (Array.isArray(result.data)) {
          setCustomOptionList(result.data);
        } else if (result.data.data && Array.isArray(result.data.data)) {
          // If data is nested inside another data property
          setCustomOptionList(result.data.data);
        } else {
          setCustomOptionList([]);
        }
      } else {
        setCustomOptionList([]);
      }

      console.log("Fetched data:", result);
    } catch (error) {
      console.error("Error fetching CustomOption:", error);
      toast.error("Failed to load CustomOption data.");
      setCustomOptionList([]);
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete
  const handleYesNo = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const data = await deletecustomoption(deleteId);

      if (data.success === false) {
        toast.error(data.message || data.msg || "Failed to delete CustomOption");
        return;
      }

      toast.success(data.message || "CustomOption deleted successfully");
      
      // Close modal first
      setModalOpen2(false);
      setDeleteId(null);
      
      // Refresh the entire list from server to get updated data
      await fetchData();
      
    } catch (error) {
      console.error("Error deleting CustomOption:", error);
      toast.error("Something went wrong.");
      setModalOpen2(false);
      setDeleteId(null);
    }
  };

  const fetchCelebrityName = async () => {
    try {
      const response = await getCelebratyById(celebrityId);
      if (response.msg?.name) {
        setCelebrityName(response.msg.name);
      } else if (response.data?.name) {
        setCelebrityName(response.data.name);
      } else {
        console.warn("No name found in response:", response);
      }
    } catch (err) {
      console.error("Error fetching celebrity:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCelebrityName();
  }, [celebrityId]);

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: (_row, i) => i + 1,
      },
      { 
        Header: "Created Date", 
        accessor: "createdAt",
        Cell: ({ value }) => {
          if (!value) return "-";
          return new Date(value).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      },
      { Header: "Title", accessor: "title" },
      {
        Header: "Status",
        accessor: "status",
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
        Header: "Option",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Link
              to={`/dashboard/update-customoption/${row.original._id}`}
              className="btn btn-primary btn-sm"
            >
              Edit
            </Link>
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
    []
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "CustomOption", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="CustomOption" breadcrumbItems={breadcrumbItems} />
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">
                  CustomOption List{" "}
                  {celebrityName && (
                    <span className="text-muted">— {celebrityName}</span>
                  )}
                </h4>

                <div className="d-flex gap-2">
                  <Link to={`/dashboard/add-customoption/${id}`} className="btn btn-primary">
                    + Add CustomOption
                  </Link>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/dashboard/celebrity-list")}
                  >
                    ← Back
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading data...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={customoptionList}
                  customPageSize={10}
                  isGlobalFilter={true}
                  setModalOpen={setModalOpen}
                  id={id}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* Modal for Delete Confirmation */}
        <Modal isOpen={modalOpen2} toggle={() => setModalOpen2(false)}>
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete this record?
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

export default CustomOptionList;