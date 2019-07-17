import React, { Component } from "react";
import { logoutAdmin } from "../../actions/authActions";
import MaterialTable from "material-table";

export default class loadingDashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    logoutAdmin();
  };

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
                { title: "loading" }
              ]}
              actions={[{
                icon: "save",
                tooltip: "Save",
                onClick: () => {}
              }]}
              data={[]}
              isLoading={true}
              options={{
                pageSizeOptions: [5],
                showFirstLastPageButtons: false,
                emptyRowsWhenPaging: false,
              }}
            />
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };
};