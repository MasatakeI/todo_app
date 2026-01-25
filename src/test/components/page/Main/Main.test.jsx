// @/test/components/page/Main/Main.test.jsx
import { describe, expect, test, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";

import { filterInitialState } from "@/redux/features/filter/filterSlice";
import { todosInitialState } from "@/redux/features/todos/todosSlice";
import { renderWithStore } from "@/test/utils/renderWithStore";

import todosReducer from "@/redux/features/todos/todosSlice";
import filterReducer from "@/redux/features/filter/filterSlice";

import Main from "@/components/page/Main/Main";

import * as todosThunks from "@/redux/features/todos/todosThunks";

vi.mock("@/components/widgets/TextBox/TextBox", () => ({
  default: () => <div data-testid="textbox" />,
}));
vi.mock("@/components/widgets/Filter/Filter", () => ({
  default: () => <div data-testid="filter" />,
}));
vi.mock("@/components/widgets/TodoList/TodoList", () => ({
  default: () => <div data-testid="todo-list" />,
}));
vi.mock("@/components/common/BackToHomeLink/BackToHomeLink", () => ({
  default: () => <div data-testid="back-to-home-link" />,
}));

describe("Main", () => {
  let spy;
  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(todosThunks, "fetchTodosAsync");
  });

  test("mount時にfetchTodosAsyncがdispatchされる", () => {
    const { dispatchSpy } = renderWithStore(<Main />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: { ...todosInitialState },
        filter: { ...filterInitialState },
      },
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalled();
  });

  test("必要なwidgetsがすべて表示される", () => {
    renderWithStore(<Main />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: { ...todosInitialState },
        filter: { ...filterInitialState },
      },
    });

    ["textbox", "filter", "todo-list", "back-to-home-link"].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
  });
});
