// @/components/widgets/Filter/Filter.jsx

import React from "react";
import "./Filter.css";
import Button from "@/components/common/Button/Button";

import {
  FILTER_ACTIVE,
  FILTER_ALL,
  FILTER_COMPLETED,
  FILTER_PINNED,
  FILTER_IMPORTANT,
} from "@/redux/features/utils/filterType";

import { useDispatch, useSelector } from "react-redux";

import { setFilterType } from "@/redux/features/filter/filterSlice";
import { selectFilterType } from "@/redux/features/filter/filterSelector";

const Filter = () => {
  const dispatch = useDispatch();
  const filterType = useSelector(selectFilterType);

  const filterButtons = [
    { type: FILTER_ALL, text: "すべて" },
    { type: FILTER_IMPORTANT, text: "重要" },
    { type: FILTER_PINNED, text: "固定" },
    { type: FILTER_ACTIVE, text: "未完了" },
    { type: FILTER_COMPLETED, text: "完了" },
  ];
  return (
    <div className="filter">
      {filterButtons.map((btn, index) => {
        const isActive = filterType === btn.type;
        return (
          <Button
            key={index}
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
