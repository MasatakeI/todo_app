// @/test/components/widgets/TodoList/TodoList.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";

import TodoList from "@/components/widgets/TodoList/TodoList";

import { mockTodos } from "@/test/redux/features/fixtures/todoFixture";
import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
} from "@/redux/features/utils/filterType";

import { renderWithStore } from "@/test/utils/renderWithStore";

import todosReducer from "@/redux/features/todos/todosSlice";
import filterReducer from "@/redux/features/filter/filterSlice";

describe("TodoList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("todosが表示される", () => {
    renderWithStore(<TodoList />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: {
          isLoading: false,
          todos: mockTodos,
        },
        filter: {
          filterType: FILTER_ALL,
        },
      },
    });

    mockTodos.forEach((todo) => {
      expect(screen.getByText(todo.body)).toBeInTheDocument();
      expect(screen.getByText(todo.date)).toBeInTheDocument();
    });
  });

  test("todosが0件の時メッセージを表示", () => {
    renderWithStore(<TodoList />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: {
          isLoading: false,
          todos: [],
        },
        filter: {
          filterType: FILTER_ALL,
        },
      },
    });

    expect(screen.getByText("todos:0件")).toBeInTheDocument();
  });

  test("isLoading=trueの時スピナーを表示", () => {
    renderWithStore(<TodoList />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: {
          isLoading: true,
        },
        filter: {
          filterType: FILTER_ALL,
        },
      },
    });

    expect(screen.getByRole("progressbar"), {
      name: "loading",
    }).toBeInTheDocument();
  });

  describe("指定されたfilterTypeのtodoのみ表示される", () => {
    test.each([
      {
        title: "FILTER_ACTIVE",
        type: FILTER_ACTIVE,
        displayedTodos: mockTodos.filter((todo) => !todo.completed),
        notDisplayedTodos: mockTodos.filter((todo) => todo.completed),
      },
      {
        title: "FILTER_COMPLETED",
        type: FILTER_COMPLETED,
        displayedTodos: mockTodos.filter((todo) => todo.completed),
        notDisplayedTodos: mockTodos.filter((todo) => !todo.completed),
      },
    ])("$title の時", ({ type, displayedTodos, notDisplayedTodos }) => {
      renderWithStore(<TodoList />, {
        reducers: { todos: todosReducer, filter: filterReducer },
        preloadedState: {
          todos: { isLoading: false, todos: mockTodos },
          filter: { filterType: type },
        },
      });

      displayedTodos.forEach((todo) => {
        expect(screen.getByText(todo.body)).toBeInTheDocument();
      });
      notDisplayedTodos.forEach((todo) => {
        expect(screen.queryByText(todo.body)).not.toBeInTheDocument();
      });
    });
  });

  // deleteTodoAsync,toggleTodoAsyncのdispatchされたかのテストはuseTodoList.test.jsxで実施済みのため省略
});
