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
  getAllRelatedPersonalities,
  createRelatedPersonality,
  getRelatedPersonalityById,
  updateRelatedPersonality,
  updateRelatedPersonalityStatus,
  deleteRelatedPersonality,
} from "../../api/relatedPersonalityApi";
import { getCelebrityOptions } from "../../api/optionsApi";
import {
  createRelatedPersonalitySchema,
  updateRelatedPersonalitySchema,
} from "../../schemas/relatedPersonality.schema";
import { validateForm } from "../../utils/validateForm";

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

const RelatedPersonalitiesList = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [relatedPersonalities, setRelatedPersonalities] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { celebrityId } = useParams();
  const navigate = useNavigate();

  const [celebrityOptions, setCelebrityOptions] = useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const [formData, setFormData] = useState({
    relatedCelebrity: "",
    relationshipType: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const fetchCelebrityOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const result = await getCelebrityOptions([celebrityId]);
      setCelebrityOptions(result.data || []);
    } catch (error) {
      console.error("Error fetching celebrity options:", error);
      toast.error("Failed to load celebrity options");
      setCelebrityOptions([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [celebrityId]);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await getAllRelatedPersonalities(celebrityId);
      const dataArray = Array.isArray(result?.data) ? result.data : [];
      setRelatedPersonalities(dataArray);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load related personalities");
      setRelatedPersonalities([]);
    } finally {
      setIsFetching(false);
    }
  }, [celebrityId]);

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

 const validateFormData = () => {
  // ✅ Debug check
  console.log("Schema:", editId ? updateRelatedPersonalitySchema : createRelatedPersonalitySchema);
  console.log("Data:", editId ? formData : { ...formData, celebrity: celebrityId });

  const schema = editId
    ? updateRelatedPersonalitySchema
    : createRelatedPersonalitySchema;
  
  const dataToValidate = editId
    ? formData
    : { ...formData, celebrity: celebrityId };
  
  const validation = validateForm(schema, dataToValidate);
  
  console.log("Validation result:", validation);

  if (!validation.success) {
    setErrors(validation.errors);
    return false;
  }

  setErrors({});
  return true;
};

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
        const response = await updateRelatedPersonality(editId, payload);
        if (response?.success === false) {
          toast.error(response.message || "Failed to update related personality");
          return;
        }
        toast.success("Related personality updated successfully");
      } else {
        const response = await createRelatedPersonality(payload);
        if (response?.success === false) {
          toast.error(response.message || "Failed to create related personality");
          return;
        }
        toast.success("Related personality created successfully");
      }

      setIsAddEditModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      relatedCelebrity: "",
      relationshipType: "",
      notes: "",
    });
    setErrors({});
    setEditId(null);
  };

  const handleAdd = () => {
    resetForm();
    fetchCelebrityOptions();
    setIsAddEditModalOpen(true);
  };

  const handleEdit = async (id) => {
    if (!id) {
      toast.error("Invalid related personality ID");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getRelatedPersonalityById(id);
      const personalityData =
        response?.data || response?.message || response;

      if (personalityData && typeof personalityData === "object") {
        setFormData({
          relatedCelebrity: personalityData.relatedCelebrity?._id || "",
          relationshipType: personalityData.relationshipType || "",
          notes: personalityData.notes || "",
        });
        setEditId(id);
        fetchCelebrityOptions();
        setIsAddEditModalOpen(true);
      } else {
        toast.error("Failed to load related personality");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load related personality");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    if (!id) return;

    const newStatus = currentStatus == 1 ? 0 : 1;

    setRelatedPersonalities((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const res_data = await updateRelatedPersonalityStatus(id, newStatus);
      if (res_data?.success === false) {
        setRelatedPersonalities((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: currentStatus } : item
          )
        );
        toast.error(res_data.message || "Failed to update status");
      } else {
        toast.success("Status updated");
      }
    } catch (error) {
      setRelatedPersonalities((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: currentStatus } : item
        )
      );
      console.error("Error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id) => {
    if (!id) {
      toast.error("Invalid related personality ID");
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
      const data = await deleteRelatedPersonality(deleteId);
      if (data?.success === false) {
        toast.error(data.message || "Failed to delete related personality");
        return;
      }
      toast.success("Related personality deleted successfully");
      setRelatedPersonalities((prev) =>
        prev.filter((row) => row._id !== deleteId)
      );
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsAddEditModalOpen(false);
    resetForm();
  };

  useEffect(() => {
    if (celebrityId) {
      fetchData();
    }
  }, [celebrityId, fetchData]);

  const columns = [
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
      Header: "Celebrity",
      accessor: "celebrity",
      Cell: ({ value }) => value?.identityProfile?.name || "N/A",
    },
    {
      Header: "Related Celebrity",
      accessor: "relatedCelebrity",
      Cell: ({ value }) => value?.identityProfile?.name || "N/A",
    },
    {
      Header: "Relationship Type",
      accessor: "relationshipType",
      Cell: ({ value }) => value || "N/A",
    },
    {
      Header: "Notes",
      accessor: "notes",
      Cell: ({ value }) =>
        value
          ? value.length > 50
            ? value.substring(0, 50) + "..."
            : value
          : "N/A",
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
  ];

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Related Personalities", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Related Personalities"
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Related Personalities List</h4>

                <div className="d-flex gap-2">
                  <Button
                    color="primary"
                    onClick={handleAdd}
                    disabled={isLoading}
                  >
                    + Add Related Personality
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
                  data={relatedPersonalities}
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
            {!editId ? "Add" : "Edit"} Related Personality
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="relatedCelebrity">
                  Related Celebrity <span className="text-danger">*</span>
                </Label>
                {isLoadingOptions ? (
                  <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading celebrities...</span>
                  </div>
                ) : (
                  <Input
                    type="select"
                    id="relatedCelebrity"
                    name="relatedCelebrity"
                    value={formData.relatedCelebrity}
                    onChange={handleInputChange}
                    invalid={!!errors.relatedCelebrity}
                    disabled={isLoading}
                  >
                    <option value="">Select Related Celebrity</option>
                    {celebrityOptions.map((celebrity) => (
                      <option key={celebrity.id} value={celebrity.id}>
                        {celebrity.label}
                      </option>
                    ))}
                  </Input>
                )}
                {errors.relatedCelebrity && (
                  <span className="text-danger small d-block mt-1">
                    {errors.relatedCelebrity}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="relationshipType">
                  Relationship Type <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="relationshipType"
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleInputChange}
                  invalid={!!errors.relationshipType}
                  disabled={isLoading}
                >
                  <option value="">Select Relationship Type</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Co-star">Co-star</option>
                  <option value="Rival">Rival</option>
                  <option value="Family">Family</option>
                  <option value="Politically">Politically</option>
                  <option value="Other">Other</option>
                </Input>
                {errors.relationshipType && (
                  <span className="text-danger small d-block mt-1">
                    {errors.relationshipType}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input
                  type="textarea"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter notes (optional)"
                  rows="3"
                  disabled={isLoading}
                />
                {errors.notes && (
                  <span className="text-danger small d-block mt-1">
                    {errors.notes}
                  </span>
                )}
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" disabled={isLoading || isLoadingOptions}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {!editId ? "Adding..." : "Updating..."}
                  </>
                ) : !editId ? (
                  "Add"
                ) : (
                  "Update"
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
              Do you really want to <br /> delete this related personality?
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

export default RelatedPersonalitiesList;