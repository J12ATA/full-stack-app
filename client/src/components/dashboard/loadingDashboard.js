import React, { Component } from "react";
import MaterialTable from "material-table";

export default class loadingDashboard extends Component {
  render() {
    return (
      <div style={{ width: "100vw" }} className="container valign-wrapper">
        <div className="row">
          <div style={{ maxWidth: "100vw" }} className="col s12 center-align">
            <h4>
              <b>Hey there, ...</b>
            </h4>
            <br />
            <MaterialTable
              title="LOADING"
              columns={[
                { title: "loading" }, 
                { title: "loading" }, 
                { title: "loading" },
                { title: "loading" }
              ]}
              data={[]}
              isLoading={true}
              options={{
                pageSizeOptions: [5],
                showFirstLastPageButtons: false,
                emptyRowsWhenPaging: false,
              }}
            />
          </div>
        </div>
      </div>
    );
  };
};