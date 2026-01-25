// @/redux/features/filter/filterSelector.js

import { createSelector } from "@reduxjs/toolkit";
import { selectAllTodos } from "../todos/todosSelector";
import { FILTER_ACTIVE, FILTER_COMPLETED } from "../utils/filterType";

export const selectFilterType = (state) => state.filter.filterType;

export const selectFilteredTodos = createSelector(
  [selectAllTodos, selectFilterType],
  (todos, filterType) => {
    switch (filterType) {
      case FILTER_ACTIVE:
        return todos.filter((todo) => !todo.completed);
      case FILTER_COMPLETED:
        return todos.filter((todo) => todo.completed);

      default:
        return todos;
    }
  },
);
