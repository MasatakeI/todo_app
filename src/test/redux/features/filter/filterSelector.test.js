// @/test/redux/features/filter/filterSelector.test.js

import { selectFilteredTodos } from "@/redux/features/filter/filterSelector";

import { describe, test, expect } from "vitest";

import { mockTodos } from "../fixtures/todoFixture";
import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
  FILTER_PINNED,
  FILTER_IMPORTANT,
} from "@/redux/features/utils/filterType";
import { todosInitialState } from "@/redux/features/todos/todosSlice";

//ヘルパー関数

describe("selectFilteredTodos", () => {
  describe("filterType に応じた絞り込み", () => {
    test.each([
      {
        title: "FILTER_ALL",
        type: FILTER_ALL,
        expected: mockTodos,
      },
      {
        title: "FILTER_ACTIVE",
        type: FILTER_ACTIVE,
        expected: mockTodos.filter((todo) => !todo.completed),
      },
      {
        title: "FILTER_COMPLETED",
        type: FILTER_COMPLETED,
        expected: mockTodos.filter((todo) => todo.completed),
      },
      {
        title: "FILTER_PINNED",
        type: FILTER_PINNED,
        expected: mockTodos.filter((todo) => todo.pinned),
      },
      {
        title: "FILTER_IMPORTANT",
        type: FILTER_IMPORTANT,
        expected: mockTodos.filter((todo) => todo.important),
      },
      {
        title: "無効なtype",
        type: "AAA_BBB",
        expected: mockTodos,
      },
    ])("$title の時", ({ type, expected }) => {
      const prev = {
        todos: { ...todosInitialState, todos: mockTodos },
        filter: { filterType: type },
      };

      const result = selectFilteredTodos(prev);

      expect(result).toHaveLength(expected.length);
      expect(result.map((t) => t.id)).toEqual(
        expect.arrayContaining(expected.map((t) => t.id)),
      );
    });
    test("todosが空でもエラーにならない", () => {
      const prev = {
        todos: { ...todosInitialState, todos: [] },
        filter: { filterType: FILTER_ACTIVE },
      };

      const result = selectFilteredTodos(prev);
      expect(result.map((t) => t.id)).toEqual([]);
    });
  });

  test("pinned を優先し、同一 pinned 内では date の降順で並ぶ", () => {
    const state = {
      todos: { ...todosInitialState, todos: mockTodos },
      filter: { filterType: FILTER_ALL },
    };

    const result = selectFilteredTodos(state);
    expect(result.map((t) => t.id)).toEqual([2, 3, 1]);
  });
});
