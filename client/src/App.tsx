import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/DashboardPage";


function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
