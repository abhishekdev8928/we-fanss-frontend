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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  getCelebraties,
  deleteCelebraty,
  updateCelebratyStatus,
} from "../../api/celebratyApi";
import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
import { usePrivilegeStore } from "../../config/store/privilegeStore";

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

// ========================================
// TABLE CONTAINER COMPONENT
// ========================================
const TableContainer = ({
  columns,
  data,
  customPageSize,
  className,
  isGlobalFilter,
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
      <Row className="mb-2">
        <Col md={2}>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
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
            resource={RESOURCES.CELEBRITY}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <Link to="/dashboard/add-celebrity" className="btn btn-primary">
                <i className="bx bx-plus me-1"></i>
                Add Celebrity
              </Link>
            </div>
          </PrivilegeAccess>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id}>
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
                  <i className="bx bx-info-circle me-2"></i>
                  No celebrities found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}
      {page.length > 0 && (
        <Row className="justify-content-md-end justify-content-center align-items-center mt-3">
          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                size="sm"
              >
                {"<<"}
              </Button>
              <Button
                color="primary"
                onClick={previousPage}
                disabled={!canPreviousPage}
                size="sm"
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
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </Col>

          <Col className="col-md-auto">
            <div className="d-flex gap-1">
              <Button
                color="primary"
                onClick={nextPage}
                disabled={!canNextPage}
                size="sm"
              >
                {">"}
              </Button>
              <Button
                color="primary"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                size="sm"
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
};

// ========================================
// MAIN CELEBRITY LIST COMPONENT
// ========================================
const CelebratyList = () => {
  // ========== STATE ==========
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { hasPermission } = usePrivilegeStore();

  // ========== HELPER FUNCTIONS ==========
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Check if celebrity has specific profession
  const hasProfession = (professions, professionName) => {
    if (!Array.isArray(professions)) return false;
    
    return professions.some((prof) => {
      const name = typeof prof === "object" ? prof.name : prof;
      return name?.toLowerCase() === professionName.toLowerCase();
    });
  };

  // ========== API CALLS ==========
  const fetchCelebrities = async () => {
    try {
      setLoading(true);
      const result = await getCelebraties();
      const data = result.data || result.msg || result;
      
      if (Array.isArray(data)) {
        setCelebrities(data);
      } else {
        setCelebrities([]);
      }
    } catch (error) {
      console.error("Error fetching celebrities:", error);
      toast.error("Failed to load celebrities.");
      setCelebrities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    
    try {
      const response = await updateCelebratyStatus(id, newStatus);
      const success = response.success || response.status;
      const message = response.message || response.msg;
      
      if (!success) {
        toast.error(message || "Failed to update status");
        return;
      }
      
      toast.success(message || "Celebrity status updated successfully");
      fetchCelebrities();
    } catch (error) {
      toast.error("Error updating status. Please try again!");
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
      const result = await deleteCelebraty(deleteId);
      const success = result.success || result.status;
      const message = result.message || result.msg;
      
      if (success) {
        toast.success(message || "Celebrity deleted successfully!");
        setCelebrities((prev) => prev.filter((row) => row._id !== deleteId));
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(message || "Failed to delete celebrity.");
      }
    } catch (error) {
      toast.error("Something went wrong while deleting.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchCelebrities();
  }, []);

  // ========== PERMISSIONS ==========
  const canEdit = hasPermission(RESOURCES.CELEBRITY, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.CELEBRITY, OPERATIONS.DELETE);
  const hasAnyAction = canEdit || canDelete;

  // ========== TABLE COLUMNS ==========
  const columns = [
    {
      Header: "No.",
      accessor: (_row, i) => i + 1,
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Celebrity Name",
      accessor: "name",
      Cell: ({ value }) => <strong>{value}</strong>,
    },
    {
      Header: "Sections",
      disableSortBy: true,
      Cell: ({ row }) => {
        const sections = row.original.sections || [];

        if (sections.length === 0) {
          return <span className="text-muted">—</span>;
        }

        return (
          <div className="d-flex flex-wrap gap-1">
            {sections.map((section, idx) => {
              const sectionId = typeof section === "object" ? section._id : section;
              const sectionName = typeof section === "object" ? section.name : sectionId;

              return (
                <Link
                  key={idx}
                  to={`/dashboard/section-template-list/${row.original._id}/${sectionId}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  <i className="bx bx-list-ul me-1"></i>
                  {sectionName}
                </Link>
              );
            })}
          </div>
        );
      },
    },
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
              onChange={() => handleStatusChange(row.original.status, row.original._id)}
            />
            <label
              className="form-check-label"
              htmlFor={`switch-${row.original._id}`}
            >
              {isActive ? (
                <Badge color="success">Active</Badge>
              ) : (
                <Badge color="secondary">Inactive</Badge>
              )}
            </label>
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
        const celebrity = row.original;
        const professions = celebrity.professions || [];
        
        // ✅ Check profession using helper function
        const isActor = hasProfession(professions, "actor");
        const isPolitician = hasProfession(professions, "politician");

        return (
          <div className="d-flex gap-2 flex-wrap">
            {/* ========== CRUD BUTTONS ========== */}
            <PrivilegeAccess resource={RESOURCES.CELEBRITY} action={OPERATIONS.EDIT}>
              <Link
                to={`/dashboard/update-celebrity/${celebrity._id}`}
                className="btn btn-primary btn-sm"
              >
                <i className="bx bx-edit me-1"></i>Edit
              </Link>
            </PrivilegeAccess>

            <PrivilegeAccess resource={RESOURCES.CELEBRITY} action={OPERATIONS.DELETE}>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDeleteClick(celebrity._id)}
              >
                <i className="bx bx-trash me-1"></i>Delete
              </Button>
            </PrivilegeAccess>

            {/* ========== COMMON BUTTONS ========== */}
            <Link
              to={`/dashboard/timeline-list/${celebrity._id}`}
              className="btn btn-dark btn-sm"
            >
              <i className="bx bx-time me-1"></i>Timeline
            </Link>

            <Link
              to={`/dashboard/triviaentries-list/${celebrity._id}`}
              className="btn btn-outline-dark btn-sm"
            >
              <i className="bx bx-bulb me-1"></i>Trivia
            </Link>

            <Link
              to={`/dashboard/customoption-list/${celebrity._id}`}
              className="btn btn-dark btn-sm"
            >
              <i className="bx bx-customize me-1"></i>Custom
            </Link>

            <Link
              to={`/dashboard/references-list/${celebrity._id}`}
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="bx bx-link-alt me-1"></i>References
            </Link>

            <Link
              to={`/dashboard/related-personalities-list/${celebrity._id}`}
              className="btn btn-secondary btn-sm"
            >
              <i className="bx bx-group me-1"></i>Related Personalities
            </Link>

            {/* ========== ACTOR-SPECIFIC BUTTONS ========== */}
            {isActor && (
              <>
                <Link
                  to={`/dashboard/list-movie/${celebrity._id}`}
                  className="btn btn-success btn-sm"
                >
                  <i className="bx bx-movie me-1"></i>Movie
                </Link>
                <Link
                  to={`/dashboard/list-series/${celebrity._id}`}
                  className="btn btn-warning btn-sm"
                >
                  <i className="bx bx-tv me-1"></i>Series
                </Link>
              </>
            )}

            {/* ========== POLITICIAN-SPECIFIC BUTTONS ========== */}
            {isPolitician && (
              <>
                <Link
                  to={`/dashboard/list-election/${celebrity._id}`}
                  className="btn btn-info btn-sm"
                >
                  <i className="bx bx-vote me-1"></i>Election
                </Link>
                <Link
                  to={`/dashboard/list-positions/${celebrity._id}`}
                  className="btn btn-secondary btn-sm"
                >
                  <i className="bx bx-briefcase me-1"></i>Positions
                </Link>
              </>
            )}
          </div>
        );
      },
    });
  }

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Celebrity List", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Celebrity List" breadcrumbItems={breadcrumbItems} />
          
          <Card>
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading celebrities...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={celebrities}
                  customPageSize={10}
                  isGlobalFilter={true}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ========== DELETE CONFIRMATION MODAL ========== */}
        <Modal isOpen={deleteModalOpen} toggle={handleDeleteCancel} centered>
          <ModalHeader toggle={handleDeleteCancel}>Confirm Deletion</ModalHeader>
          <ModalBody className="text-center py-4">
            <img
              src={deleteimg}
              alt="Delete Confirmation"
              width="150"
              className="mb-3"
            />
            <h5 className="mb-3">
              Are you sure you want to delete this celebrity?
            </h5>
            <p className="text-muted">
              This action will permanently delete all related data including
              movies, series, elections, positions, timeline, and trivia entries.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={handleDeleteConfirm}>
              <i className="bx bx-trash me-1"></i>Yes, Delete
            </Button>
            <Button color="secondary" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default CelebratyList;