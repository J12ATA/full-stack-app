import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import MaterialTable from "material-table";

class UserDashboard extends Component {
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
          reviewCount: 3,
          location: 63
        },
        {
          name: "Johny Bravo",
          reviewCount: 5,
          location: 34
        }
      ]
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ width: "100vw" }} className="container valign-wrapper">
        <div className="row">
          <div style={{ maxWidth: "100vw" }} className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
            </h4>
            <br />
            <MaterialTable
              title="REVIEWS"
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

UserDashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(UserDashboard);
