import { formatDate } from "../../utils/helper";
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
import { Edit, Trash2, Plus, Search, Pencil, Trash } from "lucide-react";
import {
  getprofessionalmasters,
  deleteprofessionalmaster,
  updateprofessionalmasterStatus,
} from "../../api/professionalmasterApi";
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
          <div className="d-flex justify-content-end">
            <Link
              to="/dashboard/add-professional"
              className="theme-btn bg-theme"
              style={{
                color: "white",
                borderRadius: "8px",
                padding: "10px 16px",
                border: "none",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
              }}
            >
              <Plus size={20} />
              Add Professional
            </Link>
          </div>
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
                  No professional masters found
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
              <Button
                color="light"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {"<<"}
              </Button>
              <Button
                color="light"
                onClick={previousPage}
                disabled={!canPreviousPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {"<"}
              </Button>

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

              <Button
                color="light"
                onClick={nextPage}
                disabled={!canNextPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {">"}
              </Button>
              <Button
                color="light"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                size="sm"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
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
// MAIN PROFESSIONAL MASTER LIST COMPONENT
// ========================================
const ProfessionalMasterList = () => {
  // ========== STATE ==========
  const [professionalmasterList, setProfessionalmasterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [roleName, setRoleName] = useState(
    localStorage.getItem("role_name") || ""
  );
  const isAdmin = roleName === "admin";

  // ========== API CALLS ==========
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getprofessionalmasters();
      const data = result?.data || result?.msg || result;

      if (Array.isArray(data)) {
        setProfessionalmasterList(data);
      } else {
        setProfessionalmasterList([]);
      }
    } catch (error) {
      console.error("Error fetching professional masters:", error);
      toast.error("Failed to load professional master data.");
      setProfessionalmasterList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    try {
      const response = await updateprofessionalmasterStatus(id, newStatus);
      const success = response?.success || response?.status;
      const message = response?.message || response?.msg;

      if (!success) {
        toast.error(message || "Failed to update status");
        return;
      }

      toast.success(message || "Professional Master status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
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
      const result = await deleteprofessionalmaster(deleteId);
      const success = result?.success || result?.status;
      const message = result?.message || result?.msg;

      if (success) {
        toast.success(message || "Professional master deleted successfully!");
        setProfessionalmasterList((prev) =>
          prev.filter((row) => row?._id !== deleteId)
        );
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(message || "Failed to delete professional master.");
      }
    } catch (error) {
      console.error("Error deleting professional master:", error);
      toast.error("Something went wrong while deleting.");
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

  // ========== TABLE COLUMNS ==========
  const columns = useMemo(
    () => [
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
        Header: "Professional Name",
        accessor: "name",
        Cell: ({ value }) => (
          <strong style={{ fontWeight: "500" }}>{value}</strong>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => {
          const isActive = row?.original?.status == 1;

          return (
            <div className="form-check form-switch">
              <input
                type="checkbox"
                className="form-check-input"
                id={`switch-${row?.original?._id}`}
                checked={isActive}
                onChange={() =>
                  handleStatusChange(
                    row?.original?.status,
                    row?.original?._id
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
      {
        Header: "Options",
        disableSortBy: true,
        Cell: ({ row }) => {
          const professional = row?.original;

          return (
            <div className="d-flex gap-2">
              {/* Edit Button */}
              <Link
                to={`/dashboard/update-professional/${professional?._id}`}
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

              {/* Delete Button */}
              <Button
                onClick={() => handleDeleteClick(professional?._id)}
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
                }}
              >
                <Trash size={20} color="#BA2526" />
              </Button>
            </div>
          );
        },
      },
    ],
    [professionalmasterList]
  );

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Profession Master", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Profession Master"
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
                  <p className="mt-2">Loading professional masters...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={professionalmasterList}
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
          title="Delete Professional Master"
          message="Are you sure you want to delete this professional master? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default ProfessionalMasterList;