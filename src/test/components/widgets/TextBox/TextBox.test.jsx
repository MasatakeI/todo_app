// @/src/test/widgets/TextBox/TextBox.test.jsx

import { screen, fireEvent } from "@testing-library/react";

import { describe, test, expect, vi, beforeEach } from "vitest";

import TextBox from "@/components/widgets/TextBox/TextBox";
import todosReducer from "@/redux/features/todos/todosSlice";
import { renderWithStore } from "@/test/utils/renderWithStore";

import * as todosThunks from "@/redux/features/todos/todosThunks";

const spy = vi.spyOn(todosThunks, "saveTodoAsync");

describe("TextBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("canPost=false の場合、追加ボタンを押しても dispatch されない", () => {
    const { dispatchSpy } = renderWithStore(<TextBox />, {
      reducers: { todos: todosReducer },
      preloadedState: {
        todos: {
          canPost: false,
        },
      },
    });

    fireEvent.click(screen.getByText("追加"));
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  test("canPost=true かつ入力ありの場合、追加処理が dispatch される", () => {
    const { dispatchSpy } = renderWithStore(<TextBox />, {
      reducers: { todos: todosReducer },
      preloadedState: { todos: { canPost: true } },
    });
    fireEvent.change(screen.getByPlaceholderText("ここに入力"), {
      target: { value: "test todo" },
    });

    fireEvent.click(screen.getByText("追加"));

    expect(spy).toHaveBeenCalledWith({ body: "test todo" });
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });
});
