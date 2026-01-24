// @/test/redux/features/todos/mapTodoErrorToModelError.js

import { describe, test, expect, vi } from "vitest";
import { mapTodoErrorToModelError } from "@/redux/features/todos/mapTodoErrorToModelError";
import { ModelError, MODEL_ERROR_CODE } from "@/models/errors/ModelError";

describe("mapTodoErrorToModelError", () => {
  test("ModelErrorをそのまま正規化する", () => {
    const error = new ModelError(
      MODEL_ERROR_CODE.VALIDATION,
      "バリデーションエラー",
    );

    const result = mapTodoErrorToModelError(error);
    expect(result).toBe(error);
  });

  test.each([
    [
      "firestore/invalid-argument",
      MODEL_ERROR_CODE.REQUIRED,
      "1文字以上の入力必須です",
    ],
    ["firestore/not-found", MODEL_ERROR_CODE.NOT_FOUND, "todoが見つかりません"],
    [
      "firestore/permission-denied",
      MODEL_ERROR_CODE.NETWORK,
      "権限がありません",
    ],
  ])("%s を正規化する", (firebseCode, modelCode, message) => {
    const firebaseError = new Error("firebase error");
    firebaseError.code = firebseCode;

    const result = mapTodoErrorToModelError(firebaseError);

    expect(result).toBeInstanceOf(ModelError);

    expect(result.code).toBe(modelCode);
    expect(result.message).toBe(message);
    expect(result.cause).toBe(firebaseError);
  });

  test("未知のfirebaseエラーはFIRESTOREにフォールバックする", () => {
    const error = { code: "firestore/some-new-error" };
    const result = mapTodoErrorToModelError(error);

    expect(result).toMatchObject({
      code: MODEL_ERROR_CODE.NETWORK,
      message: "通信エラーが発生しました",
    });
  });

  test("エラーコードが存在しない場合,UNKNOWNを返す", () => {
    const error = { code: "@@@/@@@" };
    const result = mapTodoErrorToModelError(error);

    expect(result).toMatchObject({
      code: MODEL_ERROR_CODE.UNKNOWN,
      message: "予期せぬエラーが発生しました",
    });
  });
});
