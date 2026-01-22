// models/errors/ModelError.js

export const MODEL_ERROR_CODE = {
  VALIDATION: "VALIDATION",
  REQUIRED: "REQUIRED",
  INVALID_DATA: "INVALID_DATA",
  NOT_FOUND: "NOT_FOUND",
  NETWORK: "NETWORK",
  UNKNOWN: "UNKNOWN",
};

export class ModelError extends Error {
  constructor(code, message, cause) {
    const resolvedCode = Object.values(MODEL_ERROR_CODE).includes(code)
      ? code
      : MODEL_ERROR_CODE.UNKNOWN;

    super(message ?? resolvedCode);
    this.name = "ModelError";
    this.code = resolvedCode;

    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}
