// @/components/widgets/Filter/Filter.jsx

import React from "react";
import "./Filter.css";
import Button from "@/components/common/Button/Button";

import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
} from "@/redux/features/utils/filterType";

import { useDispatch, useSelector } from "react-redux";

import { setFilterType } from "@/redux/features/filter/filterSlice";
import { selectFilterType } from "@/redux/features/filter/filterSelector";

const Filter = () => {
  const dispatch = useDispatch();
  const filterType = useSelector(selectFilterType);

  const filterButtons = [
    { id: 1, type: FILTER_ALL, text: "すべて表示" },
    { id: 2, type: FILTER_ACTIVE, text: "未完了のみ表示" },
    { id: 3, type: FILTER_COMPLETED, text: "完了のみ表示" },
  ];
  return (
    <div className="filter">
      {filterButtons.map((btn) => {
        const isActive = filterType === btn.type;
        return (
          <Button
            key={btn.id}
            onClickHandler={() => dispatch(setFilterType(btn.type))}
            variant={isActive ? "secondary" : "tertiary"}
            isActive={isActive}
          >
            {btn.text}
          </Button>
        );
      })}
    </div>
  );
};

export default Filter;
