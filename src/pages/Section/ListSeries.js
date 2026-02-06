import React, { Fragment, useState, useEffect, useCallback } from "react";
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
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Search, Pencil, Trash, Plus } from "lucide-react";
import {
  getSeriesByCelebrity,
  deleteSeries,
  updateSeriesStatus,
} from "../../api/seriesApi";
import { getCelebratyById } from "../../api/celebratyApi";
import FixedSectionTab from "./FixedSectionTab";
import DeleteConfirmModal from "../../components/Modals/DeleteModal";

// ========================================
// GLOBAL FILTER COMPONENT
// ========================================
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows?.length || 0;
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
            setValue(e?.target?.value);
            onChange(e?.target?.value);
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
            onChange={(e) => setPageSize(Number(e?.target?.value))}
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
            globalFilter={state?.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}

        <Col md={6}>
          <div className="d-flex justify-content-end">
            {onAddClick && (
              <Button
                onClick={onAddClick}
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
                Add Series
              </Button>
            )}
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
            {headerGroups?.map((headerGroup) => (
              <tr {...headerGroup?.getHeaderGroupProps()} key={headerGroup?.id}>
                {headerGroup?.headers?.map((column) => (
                  <th
                    key={column?.id}
                    style={{
                      padding: "16px",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#666",
                      borderBottom: "none",
                    }}
                  >
                    <div {...column?.getSortByToggleProps()}>
                      {column?.render("Header")}
                      {column?.isSorted ? (
                        column?.isSortedDesc ? (
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
            {page?.length > 0 ? (
              page?.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row?.getRowProps()}
                    key={row?.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {row?.cells?.map((cell) => (
                      <td
                        {...cell?.getCellProps()}
                        key={cell?.column?.id}
                        style={{
                          padding: "16px",
                          fontSize: "14px",
                          color: "#333",
                        }}
                      >
                        {cell?.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns?.length} className="text-center py-4">
                  <i className="bx bx-info-circle me-2"></i>
                  No series found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* PAGINATION */}
      {page?.length > 0 && (
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
                onChange={(e) => gotoPage(Number(e?.target?.value))}
                style={{
                  width: "140px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
              >
                {pageOptions?.map((pageNum) => (
                  <option key={pageNum} value={pageNum}>
                    Page {pageNum + 1} of {pageOptions?.length}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                min={1}
                max={pageOptions?.length}
                style={{
                  width: "70px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "6px",
                  padding: "6px 12px",
                }}
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e?.target?.value ? Number(e?.target?.value) - 1 : 0;
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
  onAddClick: PropTypes.func,
};

// ========================================
// MAIN SERIES LIST COMPONENT
// ========================================
const SeriesList = () => {
  const { id } = useParams();
  const celebrityId = id;
  const navigate = useNavigate();

  // ========== STATE ==========
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [celebrityName, setCelebrityName] = useState("");

  // ========== API CALLS ==========
  const fetchSeries = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getSeriesByCelebrity(celebrityId);
      const dataArray = Array.isArray(result?.msg) ? result?.msg : [];
      setSeries(dataArray);
    } catch (error) {
      console.error("Error fetching series:", error);
      toast.error("Failed to load series");
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [celebrityId]);

  const fetchCelebrityName = useCallback(async () => {
    try {
      const response = await getCelebratyById(celebrityId);
      if (response?.msg?.name) {
        setCelebrityName(response?.msg?.name);
      }
    } catch (err) {
      console.error("Error fetching celebrity:", err);
    }
  }, [celebrityId]);

  // ✅ Update Status - OPTIMISTIC UI
  const handleStatusChange = async (currentStatus, id) => {
    if (!id) return;

    const newStatus = currentStatus == 1 ? 0 : 1;

    // Optimistic update
    setSeries((prev) =>
      prev?.map((item) =>
        item?._id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const res_data = await updateSeriesStatus(id, newStatus);

      if (res_data?.success === false) {
        // Revert on failure
        setSeries((prev) =>
          prev?.map((item) =>
            item?._id === id ? { ...item, status: currentStatus } : item
          )
        );
        toast.error(res_data?.msg || "Failed to update status");
      } else {
        toast.success("Series status updated successfully");
      }
    } catch (error) {
      // Revert on error
      setSeries((prev) =>
        prev?.map((item) =>
          item?._id === id ? { ...item, status: currentStatus } : item
        )
      );
      console.error("Error:", error);
      toast.error("Failed to update status");
    }
  };

  // ✅ Delete Series
  const handleDeleteClick = (id) => {
    if (!id) {
      toast.error("Invalid series ID");
      return;
    }
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete");
      return;
    }

    try {
      const result = await deleteSeries(deleteId);
      if (result?.status) {
        toast.success("Series deleted successfully");
        setSeries((prev) => prev?.filter((row) => row?._id !== deleteId));
        setDeleteModalOpen(false);
        setDeleteId(null);
      } else {
        toast.error(result?.msg || "Failed to delete series");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  // ✅ Handle Add
  const handleAdd = () => {
    navigate(`/dashboard/add-series/${id}`);
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    if (celebrityId) {
      fetchSeries();
      fetchCelebrityName();
    }
  }, [celebrityId, fetchSeries, fetchCelebrityName]);

  // ========== TABLE COLUMNS ==========
  const columns = [
    {
      Header: "No",
      accessor: (_row, i) => i + 1,
      disableSortBy: true,
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>
          {value || "N/A"}
        </strong>
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
                handleStatusChange(row?.original?.status, row?.original?._id)
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
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Link to={`/dashboard/update-series/${row?.original?._id}`}>
            <Button
              style={{
                backgroundColor: "#4285F41F",
                color: "#1E90FF",
                border: "none",
                borderRadius: "4px",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pencil size={20} strokeWidth="2" />
            </Button>
          </Link>

          <Button
            onClick={() => handleDeleteClick(row?.original?._id)}
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
      ),
    },
  ];

  // ========== BREADCRUMB ==========
  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Celebrity List", link: "/dashboard/celebrity-list" },
    { title: "Series", link: "#" },
  ];

  // ========== RENDER ==========
  return (
    <Fragment>
      <div className="page-content">
        <FixedSectionTab activeTabId="series" />
        <Container fluid>
          <Breadcrumbs
            title="Series"
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
              <div className="mb-4">
                <h4
                  className="mb-0"
                  style={{ fontSize: "20px", fontWeight: "600" }}
                >
                  Series List
                  {celebrityName && (
                    <span
                      className="ms-2"
                      style={{ color: "#999", fontWeight: "400" }}
                    >
                      — {celebrityName}
                    </span>
                  )}
                </h4>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading series...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={series}
                  customPageSize={10}
                  isGlobalFilter={true}
                  onAddClick={handleAdd}
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
          title="Delete Series"
          message="Are you sure you want to delete this series? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default SeriesList;