// @/test/redux/features/snackbar/snackbarSlice.js

import { expect } from "vitest";
import snackbarSlice, {
  snackbarInitialState,
  showSnackbar,
  hideSnackbar,
  clearSnackbar,
} from "@/redux/features/snackbar/snackbarSlice";

describe("snackbarSlice", () => {
  test("初期stateのtest", () => {
    expect(snackbarInitialState).toEqual({
      snackbarMessage: "",
      snackbarOpen: false,
    });
  });

  test("showSnackbar:スナックバーを開きメッセージを設定する", () => {
    const message = "aaを追加しました";
    const action = showSnackbar(message);
    const state = snackbarSlice(snackbarInitialState, action);
    expect(state).toEqual({
      snackbarMessage: message,
      snackbarOpen: true,
    });
  });

  test("hideSnackbar:スナックバーを閉じる", () => {
    const message = "aaを追加しました";
    const prev = {
      ...snackbarInitialState,
      snackbarMessage: message,
      snackbarOpen: true,
    };

    const action = hideSnackbar();
    const state = snackbarSlice(prev, action);
    expect(state).toEqual({
      snackbarMessage: message,
      snackbarOpen: false,
    });
  });

  test("clearSnackbar:スナックバーの状態を初期値にする", () => {
    const message = "aaを追加しました";
    const prev = {
      ...snackbarInitialState,
      snackbarMessage: message,
      snackbarOpen: true,
    };

    const action = clearSnackbar();
    const state = snackbarSlice(prev, action);
    expect(state).toEqual(snackbarInitialState);
  });
});
