import React, { useMemo, Fragment, useState, useEffect, useCallback } from "react";
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
  ModalHeader,
  Label,
  FormGroup,
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
import { useParams, useNavigate } from "react-router-dom";
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  getAllReferences,
  createReference,
  getReferenceById,
  updateReference,
  updateReferenceStatus,
  deleteReference,
} from "../../api/referencesApi";
import { createReferenceSchema, updateReferenceSchema } from "../../schemas/reference.schema";
import { validateForm } from "../../utils/validateForm";
import FixedSectionTab from "../Section/FixedSectionTab";
import { Link } from "react-router-dom";

// 🔍 Global Search Filter
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
};

const ReferencesList = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [references, setReferences] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { celebrityId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "",
  });
  const [errors, setErrors] = useState({});

  // ✅ Fetch References - NO LAG VERSION
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await getAllReferences(celebrityId);
      const dataArray = Array.isArray(result?.data) ? result.data : [];
      setReferences(dataArray);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load references");
      setReferences([]);
    } finally {
      setIsFetching(false);
    }
  }, [celebrityId]);

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ✅ Validate Form
  const validateFormData = () => {
    const schema = editId ? updateReferenceSchema : createReferenceSchema;
    const dataToValidate = editId ? formData : { ...formData, celebrityId };
    const validation = validateForm(schema, dataToValidate);

    if (!validation.success) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});
    return true;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        celebrity: celebrityId,
      };

      if (editId) {
        const response = await updateReference(editId, payload);
        if (response?.success === false) {
          toast.error(response.msg || "Failed to update reference");
          return;
        }
        toast.success("Reference updated successfully");
      } else {
        const response = await createReference(payload);
        if (response?.success === false) {
          toast.error(response.msg || "Failed to create reference");
          return;
        }
        toast.success("Reference created successfully");
      }

      setIsAddEditModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      type: "",
    });
    setErrors({});
    setEditId(null);
  };

  // ✅ Handle Add
  const handleAdd = () => {
    resetForm();
    setIsAddEditModalOpen(true);
  };

  // ✅ Handle Edit - FIXED FOR YOUR API RESPONSE
  const handleEdit = async (id) => {
    if (!id) {
      toast.error("Invalid reference ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getReferenceById(id);

      // Your API returns: { success: true, message: "...", data: { reference: {...} } }
      const referenceData = response?.data?.reference || response?.data || response?.msg || response;

      if (referenceData && typeof referenceData === 'object') {
        setFormData({
          title: referenceData.title || "",
          url: referenceData.url || "",
          type: referenceData.type || "",
        });
        setEditId(id);
        setIsAddEditModalOpen(true);
      } else {
        toast.error("Failed to load reference");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load reference");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update Status - OPTIMISTIC UI
  const handleStatusChange = async (currentStatus, id) => {
    if (!id) return;

    const newStatus = currentStatus == 1 ? 0 : 1;
    
    // Optimistic update
    setReferences(prev => 
      prev.map(ref => 
        ref._id === id ? { ...ref, status: newStatus } : ref
      )
    );

    try {
      const res_data = await updateReferenceStatus(id, newStatus);
      if (res_data?.success === false) {
        // Revert on failure
        setReferences(prev => 
          prev.map(ref => 
            ref._id === id ? { ...ref, status: currentStatus } : ref
          )
        );
        toast.error(res_data.msg || "Failed to update status");
      } else {
        toast.success("Status updated");
      }
    } catch (error) {
      // Revert on error
      setReferences(prev => 
        prev.map(ref => 
          ref._id === id ? { ...ref, status: currentStatus } : ref
        )
      );
      console.error("Error:", error);
      toast.error("Failed to update status");
    }
  };

  // ✅ Delete Reference
  const handleDelete = (id) => {
    if (!id) {
      toast.error("Invalid reference ID");
      return;
    }
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) {
      toast.error("No ID to delete");
      return;
    }

    setIsLoading(true);
    try {
      const data = await deleteReference(deleteId);
      if (data?.success === false) {
        toast.error(data.msg || "Failed to delete reference");
        return;
      }
      toast.success("Reference deleted successfully");
      setReferences((prev) => prev.filter((row) => row._id !== deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Close modal handler
  const handleModalClose = () => {
    setIsAddEditModalOpen(false);
    resetForm();
  };

  useEffect(() => {
    if (celebrityId) {
      fetchData();
    }
  }, [celebrityId, fetchData]);

  const columns = useMemo(
    () => [
      { 
        Header: "No.", 
        accessor: (_row, i) => i + 1,
        disableSortBy: true,
      },
      {
        Header: "Created Date",
        accessor: "createdAt",
        Cell: ({ value }) => {
          return value ? new Date(value).toLocaleDateString() : "N/A";
        },
      },
      { 
        Header: "Title", 
        accessor: "title",
        Cell: ({ value }) => value || "N/A",
      },
      {
        Header: "URL",
        accessor: "url",
        Cell: ({ value }) => (
          value ? (
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary"
            >
              {value.length > 50 ? value.substring(0, 50) + "..." : value}
            </a>
          ) : "N/A"
        ),
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ value }) => value || "Other",
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
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="primary"
              size="sm"
              onClick={() => handleEdit(row.original._id)}
              disabled={isLoading}
            >
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
              disabled={isLoading}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [isLoading]
  );

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "References", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">



        <FixedSectionTab activeTabId="references"  />
        <Container fluid>
          {/* <Breadcrumbs title="References" breadcrumbItems={breadcrumbItems} /> */}
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">References List</h4>

                <div className="d-flex gap-2">
                  <Button 
                    color="primary" 
                    onClick={handleAdd}
                    disabled={isLoading}
                  >
                    + Add Reference
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => navigate("/dashboard/celebrity-list")}
                  >
                    ← Back
                  </Button>
                </div>
              </div>

              {isFetching ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <TableContainer
                  columns={columns}
                  data={references}
                  customPageSize={10}
                  isGlobalFilter={true}
                />
              )}
            </CardBody>
          </Card>
        </Container>

        {/* ADD/EDIT MODAL */}
        <Modal
          isOpen={isAddEditModalOpen}
          toggle={handleModalClose}
          size="md"
          backdrop="static"
        >
          <ModalHeader toggle={handleModalClose}>
            {!editId ? "Add" : "Edit"} Reference
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="title">
                  Title <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter reference title"
                  invalid={!!errors.title}
                  disabled={isLoading}
                />
                {errors.title && (
                  <span className="text-danger small d-block mt-1">
                    {errors.title}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="url">
                  URL <span className="text-danger">*</span>
                </Label>
                <Input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  invalid={!!errors.url}
                  disabled={isLoading}
                />
                {errors.url && (
                  <span className="text-danger small d-block mt-1">
                    {errors.url}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="type">Type</Label>
                <Input
                  type="select"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="">Select Type</option>
                  <option value="News">News</option>
                  <option value="Wiki">Wiki</option>
                  <option value="Interview">Interview</option>
                  <option value="Gov Link">Gov Link</option>
                  <option value="Other">Other</option>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="primary" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {!editId ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  !editId ? "Add" : "Update"
                )}
              </Button>
              <Button
                color="secondary"
                onClick={handleModalClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <Modal
          isOpen={isDeleteModalOpen}
          toggle={handleDeleteModalClose}
          backdrop="static"
        >
          <ModalBody className="mt-3">
            <h4 className="p-3 text-center">
              Do you really want to <br /> delete this reference?
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
            <Button 
              color="danger" 
              onClick={handleDeleteConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button 
              color="secondary" 
              onClick={handleDeleteModalClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default ReferencesList;