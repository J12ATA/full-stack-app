import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutAdmin } from "../../actions/authActions";
import MaterialTable from "material-table";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "Name",
          field: "name",
          grouping: false
        },
        {
          title: "Verified",
          field: "verified",
          type: "boolean",
          editComponent: props => (
            <input
              type="text"
              value={props.value}
              onChange={e => props.onChange(e.target.value.match(/^true$/i))}
            />
          )
        },
        {
          title: "Reviews",
          field: "reviewCount",
          type: "numeric"
        },
        {
          title: "City",
          field: "location",
          lookup: {
            34: "Las Vegas",
            63: "Los Angeles"
          }
        }
      ],
      data: [
        {
          name: "Pedro Guzman",
          verified: true,
          reviewCount: 3,
          location: 63
        },
        {
          name: "Johny Bravo",
          verified: false,
          reviewCount: 5,
          location: 34
        }
      ]
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutAdmin();
  };

  render() {
    const { admin } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {admin.name.split(" ")[0]}
            </h4>
            <br />
            <MaterialTable
              title="USERS"
              columns={this.state.columns}
              data={this.state.data}
              editable={{
                onRowAdd: newData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        data.push(newData);
                        this.setState({ data }, () => resolve());
                      }
                      resolve();
                    }, 1000);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        this.setState({ data }, () => resolve());
                      }
                      resolve();
                    }, 1000);
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        let data = this.state.data;
                        const index = data.indexOf(oldData);
                        data.splice(index, 1);
                        this.setState({ data }, () => resolve());
                      }
                      resolve();
                    }, 1000);
                  })
              }}
              options={{
                grouping: true
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
  }
}

AdminDashboard.propTypes = {
  logoutAdmin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutAdmin }
)(AdminDashboard);
