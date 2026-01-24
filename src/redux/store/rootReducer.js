// @/redux/store/rootReducer.js

import { combineReducers } from "@reduxjs/toolkit";

import todosRedcuer from "../features/todos/todosSlice";
import snackbarReducer from "../features/snackbar/snackbarSlice";
import filterReducer from "../features/filter/filterSlice";

export const rootReducer = combineReducers({
  todos: todosRedcuer,
  snackbar: snackbarReducer,
  filter: filterReducer,
});
