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
  Label,
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
import { toast } from "react-toastify";
import Select from "react-select";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
  fetchSectionTemplate,
  addSectionTemplate,
  updateSectionTemplate,
  deleteSectionTemplate,
  getSectionTemplateById,
  updateSectionTemplateStatus,
  getSectionsOptions,
} from "../../api/SectionTemplateApi";
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
            resource={RESOURCES.SECTION_TEMPLATE}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <button
                onClick={() => setModalOpen(true)}
                className="theme-btn bg-theme"
              >
                <Plus size={20} />
                Add Section Template
              </button>
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
                  No section templates found
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
  setModalOpen: PropTypes.func.isRequired,
};

// ========================================
// MAIN SECTION TEMPLATE LIST COMPONENT
// ========================================
const SectionTemplateList = () => {
  const [sectionTemplate, setSectionTemplate] = useState({
    title: "",
    sections: [],
  });

  const [templateList, setTemplateList] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [sectionsOptions, setSectionsOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { hasPermission } = usePrivilegeStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchSectionTemplate();
      setTemplateList(result.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load section templates.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsOptionsList = async () => {
    try {
      const result = await getSectionsOptions();
      const options = (result.data || []).map((item) => ({
        value: item._id,
        label: (item.name && item.name.trim()) || item.name,
      }));
      setSectionsOptions(options);
    } catch (error) {
      console.error("Error fetching sections options:", error);
      toast.error("Failed to load sections options.");
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    try {
      const result = await updateSectionTemplateStatus(id, newStatus);
      toast.success(result.message || "Status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleEdit = async (id) => {
    try {
      const result = await getSectionTemplateById(id);
      const templateData = result.data;

      setSectionTemplate({
        title: templateData.title || "",
        sections: templateData.sections
          ? templateData.sections.map((sec) => sec._id || sec)
          : [],
      });

      setEditId(templateData._id);
      setIsAddEditModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to load section template data");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return toast.error("No ID to delete.");
    try {
      const result = await deleteSectionTemplate(deleteId);
      toast.success(result.message || "Deleted successfully");
      setDeleteModalOpen(false);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSectionTemplate({ ...sectionTemplate, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleAddEditModalClose = () => {
    setIsAddEditModalOpen(false);
    setEditId(null);
    setSectionTemplate({ title: "", sections: [] });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!sectionTemplate.title) {
      newErrors.title = "Title is required";
    }
    if (!sectionTemplate.sections || sectionTemplate.sections.length === 0) {
      newErrors.sections = "At least one section must be selected";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        title: sectionTemplate.title,
        sections: sectionTemplate.sections,
      };

      let response;

      if (editId) {
        response = await updateSectionTemplate(editId, payload);
      } else {
        response = await addSectionTemplate(payload);
      }

      if (!response.success) {
        const errorMsg =
          response.message || (response.error && response.error.message) || "Operation failed";

        if (errorMsg.toLowerCase().includes("already exist")) {
          setErrors({ title: errorMsg });
        }

        toast.error(errorMsg);
        return;
      }

      toast.success(
        response.message ||
          (editId ? "Updated successfully" : "Added successfully")
      );

      handleAddEditModalClose();
      setSectionTemplate({ title: "", sections: [] });
      setErrors({});
      fetchData();
    } catch (error) {
      console.error("Add/Update Section Template Error:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  const canEdit = hasPermission(RESOURCES.SECTION_TEMPLATE, OPERATIONS.EDIT);
  const canDelete = hasPermission(
    RESOURCES.SECTION_TEMPLATE,
    OPERATIONS.DELETE
  );
  const hasAnyAction = canEdit || canDelete;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
      Header: "Title",
      accessor: "title",
      Cell: ({ value }) => (
        <strong style={{ fontWeight: "500" }}>{value}</strong>
      ),
    },
    {
      Header: "Sections",
      accessor: "sections",
      disableSortBy: true,
      Cell: ({ value }) => {
        const count = Array.isArray(value) ? value.length : 0;
        return (
          <span
            className="badge"
            style={{
              backgroundColor: "#E8F5E9",
              color: "#2E7D32",
              padding: "6px 12px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            {count} {count === 1 ? "section" : "sections"}
          </span>
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
              onChange={() =>
                handleStatusChange(row.original.status, row.original._id)
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

  if (hasAnyAction) {
    columns.push({
      Header: "Options",
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <PrivilegeAccess
            resource={RESOURCES.SECTION_TEMPLATE}
            action={OPERATIONS.EDIT}
          >
            <button
              onClick={() => handleEdit(row.original._id)}
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
                cursor: "pointer",
              }}
            >
              <Pencil size={20} strokeWidth="2" />
            </button>
          </PrivilegeAccess>

          <PrivilegeAccess
            resource={RESOURCES.SECTION_TEMPLATE}
            action={OPERATIONS.DELETE}
          >
            <button
              onClick={() => handleDeleteClick(row.original._id)}
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
      ),
    });
  }

  useEffect(() => {
    fetchData();
    fetchSectionsOptionsList();
  }, []);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Section Template", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Section Template List"
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
                  <p className="mt-2">Loading section templates...</p>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={templateList}
                  customPageSize={10}
                  isGlobalFilter={true}
                  setModalOpen={setIsAddEditModalOpen}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ADD / EDIT MODAL */}
        <Modal
          isOpen={isAddEditModalOpen}
          toggle={() => setIsAddEditModalOpen(!isAddEditModalOpen)}
          size="md"
        >
          <ModalHeader
            toggle={() => setIsAddEditModalOpen(!isAddEditModalOpen)}
          >
            {!editId ? "Add" : "Edit"} Section Template
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <div className="mb-3">
                <Label>
                  Title <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  value={sectionTemplate.title || ""}
                  onChange={handleInputChange}
                  name="title"
                  placeholder="Enter template title"
                  className={errors.title ? "is-invalid" : ""}
                  style={{
                    borderRadius: "8px",
                    padding: "10px 16px",
                  }}
                />
                {errors.title && (
                  <div className="invalid-feedback d-block">
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <Label>
                  Select Sections <span className="text-danger">*</span>
                </Label>
                <Select
                  isMulti
                  name="sections"
                  options={sectionsOptions}
                  value={sectionsOptions.filter((opt) =>
                    (sectionTemplate.sections || []).includes(opt.value)
                  )}
                  onChange={(selectedOptions) =>
                    setSectionTemplate((prev) => ({
                      ...prev,
                      sections: selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [],
                    }))
                  }
                  placeholder="Choose sections..."
                />
                {errors.sections && (
                  <div className="text-danger mt-1" style={{ fontSize: "0.875rem" }}>
                    {errors.sections}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <button
                type="submit"
                className="theme-btn bg-theme"
                style={{
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 20px",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {!editId ? "Add" : "Update"}
              </button>
              <button
                type="button"
                onClick={handleAddEditModalClose}
                style={{
                  borderRadius: "8px",
                  padding: "8px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </ModalFooter>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          toggle={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Section Template"
          message="Are you sure you want to delete this section template? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          confirmColor="danger"
        />
      </div>
    </Fragment>
  );
};

export default SectionTemplateList;