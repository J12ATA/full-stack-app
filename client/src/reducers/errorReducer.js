import { GET_ERRORS } from '../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  const { type, errors } = action;

  return type === GET_ERRORS ? errors : state;
};
