// test/models/errors/ModelError.js

import { describe, test, expect } from "vitest";
import { ModelError, MODEL_ERROR_CODE } from "@/models/errors/ModelError";

describe("ModelError", () => {
  test("正しいcodeとmessageを保持する", () => {
    const error = new ModelError(MODEL_ERROR_CODE.VALIDATION, "入力が不正です");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ModelError);
    expect(error.name).toBe("ModelError");
    expect(error.code).toBe(MODEL_ERROR_CODE.VALIDATION);
    expect(error.message).toBe("入力が不正です");
  });

  test("不正なcodeの場合UNKNOWNにフォールバックする", () => {
    const error = new ModelError("@@@@", "不正なcode");
    expect(error.code).toBe(MODEL_ERROR_CODE.UNKNOWN);
    expect(error.message).toBe("不正なcode");
  });

  test("messageを省略した場合,codeがmessageになる", () => {
    const error = new ModelError(MODEL_ERROR_CODE.NETWORK);
    expect(error.code).toBe(MODEL_ERROR_CODE.NETWORK);
    expect(error.message).toBe(MODEL_ERROR_CODE.NETWORK);
  });

  test("causeがErrorの場合のみ,causeがリセットされる", () => {
    const originalError = new Error("元のエラー");
    const error = new ModelError(
      MODEL_ERROR_CODE.UNKNOWN,
      "ラップしたエラー",
      originalError,
    );

    expect(error.cause).toBe(originalError);
  });

  test("causeがErrorでない場合は無視される", () => {
    const error = new ModelError(
      MODEL_ERROR_CODE.UNKNOWN,
      "エラー",
      "not-an-error",
    );

    expect(error.cause).toBeUndefined();
  });
});
