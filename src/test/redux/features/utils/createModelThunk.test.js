//  @/test/redux/features/utils/createModelThunk

import { describe, test, expect, vi } from "vitest";
import { createModelThunk } from "@/redux/features/utils/createModelThunk";
import { ModelError, MODEL_ERROR_CODE } from "@/models/errors/ModelError";

const dispatch = vi.fn();
const getState = vi.fn();

describe("createModelThunk", () => {
  test("正常終了時はfulfilledになる", async () => {
    const thunk = createModelThunk("test/success", async () => {
      return "Success";
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe("test/success/fulfilled");
    expect(result.payload).toBe("Success");
  });

  test("ModelErrorの場合,rejectWithValueされる", async () => {
    const thunk = createModelThunk("test/modelError", async () => {
      throw new ModelError(MODEL_ERROR_CODE.REQUIRED, "必須です");
    });

    const result = await thunk()(dispatch, getState, undefined);

    // expect(result.type).toBe("test/modelError/rejected");
    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: MODEL_ERROR_CODE.REQUIRED,
      message: "必須です",
    });
    expect(result.meta.rejectedWithValue).toBe(true);
  });

  test("ModelError以外はUNKNOWNでrejectされる", async () => {
    const thunk = createModelThunk("test/unkownError", async () => {
      throw new Error("予期せぬエラー");
    });

    const result = await thunk()(dispatch, getState, undefined);

    // expect(result.type).toBe("test/unkownError/rejected");
    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: MODEL_ERROR_CODE.UNKNOWN,
      message: "予期せぬエラー",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });
});
