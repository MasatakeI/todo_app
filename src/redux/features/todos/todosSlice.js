// @/redux/features/todos/todosSlice.js

import { createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import {
  deleteTodoAsync,
  fetchTodosAsync,
  addTodoAsync,
  togglePinAsync,
  toggleCompletedAsync,
  toggleImportantAsync,
} from "./todosThunks";

export const todosInitialState = {
  canPost: true,
  isLoading: false,
  todos: [],
  error: null,
  isDeleting: false,
  isToggling: false,
};

const todosSlice = createSlice({
  name: "todos",
  initialState: todosInitialState,

  extraReducers: (builder) => {
    builder

      //saveTodo
      .addCase(addTodoAsync.pending, (state, action) => {
        state.canPost = false;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.canPost = true;
        state.todos.push(action.payload);
        state.error = null;
      })

      //fetchTodos
      .addCase(fetchTodosAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload;
        state.error = null;
      })

      //deleteTodo
      .addCase(deleteTodoAsync.pending, (state, action) => {
        state.isDeleting = true;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.todos = state.todos.filter(
          (todo) => todo.id !== action.payload.id,
        );
        state.error = null;
      })

      //toggleCompleted
      .addCase(toggleCompletedAsync.pending, (state, action) => {
        state.isToggling = true;
      })
      .addCase(toggleCompletedAsync.fulfilled, (state, action) => {
        state.isToggling = false;
        state.todos = state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo,
        );
        state.error = null;
      })

      //togglePin
      .addCase(togglePinAsync.pending, (state, action) => {
        state.isToggling = true;
      })
      .addCase(togglePinAsync.fulfilled, (state, action) => {
        state.isToggling = false;
        state.todos = state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo,
        );
        state.error = null;
      })

      //toggleImportant
      .addCase(toggleImportantAsync.pending, (state, action) => {
        state.isToggling = true;
      })
      .addCase(toggleImportantAsync.fulfilled, (state, action) => {
        state.isToggling = false;
        state.todos = state.todos.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo,
        );
        state.error = null;
      })

      //rejected共通処理
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.canPost = true;
        state.isLoading = false;
        state.isDeleting = false;
        state.isToggling = false;

        state.error = action.payload;
      });
  },
});

export default todosSlice.reducer;
