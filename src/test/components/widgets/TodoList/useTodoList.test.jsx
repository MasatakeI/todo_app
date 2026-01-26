// @/test/components/widgets/TodoList/useTodoList.test.js

import { useTodoList } from "@/components/widgets/TodoList/useTodoList";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import * as todosThunks from "@/redux/features/todos/todosThunks";
import todosReducer, {
  todosInitialState,
} from "@/redux/features/todos/todosSlice";
import filterReducer, {
  filterInitialState,
} from "@/redux/features/filter/filterSlice";
import { mockTodos } from "@/test/redux/features/fixtures/todoFixture";

const baseState = {
  todos: {
    ...todosInitialState,
    todos: mockTodos,
  },
  filter: { ...filterInitialState },
};

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      todos: todosReducer,
      filter: filterReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { wrapper, store };
};

describe("useTodoList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("confirmDelete:正しいpayloadでdispatchされる", async () => {
    const spy = vi
      .spyOn(todosThunks, "deleteTodoAsync")
      .mockImplementation(() => () => ({
        unwrap: () => Promise.resolve(),
      }));

    const { wrapper } = setup(baseState);
    const { result } = renderHook(() => useTodoList(), { wrapper });

    await act(async () => {
      result.current.openModal(mockTodos[0].id);
    });
    await act(async () => {
      result.current.confirmDelete();
    });

    expect(spy).toHaveBeenCalledWith({
      id: mockTodos[0].id,
    });
  });

  test("toggleTodo:正しいpayloadでdispatchされる", async () => {
    const spy = vi
      .spyOn(todosThunks, "toggleTodoAsync")
      .mockImplementation(() => () => ({
        unwrap: () => Promise.resolve(),
      }));

    const { wrapper } = setup(baseState);
    const { result } = renderHook(() => useTodoList(), { wrapper });

    await act(async () => {
      result.current.toggleTodo(mockTodos[0].id);
    });

    expect(spy).toHaveBeenCalledWith({
      id: mockTodos[0].id,
    });
  });
});
