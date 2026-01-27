// @/test/components/widgets/TodoCard/TodoCard.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { describe, test, expect, vi, beforeEach } from "vitest";

import TodoCard from "@/components/widgets/TodoCard/TodoCard";

const onDelete = vi.fn();
const onToggle = vi.fn();
const onPin = vi.fn();
const onImportant = vi.fn();

describe("<TodoCard/>", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TodoCardが描写される", () => {
    test.each([
      { title: "completed=true", completed: true, text: "未完了に戻す" },
      { title: "completed=false", completed: false, text: "完了にする" },
    ])("$title の時", ({ completed, text }) => {
      render(
        <TodoCard
          id={1}
          body="test body"
          date="2020/01/01 12:00"
          completed={completed}
          pinned={false}
          important={false}
          onDelete={onDelete}
          onToggle={onToggle}
          onPin={onPin}
          onImportant={onImportant}
        />,
      );

      expect(screen.getByText("test body")).toBeInTheDocument();
      expect(screen.getByText("2020/01/01 12:00")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: text })).toBeInTheDocument();
    });
  });
  describe("各アクションボタンを押すと対応するハンドラが呼ばれる", () => {
    test.each([
      {
        title: "重要ボタン(important=false)",
        label: "重要にする",
        fn: onImportant,
      },
      { title: "固定ボタン(pinned=false)", label: "固定", fn: onPin },
      {
        title: "完了ボタン(completed=false)",
        label: "完了にする",
        fn: onToggle,
      },
      { title: "削除ボタン", label: "削除", fn: onDelete },
    ])("$title", async ({ label, fn }) => {
      render(
        <TodoCard
          id={1}
          body="test body"
          date="2020/01/01 12:00"
          completed={false}
          pinned={false}
          important={false}
          onDelete={onDelete}
          onToggle={onToggle}
          onPin={onPin}
          onImportant={onImportant}
        />,
      );

      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: label }));

      expect(fn).toHaveBeenCalledWith(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
