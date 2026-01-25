// @/redux/store/rootReducer.js

import { combineReducers } from "@reduxjs/toolkit";

import todosReducer from "../features/todos/todosSlice";
import snackbarReducer from "../features/snackbar/snackbarSlice";
import filterReducer from "../features/filter/filterSlice";

export const rootReducer = combineReducers({
  todos: todosReducer,
  snackbar: snackbarReducer,
  filter: filterReducer,
});
