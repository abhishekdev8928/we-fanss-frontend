import React, { useMemo } from "react";
import TableContainer from "../../components/Common/TableContainer";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Card, CardBody, Container } from "reactstrap";
import { products, } from "../../common/data/ecommerce";

const EcommerceOrders = () => {

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Position",
        accessor: "position",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Office",
        accessor: "office",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Age",
        accessor: "age",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Start Date",
        accessor: "startdate",
        disableFilters: true,
        filterable: false,
      },
      {
        Header: "Salary",
        accessor: "salary",
        disableFilters: true,
        filterable: false,
      },
    ],
    []
  );

  const breadcrumbItems = [
    { title: "Tables", link: "/" },
    { title: "Data Tables", link: "#" },
  ]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="DATA TABLES"
            breadcrumbItems={breadcrumbItems}
          />
          <Card>
            <CardBody>
              <TableContainer
                columns={columns || []}
                data={products || []}
                isPagination={false}
                // isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
              />
            </CardBody>
          </Card>

          
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceOrders;
