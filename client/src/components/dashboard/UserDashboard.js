import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { productData } from "../../actions/productActions";
import { createNewProduct, deleteProduct, updateProduct } from '../../utils/api';
import MaterialTable from "material-table";
import LoadingDashboard from "./loadingDashboard";

const COLUMNS = [
  { title: "Name", field: "name" },
  { title: "Price", field: "price" },
  { title: "Reviews", field: "reviewCount", editable: "never" },
  { title: "Description", field: "description" }
];

class UserDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.loadProductData();
  };

  addNewProduct = async product => {
    await createNewProduct({ ...product });
    this.props.loadProductData();
    return Promise.resolve();
  };

  updateProduct = async product => {
    await updateProduct(product);
    this.props.loadProductData();
    return Promise.resolve();
  };

  deleteProduct = async product => {
    await deleteProduct(product.id);
    this.props.loadProductData();
    return Promise.resolve();
  };

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { products, auth: { user } } = this.props;
    const { addNewProduct, updateProduct, deleteProduct, onLogoutClick } = this;

    if (this.props.loading) return <LoadingDashboard />

    return (
      <div style={{ width: "100vw" }} className="container valign-wrapper">
        <div className="row">
          <div style={{ maxWidth: "100vw" }} className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
            </h4>
            <br />
            <MaterialTable
              title="PRODUCTS"
              columns={COLUMNS}
              data={products}
              editable={{
                onRowAdd: addNewProduct,
                onRowUpdate: updateProduct,
                onRowDelete: deleteProduct
              }}
              options={{
                pageSizeOptions: [5],
                showFirstLastPageButtons: false,
                emptyRowsWhenPaging: false,
              }}
              localization={{
                body: {
                  editRow: {
                    deleteText: "Delete this product?" 
                  }
                }
              }}
            />
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={onLogoutClick}
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
  loadProductData: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = ({ products: productStore, auth }) => {
  if (!productStore.products.length) {
    return {
      loading: true,
      auth: {},
      products: [],
    }
  }

  const normalizedProducts = productStore.products.map(product => ({
    id: product._id,
    name: product.name,
    description: product.description,
    reviewCount: product.reviewsCount,
  }));

  return {
    loading: false,
    auth,
    products: normalizedProducts,
  }
};

const mapDispatchToProps = dispatch => ({
  loadUserData: () => dispatch(productData()),
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
