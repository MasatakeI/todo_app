//  @/redux/features/utils/createModelThunk

import { createAsyncThunk } from "@reduxjs/toolkit";

import { ModelError } from "@/models/errors/ModelError";

export const createModelThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, thunkApi) => {
    try {
      return await fn(arg, thunkApi);
    } catch (error) {
      const payload =
        error instanceof ModelError
          ? { code: error.code, message: error.message }
          : { code: "UNKNOWN", message: "予期せぬエラー" };

      return thunkApi.rejectWithValue(payload);
    }
  });
