import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { latestTransction } from "../../common/data";
import { Link } from "react-router-dom";
import TableContainer from "../../components/Common/TableContainer";

const LatestTransactions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "id",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Order ID",
        accessor: "orderId",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Date",
        accessor: "date",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Billing Name",
        accessor: "billingName",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Total",
        accessor: "total",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Payment Status",
        accessor: (cellProps) => {
          switch (cellProps.badge) {
            case "Paid":
              return (
                <span className="badge bg-success-subtle text-success text-uppercase">
                  {" "}
                  {cellProps.badge}
                </span>
              );
            case "unpaid":
              return (
                <span className="badge bg-warning-subtle text-warning text-uppercase">
                  {" "}
                  {cellProps.badge}
                </span>
              );
            default:
              return (
                <span className="badge bg-danger-subtle text-danger text-uppercase">
                  {" "}
                  {cellProps.badge}
                </span>
              );
          }
        },
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Actions",
        accessor: (cellProps) => {
          return (
            <React.Fragment>
              <Link to="#" className="me-3 text-primary">
                <i className="mdi mdi-pencil font-size-18"></i>
              </Link>
              <Link to="#" className="text-danger">
                <i className="mdi mdi-trash-can font-size-18"></i>
              </Link>
            </React.Fragment>
          );
        },
        disableFilters: true,
        filterable: false,
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <Col lg={8}>
        <Card>
          <CardBody>
            <Dropdown
              isOpen={dropdownOpen}
              toggle={toggle}
              className="float-end"
            >
              <DropdownToggle tag="i" className="arrow-none card-drop">
                <i className="mdi mdi-dots-vertical"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Sales Report</DropdownItem>

                <DropdownItem>Export Report</DropdownItem>

                <DropdownItem>Profit</DropdownItem>

                <DropdownItem>Action</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <h4 className="card-title mb-4">Latest Transactions</h4>
            <div className="table-responsive">
              <TableContainer
                columns={columns || []}
                data={latestTransction || []}
                isPagination={false}
                isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={5}
                className="custom-header-css table align-middle table-nowrap"
                tableClassName="table-centered align-middle table-nowrap mb-0"
                theadClassName="text-muted table-light"
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default LatestTransactions;
