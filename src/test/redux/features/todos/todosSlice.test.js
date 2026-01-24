// @/test/redux/features/todos/todosSlice.test.js

import { describe, test, expect } from "vitest";

import {
  saveTodoAsync,
  fetchTodosAsync,
  deleteTodoAsync,
  toggleTodoAsync,
} from "@/redux/features/todos/todosThunks";

import todosSlice, {
  todosInitialState,
} from "@/redux/features/todos/todosSlice";

import { mockTodos, newTodo } from "../fixtures/todoFixture";
import { MODEL_ERROR_CODE } from "@/models/errors/ModelError";

// ヘルパー関数
const applyPending = (slice, thunk, prev = todosInitialState) =>
  slice(prev, thunk.pending(prev));

const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejected = (slice, thunk, payload, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, payload));

describe("todosSlice", () => {
  test("stateの初期値のテスト", () => {
    expect(todosInitialState).toEqual({
      canPost: true,
      isLoading: false,
      todos: [],
      error: null,
      isDeleting: false,
      isToggling: false,
    });
  });

  describe("saveTodoAsync", () => {
    const pending = applyPending(todosSlice, saveTodoAsync);
    test("fulfilled時:canPostをtrueに戻しtodoを追加する", async () => {
      expect(pending).toEqual({
        ...todosInitialState,
        canPost: false,
      });

      const fulfilled = applyFulfilled(
        todosSlice,
        saveTodoAsync,
        newTodo,
        pending,
      );

      expect(fulfilled).toEqual({
        ...pending,
        canPost: true,
        error: null,
        todos: [newTodo],
      });
    });
  });

  describe("fetchTodosAsync", () => {
    const pending = applyPending(todosSlice, fetchTodosAsync);
    test("fulfilled時:isLoadingをfalseに戻しtodosを取得する", async () => {
      expect(pending).toEqual({
        ...todosInitialState,
        isLoading: true,
      });

      const fulfilled = applyFulfilled(
        todosSlice,
        fetchTodosAsync,
        mockTodos,
        pending,
      );
      expect(fulfilled).toEqual({
        ...pending,
        isLoading: false,
        todos: mockTodos,
        error: null,
      });
    });
  });

  describe("deleteTodoAsync", () => {
    const prev = {
      ...todosInitialState,
      todos: mockTodos,
    };
    const pending = applyPending(todosSlice, deleteTodoAsync, prev);

    test("fulfilled時:isDeletingをfalseに戻し指定したtodoオブジェクトをtodos配列から削除する", async () => {
      expect(pending).toEqual({
        ...prev,
        isDeleting: true,
      });

      const targetTodo = mockTodos[0];

      const fulfilled = applyFulfilled(
        todosSlice,
        deleteTodoAsync,
        targetTodo,
        pending,
      );

      const expectedTodos = mockTodos.filter(
        (todo) => todo.id !== targetTodo.id,
      );
      expect(fulfilled).toEqual({
        ...pending,
        isDeleting: false,
        todos: expectedTodos,
        error: null,
      });
    });
  });
  describe("toggleTodoAsync", () => {
    const prev = {
      ...todosInitialState,
      todos: mockTodos,
    };
    const pending = applyPending(todosSlice, toggleTodoAsync, prev);
    test("fulfilled時:isTogglingをfalseに戻し指定したtodoオブジェクトのcompletedを反転してtodo配列を設定する", async () => {
      expect(pending).toEqual({
        ...prev,
        isToggling: true,
      });

      const targetTodo = mockTodos[0];

      const fulfilled = applyFulfilled(
        todosSlice,
        toggleTodoAsync,
        targetTodo,
        pending,
      );

      const expectedTodos = mockTodos.map((todo) =>
        todo.id === targetTodo.id ? targetTodo : todo,
      );

      expect(fulfilled).toEqual({
        ...pending,
        isToggling: false,
        todos: expectedTodos,
        error: null,
      });
    });
  });

  describe.each([
    saveTodoAsync,
    fetchTodosAsync,
    deleteTodoAsync,
    toggleTodoAsync,
  ])("rejected共通処理", (fn) => {
    test(`${fn.typePrefix}`, () => {
      const error = {
        code: MODEL_ERROR_CODE.NETWORK,
        message: `失敗`,
      };
      const pending = applyPending(todosSlice, fn);

      const rejected = applyRejected(todosSlice, fn, error, pending);

      expect(rejected).toEqual({
        ...pending,
        canPost: true,
        isLoading: false,
        isDeleting: false,
        isToggling: false,
        error: error,
      });
    });
  });
});
