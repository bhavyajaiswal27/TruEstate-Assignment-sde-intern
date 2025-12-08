import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/DashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
