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
  Label,
  Spinner,
} from "reactstrap";

import { RESOURCES, RESOURCE_MAPPING } from "../../constant/privilegeConstants";

import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  usePagination,
} from "react-table";
import PropTypes from "prop-types";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPrivilegesByRoleId, setPrivileges } from "../../api/privilegeApi";

// Global Search Component
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

// Table Container Component
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
      initialState: { pageIndex: 0, pageSize: customPageSize },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
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
            <Button color="primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </Button>
            <Button color="primary" onClick={previousPage} disabled={!canPreviousPage}>
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
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
            <Button color="primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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

// Main Privileges Component
const Privileges = () => {
  const { id } = useParams();

  const [privilegeData, setPrivilegeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [masterChecked, setMasterChecked] = useState(false);
  const [roleInfo, setRoleInfo] = useState(null);

  // Fetch privileges from backend
  const fetchPrivileges = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await getPrivilegesByRoleId(id);
      
      console.log("📥 Backend Response:", response);

      // ✅ Extract data from the standardized response structure
      const { role, permissions = [], hasPermissions } = response.data || {};
      
      // Store role info
      setRoleInfo(role);

      // ✅ Create table data directly from backend permissions (no ALL_RESOURCES loop)
      const tableData = permissions.map((perm, index) => ({
        id: index + 1,
        resource: perm.resource,
        resourceName: RESOURCE_MAPPING[perm.resource] || perm.resource, // fallback to resource name if not in mapping
        add: perm.operations?.add === true,
        edit: perm.operations?.edit === true,
        delete: perm.operations?.delete === true,
        publish: perm.resource === "celebrity" ? (perm.operations?.publish === true) : false,
      }));

      setPrivilegeData(tableData);
      
      console.log("✅ Privileges loaded successfully");
    } catch (error) {
      console.error("❌ Error fetching privileges:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to load privileges");
      
      // ✅ Initialize with empty data on error
      setPrivilegeData([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual privilege
  const handleToggle = (id, field) => {
    setPrivilegeData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, [field]: !item[field] }
          : item
      )
    );
  };

  // Master toggle for all modules
  const handleMasterCheckboxToggle = () => {
    const newStatus = !masterChecked;
    setMasterChecked(newStatus);

    setPrivilegeData(prevData =>
      prevData.map(item => ({
        ...item,
        add: newStatus,
        edit: newStatus,
        delete: newStatus,
        publish: item.resource === "celebrity" ? newStatus : false,
      }))
    );
  };

  // Toggle entire row
  const handleCheckboxToggle = (id) => {
    setPrivilegeData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          const allActive = item.add && item.edit && item.delete && 
                           (item.resource === "celebrity" ? item.publish : true);
          return {
            ...item,
            add: !allActive,
            edit: !allActive,
            delete: !allActive,
            publish: item.resource === "celebrity" ? !allActive : false,
          };
        }
        return item;
      })
    );
  };

  // ✅ Update privileges - send boolean object format
  const updatePrivileges = async () => {
    if (!id || !privilegeData.length) {
      toast.error("No data to update");
      return;
    }

    // ✅ Convert table data to backend format (operations as boolean objects)
    const permissions = privilegeData.map(item => {
      const operations = {
        add: item.add,
        edit: item.edit,
        delete: item.delete,
      };

      // Add publish only for celebrity
      if (item.resource === "celebrity") {
        operations.publish = item.publish;
      }

      return {
        resource: item.resource,
        operations: operations
      };
    });

    const payload = { permissions };

    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

    setSubmitting(true);
    try {
      const response = await setPrivileges(id, payload);
      toast.success(response.data?.message || response.message || "Privileges updated successfully!");
      fetchPrivileges(); // Refresh data
    } catch (error) {
      console.error("❌ Error updating privileges:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to update privileges");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPrivileges();
  }, [id]);

  // Check if master checkbox should be checked
  useEffect(() => {
    const allChecked = privilegeData.length > 0 && privilegeData.every(
      item => item.add && item.edit && item.delete && 
              (item.resource === "celebrity" ? item.publish : true)
    );
    setMasterChecked(allChecked);
  }, [privilegeData]);

  // Table Columns
  const columns = useMemo(() => {
    const baseColumns = [
      { Header: "No.", accessor: "id" },
      {
        Header: () => (
          <div className="form-check form-check-right">
            <Input
              type="checkbox"
              className="form-check-input"
              checked={masterChecked}
              onChange={handleMasterCheckboxToggle}
            />
            <Label className="form-check-label">Module Name</Label>
          </div>
        ),
        accessor: "resourceName",
        Cell: ({ value, row }) => {
          const { id } = row.original;
          const allActive = row.original.add && row.original.edit && 
                           row.original.delete && 
                           (row.original.resource === "celebrity" ? row.original.publish : true);
          return (
            <div className="form-check mb-3">
              <Input
                className="form-check-input"
                type="checkbox"
                checked={allActive}
                onChange={() => handleCheckboxToggle(id)}
              />
              <Label className="form-check-label">{value}</Label>
            </div>
          );
        },
      },
      ...["add", "edit", "delete"].map(field => ({
        Header: field.charAt(0).toUpperCase() + field.slice(1),
        accessor: field,
        Cell: ({ row }) => {
          const isActive = row.original[field];
          return (
            <div className="form-check form-switch">
              <Input
                type="checkbox"
                className="form-check-input"
                checked={isActive}
                onChange={() => handleToggle(row.original.id, field)}
              />
              <Label className="form-check-label">
                {isActive ? "Active" : "Inactive"}
              </Label>
            </div>
          );
        },
      })),
    ];

    // Add publish column for celebrity
    baseColumns.push({
      Header: "Publish",
      accessor: "publish",
      Cell: ({ row }) => {
        const isCelebrity = row.original.resource === "celebrity";
        const isActive = row.original.publish;
        
        if (!isCelebrity) {
          return <span className="text-muted">-</span>;
        }

        return (
          <div className="form-check form-switch">
            <Input
              type="checkbox"
              className="form-check-input"
              checked={isActive}
              onChange={() => handleToggle(row.original.id, "publish")}
            />
            <Label className="form-check-label">
              {isActive ? "Active" : "Inactive"}
            </Label>
          </div>
        );
      },
    });

    return baseColumns;
  }, [privilegeData, masterChecked]);

  const breadcrumbItems = [
    { title: "Dashboard", link: "/" },
    { title: "Role Master", link: "/role-master" },
    { title: "Privileges", link: "#" },
  ];

  return (
    <Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Privileges" breadcrumbItems={breadcrumbItems} />
          
          
          <Card>
            <CardBody>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading privileges...</p>
                </div>
              ) : (
                <>
                  <TableContainer
                    columns={columns}
                    data={privilegeData}
                    customPageSize={10}
                    isGlobalFilter={true}
                  />
                  <Row className="mt-3">
                    <Col md={12}>
                      <div className="d-flex justify-content-end">
                        <Button 
                          color="primary" 
                          onClick={updatePrivileges}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Updating...
                            </>
                          ) : (
                            "Update"
                          )}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </Fragment>
  );
};

export default Privileges;