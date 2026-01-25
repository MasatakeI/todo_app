// @/test/components/widgets/TodoCard/TodoCard.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";

import { describe, test, expect, vi, beforeEach } from "vitest";

import TodoCard from "@/components/widgets/TodoCard/TodoCard";

const onDelete = vi.fn();
const onToggle = vi.fn();

describe("TodoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test.each([
    [true, "未完了に戻す"],
    [false, "完了にする"],
  ])("TodoCardが描写される(completed= %s)の時", (completed, text) => {
    render(
      <TodoCard
        id={1}
        body="test body"
        date="2020/01/01 12:00"
        completed={completed}
        onDelete={onDelete}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByText("test body")).toBeInTheDocument();
    expect(screen.getByText("2020/01/01 12:00")).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  test("削除ボタンを押すとonDeleteがid付きで呼ばれる", () => {
    render(
      <TodoCard
        id={1}
        body="test body"
        date="2020/01/01 12:00"
        completed={false}
        onDelete={onDelete}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByText("削除"));
    expect(onDelete).toHaveBeenCalledWith(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
  test("トグルボタンを押すとonToggleがid付きで呼ばれる", () => {
    render(
      <TodoCard
        id={1}
        body="test body"
        date="2020/01/01 12:00"
        completed={false}
        onDelete={onDelete}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByText("完了にする"));
    expect(onToggle).toHaveBeenCalledWith(1);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
