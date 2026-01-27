// @/components/widgets/TextBox/TextBox.jsx

import React, { useState } from "react";
import "./TextBox.css";
import Button from "@/components/common/Button/Button";

import { useDispatch, useSelector } from "react-redux";
import { selectCanPost } from "@/redux/features/todos/todosSelector";
import { addTodoAsync } from "@/redux/features/todos/todosThunks";

const TextBox = () => {
  const dispatch = useDispatch();
  const canPost = useSelector(selectCanPost);

  const [body, setBody] = useState("");

  const post = async () => {
    await dispatch(addTodoAsync({ body })).unwrap();
    setBody("");
  };

  return (
    <div className="textbox">
      <textarea
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="textbox-input"
        placeholder="ここに入力"
      ></textarea>

      <div className="textbox-button">
        <Button onClickHandler={post} clickable={canPost}>
          追加
        </Button>
      </div>
    </div>
  );
};
export default TextBox;
