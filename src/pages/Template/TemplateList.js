import React, { useEffect, useState, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  Row,
  Col,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getSectionData, deleteTemplateData } from "../../api/TemplateApi";
import { toast } from "react-toastify";
import ProfessionSectionTab from "../Section/ProfessionSectionTab";
import { Plus, Pencil, Trash, Search } from "lucide-react";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
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
  addButtonText,
  addButtonLink,
  showAddButton,
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

        {showAddButton && (
          <Col md={6}>
            <div className="d-flex justify-content-end">
              <Link
                to={addButtonLink}
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
                  textDecoration: "none",
                }}
              >
                <Plus size={20} />
                {addButtonText}
              </Link>
            </div>
          </Col>
        )}
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
                  No data found
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

const SectionTemplateList = () => {
  const { celebId } = useParams();
  const celebrityId = celebId;

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentSectionMasterId, setCurrentSectionMasterId] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${process.env.REACT_APP_API_BASE_URL}${imagePath}`;
  };

  const fetchSection = async (sectionMasterId) => {
    if (!sectionMasterId) {
      console.log("No sectionMasterId provided, skipping fetch");
      return;
    }

    try {
      setLoading(true);
      const res = await getSectionData(celebrityId, sectionMasterId);

      if (res?.success) {
        setSection(res);
      } else {
        toast.error(res?.msg || "Failed to load section data");
        setSection(null);
      }
    } catch (err) {
      console.error("Error fetching section:", err);
      toast.error("Error fetching section data");
      setSection(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSectionMasterId) {
      fetchSection(currentSectionMasterId);
    }
  }, [currentSectionMasterId]);

  const handleSectionChange = (sectionMasterId) => {
    setCurrentSectionMasterId(sectionMasterId);
  };

  const handleDeleteClick = (dataId) => {
    setDeleteId(dataId);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete.");
      return;
    }

    try {
      const result = await deleteTemplateData(
        celebrityId,
        section?.sectionName?.toLowerCase() || "",
        deleteId
      );

      if (result?.success) {
        toast.success("Data deleted successfully!");
        setDeleteModalOpen(false);
        setDeleteId(null);
        fetchSection(currentSectionMasterId);
      } else {
        toast.error(result?.msg || "Failed to delete data");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting data");
    }
  };

  // ✅ SIMPLE FUNCTION - NO useMemo
  const getColumns = () => {
    if (!section || !section.fields) return [];

    const cols = [
      {
        Header: "No",
        accessor: (_row, i) => i + 1,
        disableSortBy: true,
      },
    ];

    // Add field columns
    section.fields.forEach((field) => {
      cols.push({
        Header: field.title,
        accessor: field.title,
        Cell: ({ value, row }) => {
          const f = field;

          if (f.type === "media" && value) {
            const imageUrl = getImageUrl(value);
            return imageUrl ? (
              <img
                src={imageUrl}
                alt={f.title || "Image"}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                }}
                onError={(e) => {
                  e.target.src = "/default-image.png";
                  e.target.onerror = null;
                }}
              />
            ) : (
              <span className="text-muted">No image</span>
            );
          }

          // ✅ SIMPLE FIX - Rich text ko 300 characters limit
          if (f.type === "rich_text" && value) {
            const plainText = value.replace(/<[^>]*>/g, ""); // Remove HTML tags
            const displayText = plainText.length > 300 
              ? plainText.substring(0, 300) + "..." 
              : plainText;
            
            return <span>{displayText}</span>;
          }

          if (f.type === "Multiple Select" && Array.isArray(value)) {
            return value.join(", ");
          }

          if (f.type === "Single Select" && f.options?.length) {
            const option = f.options.find((o) => o?._id === value);
            return option?.label || "";
          }

          return value || "-";
        },
      });
    });

    // Add Options column
    cols.push({
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => {
        const rowData = row.original;

        return (
          <div className="d-flex gap-2">
            {/* Edit Button */}
            <Link
              to={`/dashboard/section-template-edit/${celebrityId}/${currentSectionMasterId}/${rowData?._id}`}
              style={{
                backgroundColor: "#4285F41F",
                color: "#1E90FF",
                border: "none",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <Pencil size={20} strokeWidth="2" />
            </Link>

            {/* Delete Button */}
            <Button
              onClick={() => handleDeleteClick(rowData?._id)}
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
    });

    return cols;
  };

  const shouldShowAddButton = () => {
    if (!section) return false;
    
    if (section.isRepeater === true) {
      return true;
    }
    
    if (section.isRepeater === false) {
      return (section.data || []).length === 0;
    }
    
    return true;
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Section Templates", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <ProfessionSectionTab
          celebId={celebrityId}
          onSectionChange={handleSectionChange}
        />

        <Container fluid>
          <Card
            style={{
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
          >
            <CardBody>
              {!currentSectionMasterId ? (
                <div className="text-center py-5">
                  <i className="bx bx-info-circle me-2"></i>
                  <p className="text-muted">
                    Please select a section from the tabs above
                  </p>
                </div>
              ) : loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading section data...</p>
                </div>
              ) : !section ? (
                <div className="text-center py-5">
                  <i className="bx bx-info-circle me-2"></i>
                  <p className="text-muted">No data found for this section</p>
                </div>
              ) : (
                <TableContainer
                  columns={getColumns()} // ✅ NO useMemo - simple function call
                  data={section?.data || []}
                  customPageSize={10}
                  isGlobalFilter={true}
                  showAddButton={shouldShowAddButton()}
                  addButtonText={`Add ${section?.sectionName || "Item"}`}
                  addButtonLink={`/dashboard/section-template-view/${celebrityId}/${currentSectionMasterId}`}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${section?.sectionName || "Item"}`}
          message="Are you sure you want to delete this record? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default SectionTemplateList;