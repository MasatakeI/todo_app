// @/test/redux/features/todos/todosSlice.test.js

import { describe, test, expect } from "vitest";

import {
  addTodoAsync,
  fetchTodosAsync,
  deleteTodoAsync,
  toggleCompletedAsync,
  togglePinAsync,
  toggleImportantAsync,
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
  describe("fulfilled", () => {
    describe("addTodoAsync", () => {
      const pending = applyPending(todosSlice, addTodoAsync);
      test("canPostをtrueに戻しtodoを追加する", async () => {
        expect(pending).toEqual({
          ...todosInitialState,
          canPost: false,
        });

        const fulfilled = applyFulfilled(
          todosSlice,
          addTodoAsync,
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
      test("isLoadingをfalseに戻しtodosを取得する", async () => {
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

      test("isDeletingをfalseに戻し指定したtodoオブジェクトをtodos配列から削除する", async () => {
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
    describe("toggleCompletedAsync", () => {
      const prev = {
        ...todosInitialState,
        todos: mockTodos,
      };
      const pending = applyPending(todosSlice, toggleCompletedAsync, prev);
      test("isTogglingをfalseに戻し指定したtodoオブジェクトのcompletedを反転してtodo配列を設定する", async () => {
        expect(pending).toEqual({
          ...prev,
          isToggling: true,
        });

        const targetTodo = mockTodos[0];

        const fulfilled = applyFulfilled(
          todosSlice,
          toggleCompletedAsync,
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
    describe("togglePinAsync", () => {
      const prev = {
        ...todosInitialState,
        todos: mockTodos,
      };
      const pending = applyPending(todosSlice, togglePinAsync, prev);
      test("isTogglingをfalseに戻し指定したtodoオブジェクトのpinnedを反転してtodo配列を設定する", async () => {
        expect(pending).toEqual({
          ...prev,
          isToggling: true,
        });

        const targetTodo = mockTodos[0];

        const fulfilled = applyFulfilled(
          todosSlice,
          togglePinAsync,
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

    describe("toggleImportantAsync", () => {
      const prev = {
        ...todosInitialState,
        todos: mockTodos,
      };
      const pending = applyPending(todosSlice, toggleImportantAsync, prev);
      test("isTogglingをfalseに戻し指定したtodoオブジェクトのimportantを反転してtodo配列を設定する", async () => {
        expect(pending).toEqual({
          ...prev,
          isToggling: true,
        });

        const targetTodo = mockTodos[0];

        const fulfilled = applyFulfilled(
          todosSlice,
          toggleImportantAsync,
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
  });

  describe("rejected共通処理", () => {
    test.each([
      { title: "addTodoAsync", thunk: addTodoAsync },
      { title: "fetchTodosAsync", thunk: fetchTodosAsync },
      { title: "deleteTodoAsync", thunk: deleteTodoAsync },
      { title: "toggleCompletedAsync", thunk: toggleCompletedAsync },
      { title: "togglePinAsync", thunk: togglePinAsync },
      { title: "toggleImportantAsync", thunk: toggleImportantAsync },
    ])(`$title `, ({ thunk }) => {
      const error = {
        code: MODEL_ERROR_CODE.NETWORK,
        message: `失敗`,
      };
      const pending = applyPending(todosSlice, thunk);

      const rejected = applyRejected(todosSlice, thunk, error, pending);

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
