import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createTodo,
  addTodo,
  fetchTodos,
  deleteTodo,
  toggleCompleted,
  togglePin,
  toggleImportant,
} from "@/models/TodoModel";

import { ModelError, MODEL_ERROR_CODE } from "@/models/errors/ModelError";
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";

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

const mockDocRef = { id: "123" };
const mockSnapShot = {
  exists: () => true,
  data: () => ({
    body: "test body",
    date: { toDate: () => new Date("2020-01-01T12:00:00") },
    completed: false,
    pinned: false,
    important: false,
  }),
};

const baseData = {
  body: "test body",
  date: { toDate: () => new Date("2020-01-01T12:00:00") },
  completed: false,
  pinned: false,
  important: false,
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
        pinned: false,
        important: false,
      });
    });

    test("失敗:壊れたデータの場合,ModelErrorをスローする", () => {
      const id = 1;
      const brokenData = {
        ...baseData,
        completed: "@@@@@",
        date: true,
      };

      expect(() => createTodo(id, brokenData)).toThrow(
        new ModelError(MODEL_ERROR_CODE.INVALID_DATA),
      );
    });
  });

  describe("addTodo", () => {
    test("成功:保存したtodoオブジェクトを返す", async () => {
      addDoc.mockResolvedValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);

      const result = await addTodo({ body: mockSnapShot.data().body });

      expect(result).toEqual({
        id: "123",
        body: "test body",
        date: "2020/01/01 12:00",
        completed: false,
        pinned: false,
        important: false,
      });
    });

    test("bodyが空の場合:ModelErrorをスローする", async () => {
      await expect(addTodo({ body: " " })).rejects.toThrow(
        new ModelError(MODEL_ERROR_CODE.REQUIRED, "1文字以上の入力必須です"),
      );
    });

    test("addDocが失敗の場合", async () => {
      addDoc.mockRejectedValue(new ModelError("addDoc error"));
      getDoc.mockResolvedValue(mockSnapShot);

      await expect(addTodo({ body: "aa" })).rejects.toBeInstanceOf(ModelError);
    });
    test("getDocが失敗の場合", async () => {
      addDoc.mockResolvedValue(mockDocRef);
      getDoc.mockRejectedValue(new ModelError("getDoc error"));

      await expect(addTodo({ body: "aa" })).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });
    });

    test("データベースのデータが存在しない場合", async () => {
      addDoc.mockResolvedValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(addTodo({ body: "aa" })).rejects.toThrow(
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
          pinned: false,
          important: false,
        },
      ]);

      expect(query).toHaveBeenCalledTimes(1);
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
        date: true,
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
    test("成功:削除したTodoオブジェクトを返す", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      deleteDoc.mockResolvedValue();

      const result = await deleteTodo(mockDocRef.id);
      expect(result).toEqual({
        id: "123",
        body: "test body",
        date: "2020/01/01 12:00",
        completed: false,
        pinned: false,
        important: false,
      });
      expect(doc).toHaveBeenCalledTimes(1);

      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    test("データベースのデータが存在しない場合,ModelErrorをスローする", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(deleteTodo(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.NOT_FOUND,
      });

      expect(deleteDoc).not.toHaveBeenCalled();
    });

    test("deleteDocが失敗の場合", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      deleteDoc.mockRejectedValue(new ModelError("deleteDoc error"));

      await expect(deleteTodo(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });

      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
    test("getDocが失敗の場合", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockRejectedValue(new ModelError("getDoc error"));

      await expect(deleteTodo(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });

      expect(deleteDoc).not.toHaveBeenCalled();
    });
  });

  describe("toggleCompleted", () => {
    test("成功:toggle後のTodoオブジェクトを返す", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      updateDoc.mockResolvedValue();

      const result = await toggleCompleted(mockDocRef.id);
      expect(result).toEqual({
        id: "123",
        body: "test body",
        date: "2020/01/01 12:00",
        completed: true,
        pinned: false,
        important: false,
      });

      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { completed: true });
    });

    test("データベースのデータが存在しない場合,ModelErrorをスローする", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(toggleCompleted(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.NOT_FOUND,
      });
    });

    test("updateDocが失敗の場合", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      updateDoc.mockRejectedValue(new ModelError("updateDoc error"));

      await expect(toggleCompleted(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });
    });
    test("getDocが失敗の場合", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockRejectedValue(new ModelError("getDoc error"));

      await expect(toggleCompleted(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });
  });

  describe("togglePin", () => {
    test("成功:togglePin後のTodoオブジェクトを返す", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      updateDoc.mockResolvedValue();

      const result = await togglePin(mockDocRef.id);
      expect(result).toEqual({
        id: "123",
        body: "test body",
        date: "2020/01/01 12:00",
        completed: false,
        pinned: true,
        important: false,
      });

      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { pinned: true });
    });

    test("データベースのデータが存在しない場合,ModelErrorをスローする", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(togglePin(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.NOT_FOUND,
      });
    });

    test("updateDocが失敗の場合", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      updateDoc.mockRejectedValue(new ModelError("updateDoc error"));

      await expect(togglePin(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });
    });
    test("getDocが失敗の場合", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockRejectedValue(new ModelError("getDoc error"));

      await expect(togglePin(1)).rejects.toMatchObject({
        code: MODEL_ERROR_CODE.UNKNOWN,
      });

      expect(updateDoc).not.toHaveBeenCalled();
    });
  });
});
