import React from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router";

import Home from "./components/page/Home/Home";
import Main from "./components/page/Main/Main";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";

const App = () => {
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
      </div>
    </Router>
  );
};

export default App;
