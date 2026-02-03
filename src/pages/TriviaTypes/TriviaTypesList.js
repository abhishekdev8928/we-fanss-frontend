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
  fetchTriviaTypes,
  addTriviaTypes,
  updateTriviaTypes,
  deleteTriviaTypes,
  getTriviaTypesById,
  updateTriviaTypesStatus,
} from "../../api/triviaTypesApi";
import PrivilegeAccess from "../../components/protection/PrivilegeAccess";
import { RESOURCES, OPERATIONS } from "../../constant/privilegeConstants";
import { usePrivilegeStore } from "../../config/store/privilegeStore";
import { formatDateTime } from "../../utils/dateTimeHelper"; // ✅ Import utility

// ================= GLOBAL FILTER ==================
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

// ================= TABLE CONTAINER ==================
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
              // ✅ No data available message
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
};

// ================= MAIN COMPONENT ==================
const TriviaTypesMasterList = () => {
  const [category, setcategory] = useState({ name: "" });
  const [rolelist, setcategorylist] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  const { hasPermission } = usePrivilegeStore();

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const result = await fetchTriviaTypes();
      setcategorylist(result.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load categories.");
    }
  };

  // ================= STATUS CHANGE =================
  const handleChange = async (currentStatus, id) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    try {
      const result = await updateTriviaTypesStatus(id, newStatus);
      toast.success(result.message || "Status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // ================= EDIT =================
  const handleedit = async (id) => {
    try {
      const result = await getTriviaTypesById(id);
      const triviaType = result.data;
      setcategory({ name: triviaType.name });
      setItemIdToDelete(triviaType._id);
      setModalOpen(true);
    } catch (error) {
      toast.error(error.message || "Failed to load category data");
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    setDeleteId(id);
    setModalOpen2(true);
  };

  const handleClose = () => {
    setModalOpen2(false);
    setDeleteId(null);
  };

  const handleyesno = async () => {
    if (!deleteId) return toast.error("No ID to delete.");
    try {
      const result = await deleteTriviaTypes(deleteId);
      toast.success(result.message || "Deleted successfully");
      setModalOpen2(false);
      fetchData();
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  // ================= ADD / UPDATE =================
  const handleinput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setcategory({ ...category, [name]: value });
  };

  const handleClose1 = () => {
    setModalOpen(false);
    setItemIdToDelete(null);
    setcategory({ name: "" });
    setErrors({});
  };

  const handleaddsubmit = async (e) => {
    e.preventDefault();

    if (!category.name) {
      setErrors({ name: "Name is required" });
      return;
    }

    try {
      const payload = { name: category.name };
      let res_data;

      if (itemIdToDelete) {
        res_data = await updateTriviaTypes(itemIdToDelete, payload);
      } else {
        res_data = await addTriviaTypes(payload);
      }

      if (!res_data.success) {
        const errorMsg = res_data.message || res_data.error?.message || "Operation failed";
        
        if (errorMsg.toLowerCase().includes("already exist")) {
          setErrors({ name: errorMsg });
        }
        
        toast.error(errorMsg);
        return;
      }

      toast.success(
        res_data.message || 
        (itemIdToDelete ? "Updated successfully" : "Added successfully")
      );
      handleClose1();
      setcategory({ name: "" });
      setErrors({});
      fetchData();
    } catch (error) {
      console.error("Add/Update Category Error:", error);
      toast.error(error.message || "Something went wrong.");
    }
  };

  // ✅ Check permissions
  const canEdit = hasPermission(RESOURCES.TRIVIA_TYPE, OPERATIONS.EDIT);
  const canDelete = hasPermission(RESOURCES.TRIVIA_TYPE, OPERATIONS.DELETE);
  const hasAnyAction = canEdit || canDelete;

  const columns = [
    { Header: "No.", accessor: (_row, i) => i + 1 },
    { 
      Header: "Created Date", 
      accessor: "createdAt",
      Cell: ({ value }) => formatDateTime(value) // ✅ Using utility
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

  // ✅ Add Option column only if user has edit or delete permissions
  if (hasAnyAction) {
    columns.push({
      Header: "Option",
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <PrivilegeAccess
            resource={RESOURCES.TRIVIA_TYPE}
            action={OPERATIONS.EDIT}
          >
            <Button
              color="primary"
              onClick={() => handleedit(row.original._id)}
              size="sm"
            >
              Edit
            </Button>
          </PrivilegeAccess>

          <PrivilegeAccess
            resource={RESOURCES.TRIVIA_TYPE}
            action={OPERATIONS.DELETE}
          >
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

  useEffect(() => {
    fetchData();
  }, []);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "TriviaTypes Master", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="TriviaTypes Master"
            breadcrumbItems={breadcrumbItems}
          />

           <PrivilegeAccess
            resource={RESOURCES.TRIVIA_TYPE}
            action={OPERATIONS.ADD}
          >
            <div className="d-flex justify-content-end mb-2">
              <Button color="primary" onClick={() => setModalOpen(true)}>
                Add
              </Button>
            </div>
          </PrivilegeAccess>

         

          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={rolelist}
                customPageSize={10}
                isGlobalFilter={true}
              />
            </CardBody>
          </Card>
        </Container>

        {/* ADD / EDIT MODAL */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            {!itemIdToDelete ? "Add" : "Edit"} Trivia Types
          </ModalHeader>
          <form onSubmit={handleaddsubmit}>
            <ModalBody>
              <Input
                type="text"
                value={category.name || ""}
                onChange={handleinput}
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
                {!itemIdToDelete ? "Add" : "Update"}
              </Button>
              <Button color="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* DELETE MODAL */}
        <Modal isOpen={modalOpen2} toggle={() => setModalOpen2(false)}>
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
            <Button color="danger" onClick={handleyesno}>
              Delete
            </Button>
            <Button color="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Fragment>
  );
};

export default TriviaTypesMasterList;