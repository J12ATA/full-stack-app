import { GET_ERRORS, SET_PRODUCT_DATA } from './types';
import { getAllProductData } from '../utils/api';

// sync action
export const setProductData = (products) => ({
  type: SET_PRODUCT_DATA,
  products,
});

// async action creator
export const productData = () => async (dispatch) => {
  try {
    const response = await getAllProductData();
    const products = response.data;

    dispatch(setProductData(products));
  } catch (err) {
    dispatch({ type: GET_ERRORS, errors: err.response.data });
  }
};
