import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Filter from "@/components/widgets/Filter/Filter";
import filterReducer from "@/redux/features/filter/filterSlice";
import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
  FILTER_IMPORTANT,
  FILTER_PINNED,
} from "@/redux/features/utils/filterType";

import { renderWithStore } from "@/test/utils/renderWithStore";
import userEvent from "@testing-library/user-event";

const FILTER_CASES = [
  { type: FILTER_ALL, text: "すべて" },
  { type: FILTER_ACTIVE, text: "未完了" },
  { type: FILTER_COMPLETED, text: "完了" },
  { type: FILTER_PINNED, text: "固定" },
  { type: FILTER_IMPORTANT, text: "重要" },
];

const renderFilter = (filterType = FILTER_ALL) => {
  return renderWithStore(<Filter />, {
    reducers: { filter: filterReducer },
    preloadedState: {
      filter: { filterType },
    },
  });
};

describe("Filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("フィルターボタンが表示される", () => {
    renderFilter();
    FILTER_CASES.forEach(({ text }) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  describe("フィルターボタンをクリックするとフィルターが変更される", () => {
    test.each(FILTER_CASES)("$type", async ({ type, text }) => {
      const { dispatchSpy } = renderFilter(type);

      const user = userEvent.setup();

      await user.click(screen.getByText(text));

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "filter/setFilterType",
          payload: type,
        }),
      );
    });
  });

  describe("選択中のフィルターボタンがactiveになる", () => {
    test.each(FILTER_CASES)("$type", ({ type, text }) => {
      renderFilter(type);
      const activeButton = screen.getByText(text);

      expect(activeButton).toHaveAttribute("aria-pressed", "true");
    });
  });
});
