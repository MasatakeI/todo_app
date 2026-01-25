import { screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Filter from "@/components/widgets/Filter/Filter";
import filterReducer from "@/redux/features/filter/filterSlice";
import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
} from "@/redux/features/utils/filterType";

import { renderWithStore } from "@/test/utils/renderWithStore";

describe("Filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("フィルターボタンが表示される", () => {
    renderWithStore(<Filter />, {
      reducers: { filter: filterReducer },
      preloadedState: {
        filter: { filterType: FILTER_ALL },
      },
    });

    expect(screen.getByText("すべて表示")).toBeInTheDocument();
    expect(screen.getByText("完了のみ表示")).toBeInTheDocument();
    expect(screen.getByText("未完了のみ表示")).toBeInTheDocument();
  });

  test("filterTypeを変更するとsetFilterTypeがdispatchされる", () => {
    const { dispatchSpy } = renderWithStore(<Filter />, {
      reducers: {
        filter: filterReducer,
      },
      preloadedState: {
        filter: { filterType: FILTER_ACTIVE },
      },
    });

    fireEvent.click(screen.getByText("すべて表示"));

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "filter/setFilterType",
        payload: FILTER_ALL,
      }),
    );
  });

  test("選択中のフィルターボタンがactiveになる", () => {
    renderWithStore(<Filter />, {
      reducers: { filter: filterReducer },
      preloadedState: { filter: { filterType: FILTER_COMPLETED } },
    });

    const activeButton = screen.getByText("完了のみ表示");
    const inactiveButton = screen.getByText("すべて表示");

    expect(activeButton).toHaveAttribute("aria-pressed", "true");
    expect(inactiveButton).toHaveAttribute("aria-pressed", "false");
  });
});
