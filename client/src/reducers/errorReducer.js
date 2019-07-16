import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default (state = initialState, action) => {
  return action.type === GET_ERRORS
    ? action.payload
    : state;
};
