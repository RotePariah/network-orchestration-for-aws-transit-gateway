/***********************************************************************
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-blue.css";
import { Button, Modal } from "react-bootstrap";

class VersionHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //List attribute/column names from the ddb table
      dataFields: [
        {
          SubnetId: "",
          Version: "",
          Status: "",
          TgwId: "",
          VpcId: "",
          UserId: "",
          RequestTimeStamp: "",
          ResponseTimeStamp: "",
          AssociationRouteTable: "",
          PropagationRouteTablesString: "",
          TagEventSource: "",
          Action: "",
          AWSSpokeAccountId: "",
          TimeToLive: "",
          AvailabilityZone: "",
          VpcCidr: "",
          AdminAction: "",
          Comment: "",
          items: []
        }
      ],

      //define columns in the grid: field names in the grid should match attribute/column names from the ddb table
      columnDefs: [
        {
          headerName: "VPC Id",
          field: "VpcId",
          width: 220
        },
        {
          headerName: "VPC CIDR",
          field: "VpcCidr"
        },
        {
          headerName: "Action",
          field: "Action"
        },
        {
          headerName: "Status",
          field: "Status",
          cellClassRules: {
            "rag-red": function(params) {
              return (params.value === "rejected" || params.value === "auto-rejected" || params.value === "failed");
            }
          }
        },
        {
          headerName: "Comment",
          field: "Comment",
          autoHeight: true,
          cellStyle: { "whiteSpace": "normal" }
        },
        {
          headerName: "Association RT",
          field: "AssociationRouteTable"
        },
        {
          headerName: "Propagation RTs",
          field: "PropagationRouteTablesString"
        },
        {
          headerName: "Spoke Account",
          field: "AWSSpokeAccountId"
        },
        {
          headerName: "Subnet Id",
          field: "SubnetId",
          width: 210
        },
        {
          headerName: "AZ",
          field: "AvailabilityZone"
        },
        {
          headerName: "Tag Event Source",
          field: "TagEventSource"
        },
        {
          headerName: "Request Time",
          field: "RequestTimeStamp"
        },
        {
          headerName: "Response Time",
          field: "ResponseTimeStamp"
        },
        {
          headerName: "User Id",
          field: "UserId"
        },
        {
          headerName: "Transit Gateway Id",
          field: "TgwId"
        }
      ]
    };
  }

  //initialize grid
  onGridReady = async (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.autoSizeAll();
    this.gridApi.resetRowHeights();
  };

  //auto adjust column width to fix content
  autoSizeAll() {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      if (
        column.colId !== "SubnetId" &&
        column.colId !== "VpcId" &&
        column.colId !== "Comment"
      )
        allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  //render UI
  render() {
    return (
      <Modal
        {...this.props}
        // size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Version History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="ag-theme-blue"
            style={{
              height: "calc(80vh - 50px)"
            }}
          >
            <AgGridReact
              onGridReady={this.onGridReady}
              rowSelection="single"
              defaultColDef={{ resizable: true, sortable: true, filter: true }}
              columnDefs={this.state.columnDefs}
              rowData={this.props.params.versionHistoryItems}
              onRowSelected={this.onRowSelected}
            ></AgGridReact>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default VersionHistoryModal;
