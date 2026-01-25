// @/test/redux/features/filter/filterSelector.test.js

import { selectFilteredTodos } from "@/redux/features/filter/filterSelector";

import { describe, test, expect } from "vitest";

import { mockTodos } from "../fixtures/todoFixture";
import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
} from "@/redux/features/utils/filterType";
import { todosInitialState } from "@/redux/features/todos/todosSlice";

//ヘルパー関数

describe("selectFilteredTodos", () => {
  describe("filterTypeによってフィルタリングされたtodosを返す", () => {
    test.each([
      { title: "FILTER_ALL", type: FILTER_ALL, todos: mockTodos },
      {
        title: "FILTER_ACTIVE",
        type: FILTER_ACTIVE,
        todos: mockTodos.filter((todo) => !todo.completed),
      },
      {
        title: "FILTER_COMPLETED",
        type: FILTER_COMPLETED,
        todos: mockTodos.filter((todo) => todo.completed),
      },
      {
        title: "無効なtype",
        type: "AAA_BBB",
        todos: mockTodos,
      },
    ])("$title の時", ({ type, todos }) => {
      const prev = {
        todos: { ...todosInitialState, todos: mockTodos },
        filter: { filterType: type },
      };

      const result = selectFilteredTodos(prev);
      expect(result).toEqual(todos);
    });
    test("todosが空でもエラーにならない", () => {
      const prev = {
        todos: { ...todosInitialState, todos: [] },
        filter: { filterType: FILTER_ACTIVE },
      };

      const result = selectFilteredTodos(prev);
      expect(result).toEqual([]);
    });
  });
});
