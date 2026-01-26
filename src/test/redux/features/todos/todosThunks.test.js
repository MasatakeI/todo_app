// @/test/redux/features/todos/todosThunks.js
import { describe, test, expect, beforeEach, vi } from "vitest";

import {
  saveTodoAsync,
  fetchTodosAsync,
  deleteTodoAsync,
  toggleCompletedAsync,
  togglePinAsync,
} from "@/redux/features/todos/todosThunks";

import { mockTodos, newTodo } from "../fixtures/todoFixture";
import { MODEL_ERROR_CODE, ModelError } from "@/models/errors/ModelError";
import {
  deleteTodo,
  fetchTodos,
  saveTodo,
  toggleCompleted,
  togglePin,
} from "@/models/TodoModel";
import { mapTodoErrorToModelError } from "@/redux/features/todos/mapTodoErrorToModelError";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

vi.mock("@/models/TodoModel", () => ({
  saveTodo: vi.fn(),
  fetchTodos: vi.fn(),
  deleteTodo: vi.fn(),
  toggleCompleted: vi.fn(),
  togglePin: vi.fn(),
}));

vi.mock("@/redux/features/todos/mapTodoErrorToModelError", () => ({
  mapTodoErrorToModelError: vi.fn(),
}));

//ヘルパー関数
const mockSuccess = (fn, value) => fn.mockResolvedValue(value);
const mockError = (fn, code, message) =>
  fn.mockRejectedValue(new ModelError(code, message));

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

const dispatch = vi.fn();
const getState = vi.fn();

describe("TodoThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("成功時:thunkはmodelを呼び,payloadを返し,副作用をdispatchする", () => {
    const targetTodo = mockTodos.find((todo) => todo.id === 1);
    test.each([
      {
        title: "saveTodo",
        fn: saveTodo,
        arg: { body: newTodo.body },
        thunk: saveTodoAsync,
        params: { body: newTodo.body },
        expected: newTodo,
        snackbarMessage: `${newTodo.body}を追加しました`,
      },
      {
        title: "fetchTodo",
        fn: fetchTodos,
        arg: undefined,
        thunk: fetchTodosAsync,
        params: undefined,
        expected: mockTodos,
        snackbarMessage: undefined,
      },

      {
        title: "deleteTodo",
        fn: deleteTodo,
        arg: targetTodo.id,
        thunk: deleteTodoAsync,
        params: { id: targetTodo.id },
        expected: targetTodo,
        snackbarMessage: `${targetTodo.body}を削除しました`,
      },
      {
        title: "toggleCompleted",
        fn: toggleCompleted,
        arg: targetTodo.id,
        thunk: toggleCompletedAsync,
        params: { id: targetTodo.id },
        expected: { ...targetTodo, completed: !targetTodo.completed },
        snackbarMessage: `${targetTodo.body}を完了に切り替えました`,
      },
      {
        title: "togglePin",
        fn: togglePin,
        arg: targetTodo.id,
        thunk: togglePinAsync,
        params: { id: targetTodo.id },
        expected: { ...targetTodo, pinned: !targetTodo.pinned },
        snackbarMessage: `${targetTodo.body}を固定に切り替えました`,
      },
    ])(
      "$title",
      async ({ fn, arg, thunk, params, expected, snackbarMessage }) => {
        mockSuccess(fn, expected);
        const result = await callThunk(thunk, params);

        expect(result.payload).toEqual(expected);

        if (arg === undefined) {
          expect(fn).toHaveBeenCalled();
        } else {
          expect(fn).toHaveBeenCalledWith(arg);
        }

        if (snackbarMessage) {
          expect(dispatch).toHaveBeenCalledWith(showSnackbar(snackbarMessage));
        } else {
          expect(dispatch).not.toHaveBeenCalledWith(
            showSnackbar(expect.anything()),
          );
        }
      },
    );
  });

  describe("失敗:ModelErrorの場合,rejectWithValueのpayloadを返す", () => {
    test.each([
      {
        title: "saveTodo",
        fn: saveTodo,
        thunk: saveTodoAsync,
        params: { body: newTodo.body },
      },

      { title: "fetchTodos", fn: fetchTodos, thunk: fetchTodosAsync },
      {
        title: "deleteTodo",
        fn: deleteTodo,
        thunk: deleteTodoAsync,
        params: { id: mockTodos.find((todo) => todo.id === 1) },
      },
      {
        title: "toggleCompleted",
        fn: toggleCompleted,
        thunk: toggleCompletedAsync,
        params: { id: mockTodos.find((todo) => todo.id === 1) },
      },
      {
        title: "togglePin",
        fn: togglePin,
        thunk: togglePinAsync,
        params: { id: mockTodos.find((todo) => todo.id === 1) },
      },
    ])("$title", async ({ fn, thunk, params }) => {
      const normalizedError = new ModelError(
        MODEL_ERROR_CODE.NETWORK,
        "エラー",
      );

      mockError(fn, normalizedError.code, normalizedError.message);
      mapTodoErrorToModelError.mockReturnValue(normalizedError);

      const result = await callThunk(thunk, params);

      expect(result.payload).toEqual({
        code: MODEL_ERROR_CODE.NETWORK,
        message: "エラー",
      });

      expect(mapTodoErrorToModelError).toHaveBeenCalledWith(
        expect.any(ModelError),
      );
    });
  });
});
