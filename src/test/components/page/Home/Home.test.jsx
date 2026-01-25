// @/test/components/page/Home/Home.test.jsx
import { describe, expect, test, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { renderWithStore } from "@/test/utils/renderWithStore";

import Home from "@/components/page/Home/Home";

import { useNavigate } from "react-router";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ボタン(Mainページへ移動)が表示される", () => {
    render(<Home />);
    expect(screen.getByText("Mainページへ移動")).toBeInTheDocument();
  });

  test("ボタンをクリックするとnaigateが呼ばれる", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Mainページへ移動"));
    expect(mockNavigate).toHaveBeenCalledWith("/main");
  });
});
