import axios from "axios";
const BASE_URL = "/api";

export const getAllUserData = async () => {
  const response = await axios.get(`${BASE_URL}/users/get_all_users`);
  return response;
};

export const createNewUser = user => {
  return axios.post(`${BASE_URL}/users/add_user`, {
    name: user.name,
    email: user.email,
    password: user.password,
    password2: user.password2
  });
};

export const updateUser = user => {
  return axios.put(`${BASE_URL}/users/${user.id}`, {
    name: user.name,
    email: user.email,
    password: user.password,
    password2: user.password2
  });
};

export const deleteUser = id => {
  return axios.delete(`${BASE_URL}/users/${id}`);
};

export const getAllProductData = async () => {
  const response = await axios.get(`${BASE_URL}/products/get_all_products`);
  return response;
};

export const createNewProduct = product => {
  return axios.post(`${BASE_URL}/products/add_user`, {
    name: product.name,
    price: product.price,
    description: product.description
  });
};

export const updateProduct = product => {
  return axios.put(`${BASE_URL}/products/${product.id}`, {
    name: product.name,
    price: product.price,
    description: product.description
  });
};

export const deleteProduct = id => {
  return axios.delete(`${BASE_URL}/products/${id}`);
};
