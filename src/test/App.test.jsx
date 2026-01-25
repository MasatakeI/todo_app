import { describe, test, expect, vi, beforeEach } from "vitest";

import App from "@/App";

import { render, screen } from "@testing-library/react";
import { renderWithStore } from "./utils/renderWithStore";
import { todosInitialState } from "@/redux/features/todos/todosSlice";
import { filterInitialState } from "@/redux/features/filter/filterSlice";

import todosReducer from "@/redux/features/todos/todosSlice";
import filterReducer from "@/redux/features/filter/filterSlice";

vi.mock("@/components/page/Home/Home", () => ({
  default: () => <div data-testid="home" />,
}));
vi.mock("@/components/page/Main/Main", () => ({
  default: () => <div data-testid="main" />,
}));
vi.mock("@/components/layout/Header/Header", () => ({
  default: () => <div data-testid="header" />,
}));
vi.mock("@/components/layout/Footer/Footer", () => ({
  default: () => <div data-testid="footer" />,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Header/Footer が常に描画される", () => {
    renderWithStore(<App />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: { ...todosInitialState },
        filter: { ...filterInitialState },
      },
    });

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("Mainページをルートとして表示できる", () => {
    window.location.hash = "#/main";
    renderWithStore(<App />, {
      reducers: { todos: todosReducer, filter: filterReducer },
      preloadedState: {
        todos: { ...todosInitialState },
        filter: { ...filterInitialState },
      },
    });
    expect(screen.getByTestId("main")).toBeInTheDocument();
  });

  //fetchTodosAsync が dispatch のテストはMain.test.jsxで実施ずみのため省略
});
