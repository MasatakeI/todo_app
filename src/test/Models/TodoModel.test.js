import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createTodo,
  saveTodo,
  fetchTodos,
  deleteTodo,
  toggleTodo,
} from "../../models/TodoModel";

import { ModelError, MODEL_ERROR_CODE } from "../../models/errors/ModelError";
import { addDoc, getDoc, getDocs, query } from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  updateDoc: vi.fn(),
  getFirestore: vi.fn(),
  collection: vi.fn(),
}));

const mockDocRef = { id: 123 };
const mockSnapShot = {
  exists: () => true,
  data: () => ({
    body: "test body",
    date: { toDate: () => new Date("2020-01-01T12:00:00") },
    completed: false,
  }),
};

const baseData = {
  body: "test body",
  date: { toDate: () => new Date("2020-01-01T12:00:00") },
  completed: false,
};

describe("TodoModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTodo", () => {
    test("成功:データを整形し,フォーマットされたTodoオブジェクトを返す", async () => {
      const id = 1;

      const result = createTodo(id, baseData);

      expect(result).toEqual({
        id: 1,
        body: "test body",
        date: "2020/01/01 12:00",
        completed: false,
      });
    });

    test("失敗:壊れたデータの場合,ModelErrorをスローする", () => {
      const id = 1;
      const brokenData = {
        ...baseData,
        completed: "@@@@@",
      };

      expect(() => createTodo(id, brokenData)).toThrow(
        new ModelError(MODEL_ERROR_CODE.INVALID_DATA),
      );
    });
  });

  describe("saveTodo", () => {
    test("成功:保存したtodoオブジェクトを返す", async () => {
      addDoc.mockResolvedValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);

      const result = await saveTodo({ body: mockSnapShot.data().body });

      expect(result).toEqual({
        id: 123,
        body: "test body",
        date: "2020/01/01 12:00",
        completed: false,
      });
    });

    test("bodyが空の場合:ModelErrorをスローする", async () => {
      await expect(saveTodo({ body: " " })).rejects.toThrow(
        new ModelError(MODEL_ERROR_CODE.REQUIRED),
      );
    });

    test("addDocが失敗の場合", async () => {
      addDoc.mockRejectedValue(new ModelError("addDoc error"));
      getDoc.mockResolvedValue(mockSnapShot);

      await expect(saveTodo({ body: "aa" })).rejects.toBeInstanceOf(ModelError);
    });
    test("getDocが失敗の場合", async () => {
      addDoc.mockResolvedValue(mockDocRef);
      getDoc.mockRejectedValue(new ModelError("getDoc error"));

      await expect(saveTodo({ body: "aa" })).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });
    });

    test("データベースのデータが存在しない場合", async () => {
      addDoc.mockResolvedValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(saveTodo({ body: "aa" })).rejects.toThrow(
        new ModelError(MODEL_ERROR_CODE.NOT_FOUND),
      );
    });
  });

  describe("fetchTodos", () => {
    const mockQuery = {};
    test("成功:データベースのtodos配列を取得し,フォーマットして返す", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [
          {
            id: 99,
            data: () => baseData,
          },
        ],
      });

      const result = await fetchTodos();
      expect(result).toEqual([
        {
          id: 99,
          body: "test body",
          date: "2020/01/01 12:00",
          completed: false,
        },
      ]);
    });

    test("データベースに配列が存在しない場合,空配列を返す", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [],
      });
      const result = await fetchTodos();
      expect(result).toEqual([]);
    });

    test("getDocsが失敗の場合", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockRejectedValue(new ModelError("getDocs error"));
      await expect(fetchTodos()).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });
    });

    test("不正なデータが含まれる場合,ModelErrorをスローする", async () => {
      const brokenData = {
        ...baseData,
        completed: "@@@",
      };
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [
          {
            id: 99,
            data: () => brokenData,
          },
        ],
      });

      await expect(fetchTodos()).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.INVALID_DATA,
      });
    });
  });

  describe("deleteTodo", () => {
    test("成功:", async () => {});
  });

  describe("toggleTodo", () => {
    test("成功:", async () => {});
  });
});
