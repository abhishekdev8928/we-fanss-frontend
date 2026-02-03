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
import deleteimg from "../../assets/images/delete.png";
import { toast } from "react-toastify";
import {
  fetchSocialLink,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getSocialLinkById,
  updateSocialLinkStatus,
} from "../../api/SocialLinkApi";
import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
import { usePrivilegeStore } from "../../config/store/privilegeStore";
import { formatDateTime } from "../../utils/dateTimeHelper";

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
        <Col md={6}>
          <PrivilegeAccess
            resource={RESOURCES.SOCIAL_LINK}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end">
              <Button color="primary" onClick={() => setModalOpen(true)}>
                Add
              </Button>
            </div>
          </PrivilegeAccess>
        </Col>
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
            {pageIndex + 1} of {pageOptions.length || 1}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            max={pageOptions.length || 1}
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
  setModalOpen: PropTypes.func.isRequired,
};

const SocialLinkMasterList = () => {
  const [socialLink, setSocialLink] = useState({ name: "" });
  const [socialLinkList, setSocialLinkList] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const { hasPermission } = usePrivilegeStore();

  const fetchData = async () => {
    try {
      const result = await fetchSocialLink();
      setSocialLinkList(result.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load social links.");
    }
  };

  const handleStatusChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    try {
      const result = await updateSocialLinkStatus(id, newStatus);
      toast.success(result.message || "Status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleEdit = async (id) => {
    try {
      const result = await getSocialLinkById(id);
      const socialLinkData = result.data;
      setSocialLink({ name: socialLinkData.name });
      setEditId(socialLinkData._id);
      setIsAddEditModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to load social link data");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return toast.error("No ID to delete.");
    try {
      const result = await deleteSocialLink(deleteId);
      toast.success(result.message || "Deleted successfully");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialLink({ ...socialLink, [name]: value });
  };

  const handleAddEditModalClose = () => {
    setIsAddEditModalOpen(false);
    setEditId(null);
    setSocialLink({ name: "" });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!socialLink.name) {
      setErrors({ name: "Name is required" });
      return;
    }

    try {
      const payload = { name: socialLink.name };
      let response;

      if (editId) {
        response = await updateSocialLink(editId, payload);
      } else {
        response = await addSocialLink(payload);
      }

      if (!response.success) {
        const errorMsg = response.message || response.error?.message || "Operation failed";
        
        if (errorMsg.toLowerCase().includes("already exist")) {
          setErrors({ name: errorMsg });
        }
        
        toast.error(errorMsg);
        return;
      }

      toast.success(
        response.message || 
        (editId ? "Updated successfully" : "Added successfully")
      );
      handleAddEditModalClose();
      setSocialLink({ name: "" });
      setErrors({});
      fetchData();
    } catch (error) {
      console.error("Add/Update Social Link Error:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  const canEdit = hasPermission(RESOURCES.SOCIAL_LINK, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.SOCIAL_LINK, OPERATIONS.DELETE);
  const hasAnyAction = canEdit || canDelete;

  const columns = [
    { Header: "No.", accessor: (_row, i) => i + 1 },
    { 
      Header: "Created Date", 
      accessor: "createdAt",
      Cell: ({ value }) => formatDateTime(value)
    },
    { Header: "Name", accessor: "name" },
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
  ];

  if (hasAnyAction) {
    columns.push({
      Header: "Option",
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <PrivilegeAccess
            resource={RESOURCES.SOCIAL_LINK}
            action={OPERATIONS.EDIT}
          >
            <Button
              color="primary"
              onClick={() => handleEdit(row.original._id)}
              size="sm"
            >
              Edit
            </Button>
          </PrivilegeAccess>

          <PrivilegeAccess
            resource={RESOURCES.SOCIAL_LINK}
            action={OPERATIONS.DELETE}
          >
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDeleteClick(row.original._id)}
            >
              Delete
            </Button>
          </PrivilegeAccess>
        </div>
      ),
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Social Link Master", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Social Link Master"
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={socialLinkList}
                customPageSize={10}
                isGlobalFilter={true}
                setModalOpen={setIsAddEditModalOpen}
              />
            </CardBody>
          </Card>
        </Container>

        {/* ADD / EDIT MODAL */}
        <Modal isOpen={isAddEditModalOpen} toggle={() => setIsAddEditModalOpen(!isAddEditModalOpen)}>
          <ModalHeader toggle={() => setIsAddEditModalOpen(!isAddEditModalOpen)}>
            {!editId ? "Add" : "Edit"} Social Link
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Input
                type="text"
                value={socialLink.name || ""}
                onChange={handleInputChange}
                name="name"
                placeholder="Name"
                className="mb-2"
              />
              {errors.name && (
                <span className="text-danger">{errors.name}</span>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                {!editId ? "Add" : "Update"}
              </Button>
              <Button color="secondary" onClick={() => setIsAddEditModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <Modal isOpen={isDeleteModalOpen} toggle={() => setIsDeleteModalOpen(false)}>
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
            <Button color="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button color="secondary" onClick={handleDeleteModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default SocialLinkMasterList;