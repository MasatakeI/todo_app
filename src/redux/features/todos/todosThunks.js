// @/redux/features/todos/todosThunks.js

import {
  fetchTodos,
  deleteTodo,
  saveTodo,
  togglePin,
  toggleCompleted,
} from "@/models/TodoModel";
import { createModelThunk } from "../utils/createModelThunk";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { mapTodoErrorToModelError } from "./mapTodoErrorToModelError";

export const saveTodoAsync = createModelThunk(
  "todos/saveTodo",
  async ({ body }, thunkApi) => {
    try {
      const todo = await saveTodo({ body });
      thunkApi.dispatch(showSnackbar(`${todo.body}を追加しました`));
      return todo;
    } catch (error) {
      throw mapTodoErrorToModelError(error);
    }
  },
);

export const fetchTodosAsync = createModelThunk(
  "todos/fetchTodos",
  async () => {
    try {
      const todos = await fetchTodos();
      return todos;
    } catch (error) {
      throw mapTodoErrorToModelError(error);
    }
  },
);

export const deleteTodoAsync = createModelThunk(
  "todos/deleteTodo",
  async ({ id }, thunkApi) => {
    try {
      const todo = await deleteTodo(id);
      thunkApi.dispatch(showSnackbar(`${todo.body}を削除しました`));
      return todo;
    } catch (error) {
      throw mapTodoErrorToModelError(error);
    }
  },
);

export const toggleCompletedAsync = createModelThunk(
  "todos/toggleCompleted",
  async ({ id }, thunkApi) => {
    try {
      const todo = await toggleCompleted(id);

      const toggleText = todo.completed ? "完了に" : "未完了に";
      thunkApi.dispatch(
        showSnackbar(`${todo.body}を${toggleText}切り替えました`),
      );

      return todo;
    } catch (error) {
      throw mapTodoErrorToModelError(error);
    }
  },
);
export const togglePinAsync = createModelThunk(
  "todos/togglePin",
  async ({ id }, thunkApi) => {
    try {
      const todo = await togglePin(id);

      const pinText = todo.pinned ? "固定に" : "未固定に";
      thunkApi.dispatch(showSnackbar(`${todo.body}を${pinText}切り替えました`));

      return todo;
    } catch (error) {
      throw mapTodoErrorToModelError(error);
    }
  },
);
