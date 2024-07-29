import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import SelectBalance from "./components/selectBalance/SelectBalance";
import Navbar from "./components/navbar/Navbar";


function App() {
  return (
    <div className="">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/selectbalance" element={<SelectBalance/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
