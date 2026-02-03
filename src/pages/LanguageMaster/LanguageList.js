import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
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
  Alert,
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  fetchLanguage,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  getLanguageById,
  updateLanguageStatus,
} from "../../api/LanguageApi";
import { usePrivilegeStore } from "../../config/store/privilegeStore";

// ================= GLOBAL FILTER ==================
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
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


const LanguageMasterList = () => {
  const [language, setLanguage] = useState({ name: "", code: "" });
  const [categorylist, setcategorylist] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [itemIdToEdit, setItemIdToEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const { hasPermission } = usePrivilegeStore();

  // ================= FETCH DATA =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchLanguage();
      
      if (response?.success) {
        setcategorylist(response.data || []);
      } else {
        setcategorylist([]);
        toast.error(response?.message || "Failed to load languages");
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      setcategorylist([]);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load languages";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS CHANGE =================
  const handleChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    
    try {
      const response = await updateLanguageStatus(id, newStatus);
      
      if (response?.success) {
        toast.success(response.message || "Status updated successfully");
        await fetchData();
      } else {
        toast.error(response?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update status";
      toast.error(errorMessage);
    }
  };

  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const response = await getLanguageById(id);
      
      if (response?.success && response?.data) {
        setLanguage({ 
          name: response.data.name || "", 
          code: response.data.code || ""
        });
        setItemIdToEdit(response.data._id);
        setModalOpen(true);
      } else {
        toast.error(response?.message || "Failed to load language data");
      }
    } catch (error) {
      console.error("Error fetching language by ID:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to load language data";
      toast.error(errorMessage);
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await deleteLanguage(deleteId);
      
      if (response?.success) {
        toast.success(response.message || "Language deleted successfully");
        setDeleteId(null);
        await fetchData();
      } else {
        toast.error(response?.message || "Failed to delete language");
      }
    } catch (error) {
      console.error("Error deleting language:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete language";
      toast.error(errorMessage);
    }
  };

  // ================= ADD / UPDATE =================
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!language.name?.trim()) newErrors.name = "Name is required";
    if (!language.code?.trim()) newErrors.code = "Code is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        name: language.name.trim(),
        code: language.code.trim(),
      };

      const response = itemIdToEdit 
        ? await updateLanguage(itemIdToEdit, payload)
        : await addLanguage(payload);

      if (response?.success) {
        const successMessage = response.message || (itemIdToEdit ? "Language updated successfully" : "Language added successfully");
        toast.success(successMessage);
        setLanguage({ name: "", code: "" });
        setErrors({});
        setItemIdToEdit(null);
        setModalOpen(false);
        await fetchData();
      } else {
        toast.error(response?.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving language:", error);
      
      // Handle backend validation errors
      if (error?.response?.data?.error?.details) {
        const backendErrors = {};
        error.response.data.error.details.forEach(detail => {
          backendErrors[detail.field] = detail.message;
        });
        setErrors(backendErrors);
      }
      
      const errorMessage = error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
    }
  };

  // ================= MODAL HANDLERS =================
  const handleModalClose = () => {
    setModalOpen(false);
    setLanguage({ name: "", code: "" });
    setErrors({});
    setItemIdToEdit(null);
  };

  const handleModalOpen = () => {
    setLanguage({ name: "", code: "" });
    setErrors({});
    setItemIdToEdit(null);
    setModalOpen(true);
  };

  // ================= TABLE COLUMNS =================
  const getTableColumns = () => {
    const canEdit = hasPermission(RESOURCES.LANGUAGE, OPERATIONS.EDIT);
    const canDelete = hasPermission(RESOURCES.LANGUAGE, OPERATIONS.DELETE);
    const hasAnyAction = canEdit || canDelete;

    const baseColumns = [
      { 
        Header: "No.", 
        accessor: (_row, i) => i + 1,
        disableSortBy: true,
      },
      { 
        Header: "Created Date", 
        accessor: "createdAt",
        Cell: ({ value }) => {
          if (!value) return "-";
          return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        },
      },
      { Header: "Name", accessor: "name" },
      { Header: "Code", accessor: "code" },
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
    ];

    if (hasAnyAction) {
      baseColumns.push({
        Header: "Option",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <PrivilegeAccess resource={RESOURCES.LANGUAGE} action={OPERATIONS.EDIT}>
              <Button
                color="primary"
                onClick={() => handleEdit(row.original._id)}
                size="sm"
              >
                Edit
              </Button>
            </PrivilegeAccess>

            <PrivilegeAccess resource={RESOURCES.LANGUAGE} action={OPERATIONS.DELETE}>
              <Button
                color="danger"
                size="sm"
                onClick={() => handleDelete(row.original._id)}
              >
                Delete
              </Button>
            </PrivilegeAccess>
          </div>
        ),
      });
    }

    return baseColumns;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Language Master", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Language Master"
            breadcrumbItems={breadcrumbItems}
          />

          <PrivilegeAccess resource={RESOURCES.LANGUAGE} action={OPERATIONS.ADD}>
            <div className="d-flex justify-content-end mb-2">
              <Button color="primary" onClick={handleModalOpen}>
                Add Language
              </Button>
            </div>
          </PrivilegeAccess>

          <Card>
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading languages...</p>
                </div>
              ) : (
                <TableContainer
                  columns={getTableColumns()}
                  data={categorylist}
                  customPageSize={10}
                  isGlobalFilter={true}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ADD / EDIT MODAL */}
        <Modal isOpen={modalOpen} toggle={handleModalClose}>
          <ModalHeader toggle={handleModalClose}>
            {!itemIdToEdit ? "Add" : "Edit"} Language
          </ModalHeader>
          <form onSubmit={handleAddSubmit}>
            <ModalBody>
              <div className="mb-3">
                <Input
                  type="text"
                  value={language.name || ""}
                  onChange={(e) => {
                    setLanguage({ ...language, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  name="name"
                  placeholder="Language Name"
                  className={errors.name ? "is-invalid" : ""}
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <Input
                  type="text"
                  value={language.code || ""}
                  onChange={(e) => {
                    setLanguage({ ...language, code: e.target.value });
                    setErrors({ ...errors, code: "" });
                  }}
                  name="code"
                  placeholder="Language Code (e.g., EN, HI)"
                  className={errors.code ? "is-invalid" : ""}
                />
                {errors.code && (
                  <div className="invalid-feedback d-block">{errors.code}</div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                {!itemIdToEdit ? "Add" : "Update"}
              </Button>
              <Button color="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <Modal isOpen={!!deleteId} toggle={() => setDeleteId(null)}>
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
            <Button color="danger" onClick={confirmDelete}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default LanguageMasterList;