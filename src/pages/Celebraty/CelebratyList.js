import React, { Fragment, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Container,
  Table,
  Row,
  Col,
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
import { toast } from "react-toastify";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
  getCelebraties,
  deleteCelebraty,
  updateCelebratyStatus,
} from "../../api/celebratyApi";
import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
import { usePrivilegeStore } from "../../config/store/privilegeStore";
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
          placeholder="Search record..."
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
          <PrivilegeAccess
            resource={RESOURCES.CELEBRITY}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <Link
                to="/dashboard/add-celebrity"
                className="theme-btn bg-theme"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={20} />
                Add Celebrity
              </Link>
            </div>
          </PrivilegeAccess>
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
                  No celebrities found
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
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
      Header: "No",
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
      Cell: ({ value }) => <strong style={{ fontWeight: "500" }}>{value}</strong>,
    },
    {
      Header: "Sections",
      disableSortBy: true,
      Cell: ({ row }) => {
        const celebrity = row.original;

        return (
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {/* Fixed Button */}
            <Link
              to={`/dashboard/timeline-list/${celebrity._id}`}
              style={{
                backgroundColor: "#F5F5F5",
                color: "#333",
                borderRadius: "100px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Fixed
            </Link>

            {/* Profession Link */}
            <Link
              to={`/dashboard/section-template-list/${celebrity._id}`}
              style={{
                backgroundColor: "#4285F40D",
                color: "#4285F4",
                borderRadius: "100px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Profession
            </Link>

            {/* Custom Button */}
            <Link
              to={`/dashboard/customoption-list/${celebrity._id}`}
              className="theme-btn bg-theme"
              style={{
                color: "white",
                borderRadius: "100px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Custom
            </Link>
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
  ];

  // ========== OPTIONS COLUMN ==========
  if (hasAnyAction) {
    columns.push({
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => {
        const celebrity = row.original;

        return (
          <div className="d-flex gap-2">
            {/* Edit Button */}
            <PrivilegeAccess resource={RESOURCES.CELEBRITY} action={OPERATIONS.EDIT}>
              <Link
                to={`/dashboard/update-celebrity/${celebrity._id}`}
                className="theme-edit-btn"
                style={{
                  backgroundColor: "#4285F41F",
                  color: "#1E90FF",
                  border: "none",
                  borderRadius: "6px",
                  width: "40px",
                  height: "40px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pencil size={20} strokeWidth="2" />
              </Link>
            </PrivilegeAccess>

            {/* Delete Button */}
            <PrivilegeAccess resource={RESOURCES.CELEBRITY} action={OPERATIONS.DELETE}>
              <button
                onClick={() => handleDeleteClick(celebrity._id)}
                className="theme-delete-btn"
                style={{
                  backgroundColor: "#FFE5E5",
                  color: "#FF5555",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <Trash size={20} color="#BA2526" />
              </button>
            </PrivilegeAccess>
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
          <Breadcrumbs title="Celebrities List" breadcrumbItems={breadcrumbItems} />

          <Card style={{ border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", borderRadius: "12px" }}>
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
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Celebrity"
          message="This action will permanently delete all related data including movies, series, elections, positions, timeline, and trivia entries."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default CelebratyList;