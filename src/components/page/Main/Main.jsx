import React, { useEffect } from "react";
import "./Main.css";

import TextBox from "@/components/widgets/TextBox/TextBox";
import Filter from "@/components/widgets/Filter/Filter";
import TodoList from "@/components/widgets/TodoList/TodoList";
import BackToHomeLink from "@/components/common/BackToHomeLink/BackToHomeLink";

import { useDispatch } from "react-redux";
import { fetchTodosAsync } from "@/redux/features/todos/todosThunks";

const Main = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodosAsync());
  }, [dispatch]);

  return (
    <>
      <TextBox />
      <Filter />
      <TodoList />
      <BackToHomeLink />
    </>
  );
};

export default Main;
