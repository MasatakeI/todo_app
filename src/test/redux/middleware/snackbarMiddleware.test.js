//@/test/redux/middleware/snackbarMiddleware.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

import { snackbarMiddleware } from "@/redux/middleware/snackbarMiddleware";

vi.mock("@reduxjs/toolkit", async () => {
  const actual = await vi.importActual("@reduxjs/toolkit");

  return {
    ...actual,
    isRejectedWithValue: vi.fn(),
  };
});

const dispatch = vi.fn();
const next = vi.fn();
const store = { dispatch };

describe("snackbarMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("rejectWithValueされたactionでsnacbarをdispatchする", () => {
    isRejectedWithValue.mockReturnValue(true);

    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {
        message: "追加/削除/トグル 失敗",
      },
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(
      showSnackbar("追加/削除/トグル 失敗"),
    );

    expect(next).toHaveBeenCalledWith(action);
  });

  test("payload.messageがない場合はデフォルト文言", () => {
    isRejectedWithValue.mockReturnValue(true);

    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {},
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar("エラーが発生しました"));
  });

  test("isRejectedWithValueがfalseの場合はdispatchを呼ばない", () => {
    isRejectedWithValue.mockReturnValue(false);

    const middleware = snackbarMiddleware(store)(next);

    const action = {
      payload: {
        message: "追加/削除/トグル 成功",
      },
    };

    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(dispatch).not.toHaveBeenCalledWith();
  });

  test("snackbar action自身ではsnackbarを再dispatchしない", () => {
    isRejectedWithValue.mockReturnValue(true);
    const middleware = snackbarMiddleware(store)(next);

    const action = {
      type: "snackbar/showSnackbar",
      payload: { message: "再帰防止" },
    };

    middleware(action);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
