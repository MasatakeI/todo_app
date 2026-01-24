// src/redux/features/todos/mapTodoErrorToModelError.js

import { ModelError, MODEL_ERROR_CODE } from "@/models/errors/ModelError";

const TODO_ERROR_MAP = {
  "firestore/invalid-argument": {
    code: MODEL_ERROR_CODE.REQUIRED,
    message: "1文字以上の入力必須です",
  },
  "firestore/not-found": {
    code: MODEL_ERROR_CODE.NOT_FOUND,
    message: "todoが見つかりません",
  },
  "firestore/permission-denied": {
    code: MODEL_ERROR_CODE.NETWORK,
    message: "権限がありません",
  },
};

export const mapTodoErrorToModelError = (error) => {
  if (error instanceof ModelError) {
    return error;
  }

  if (
    typeof error?.code === "string" &&
    error?.code?.startsWith("firestore/")
  ) {
    const mapped = TODO_ERROR_MAP[error.code];

    if (mapped) {
      return new ModelError(mapped.code, mapped.message, error);
    }

    return new ModelError(
      MODEL_ERROR_CODE.NETWORK,
      "通信エラーが発生しました",
      error,
    );
  }

  return new ModelError(
    MODEL_ERROR_CODE.UNKNOWN,
    "予期せぬエラーが発生しました",
    error,
  );
};
