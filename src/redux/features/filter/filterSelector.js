// @/redux/features/filter/filterSelector.js

import { createSelector } from "@reduxjs/toolkit";
import { selectAllTodos } from "../todos/todosSelector";
import { FILTER_ACTIVE, FILTER_COMPLETED } from "../utils/filterType";

export const selectFilterType = (state) => state.filter.filterType;

const applyFilter = (todos, filterType) => {
  switch (filterType) {
    case FILTER_ACTIVE:
      return todos.filter((todo) => !todo.completed);
    case FILTER_COMPLETED:
      return todos.filter((todo) => todo.completed);

    default:
      return todos;
  }
};

const sortByPinnedAndDate = (todos) => {
  return [...todos].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return new Date(b.date) - new Date(a.date);
  });
};

export const selectFilteredTodos = createSelector(
  [selectAllTodos, selectFilterType],
  (todos, filterType) => {
    return sortByPinnedAndDate(applyFilter(todos, filterType));
  },
);
