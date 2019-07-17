import axios from "axios";
const BASE_URL = 'http://localhost:5000/api';

export const getAllUserData = async () => {
  const response = await axios.get(`${BASE_URL}/users/get_all_users`);
  return response;
};

export const createNewUser = user => {
  return axios.post(`${BASE_URL}/users/add_user`, {
    name: user.name,
    email: user.email,
    password: user.password,
    password2: user.password2,
  });
};

export const updateUser = user => {
  return axios.put(`${BASE_URL}/users/${user.id}`, {
    name: user.name,
    email: user.email,
    password: user.password,
    password2: user.password2,
  });
}

export const deleteUser = id => {
  return axios.delete(`${BASE_URL}/users/${id}`);
};
