import { describe, test, expect } from "vitest";

import {
  FILTER_ALL,
  FILTER_ACTIVE,
  FILTER_COMPLETED,
} from "@/redux/features/utils/filterType";

import filterSlice, {
  filterInitialState,
  setFilterType,
} from "@/redux/features/filter/filterSlice";

import { fetchTodosAsync } from "@/redux/features/todos/todosThunks";

describe("filterSlice", () => {
  test("初期stateのテスト", () => {
    expect(filterInitialState).toEqual({
      filterType: FILTER_ALL,
    });
  });
  describe("reducer:setFilterType", () => {
    test.each([FILTER_ALL, FILTER_ACTIVE, FILTER_COMPLETED])(
      `有効なfilterTypeの時,指定されたfilterTypeを設定する -%s`,
      (type) => {
        const action = setFilterType(type);
        const state = filterSlice(filterInitialState, action);
        expect(state.filterType).toBe(type);
      },
    );
    test("無効なfilterTypeの時,filterTypeは変更しない", () => {
      const action = setFilterType("@@@@@@");
      const state = filterSlice(filterInitialState, action);
      expect(state.filterType).toBe(FILTER_ALL);
    });
  });

  describe("extraReducer", () => {
    test("fetchTodosAsync.fulfilledの時,filterTypeが初期値(FILTER_ALL)になる", async () => {
      const prev = { ...filterInitialState, filterType: FILTER_COMPLETED };

      const action = fetchTodosAsync.fulfilled([], "requestId", undefined);

      const result = filterSlice(prev, action);

      expect(result.filterType).toBe(FILTER_ALL);
    });
  });
});
