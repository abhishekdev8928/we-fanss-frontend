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
  getsectionmaster,
  deletesectionmaster,
  updatesectionmasterStatus,
} from "../../api/sectionmasterApi";
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
    usePagination
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
            resource={RESOURCES.SECTION_TYPE}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <Link
                to="/dashboard/add-sectionmaster"
                className="theme-btn bg-theme"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={20} />
                Add Section
              </Link>
            </div>
          </PrivilegeAccess>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="table-responsive react-table">
        <Table
          {...getTableProps()}
          className={className}
          style={{ borderCollapse: "separate", borderSpacing: "0" }}
        >
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
                  No sections found
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
// MAIN SECTION MASTER LIST COMPONENT
// ========================================
const SectionMasterList = () => {
  // ========== STATE ==========
  const [sectionMasterList, setSectionMasterList] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getsectionmaster();
      const data = result.data || result.msg || result;

      if (Array.isArray(data)) {
        setSectionMasterList(data);
      } else {
        setSectionMasterList([]);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message ||
        error.message ||
        "Failed to load section masters.";
      toast.error(errorMessage);
      setSectionMasterList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const result = await updatesectionmasterStatus(id, newStatus);
      const success = result.success || result.status;
      const message = result.message || result.msg;

      if (!success) {
        toast.error(message || "Failed to update status");
        return;
      }

      toast.success(message || "Status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message ||
        error.message ||
        "Failed to update status";
      toast.error(errorMessage);
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
      const result = await deletesectionmaster(deleteId);
      const success = result.success || result.status;
      const message = result.message || result.msg;

      if (success) {
        toast.success(message || "Section deleted successfully");
        setDeleteModalOpen(false);
        setDeleteId(null);
        fetchData();
      } else {
        toast.error(message || "Failed to delete section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message ||
        error.message ||
        "Failed to delete section";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    fetchData();
  }, []);

  // ========== PERMISSIONS ==========
  const canEdit = hasPermission(RESOURCES.SECTION_TYPE, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.SECTION_TYPE, OPERATIONS.DELETE);
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
      Header: "Section Name",
      accessor: "name",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>{value}</strong>
      ),
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
              onChange={() =>
                handleStatusChange(
                  row.original.status,
                  row.original._id
                )
              }
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
        const sectionItem = row.original;

        return (
          <div className="d-flex gap-2">
            {/* Edit Button */}
            <PrivilegeAccess
              resource={RESOURCES.SECTION_TYPE}
              action={OPERATIONS.EDIT}
            >
              <Link
                to={`/dashboard/update-sectionmaster/${sectionItem._id}`}
                className="theme-edit-btn"
                style={{
                  backgroundColor: "#4285F41F",
                  color: "#1E90FF",
                  border: "none",
                  borderRadius: "6px",
                  width: "40px",
                  height: "40px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <Pencil size={20} strokeWidth="2" />
              </Link>
            </PrivilegeAccess>

            {/* Delete Button */}
            <PrivilegeAccess
              resource={RESOURCES.SECTION_TYPE}
              action={OPERATIONS.DELETE}
            >
              <button
                onClick={() => handleDeleteClick(sectionItem._id)}
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
    { title: "Section Type Master", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Section Type Master List"
            breadcrumbItems={breadcrumbItems}
          />

          <Card
            style={{
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading sections...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={sectionMasterList}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={() => {}}
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
          title="Delete Section"
          message="Are you sure you want to delete this section? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default SectionMasterList;