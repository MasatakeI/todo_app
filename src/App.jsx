import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router";

import Home from "./components/page/Home/Home";
import Main from "./components/page/Main/Main";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";

import { useDispatch, useSelector } from "react-redux";
import {
  hideSnackbar,
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSlice";

const App = () => {
  const dispatch = useDispatch();
  const snackbarMessage = useSelector(selectSnackbarMessage);
  const snakcbarOpen = useSelector(selectSnackbarOpen);
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </div>
        <Footer />

        <SimpleSnackbar
          isOpen={snakcbarOpen}
          onClose={() => dispatch(hideSnackbar())}
          message={snackbarMessage}
        />
      </div>
    </Router>
  );
};

export default App;
