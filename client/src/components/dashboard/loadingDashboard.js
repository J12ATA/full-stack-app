import React, { Component } from "react";
import MaterialTable from "material-table";

class loadingDashboard extends Component {
  render() {
    return (
      <div style={{ width: "100vw" }} className="container valign-wrapper">
        <div className="row">
          <div style={{ maxWidth: "100vw" }} className="col s12 center-align">
            <MaterialTable
              title="LOADING"
              columns={[
                { title: "loading" },
                { title: "loading" },
                { title: "loading" }
              ]}
              actions={[
                {
                  icon: "save",
                  tooltip: "Save",
                  onClick: () => {}
                }
              ]}
              data={[]}
              isLoading={true}
              options={{
                pageSizeOptions: [5],
                showFirstLastPageButtons: false,
                emptyRowsWhenPaging: false
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default loadingDashboard;
