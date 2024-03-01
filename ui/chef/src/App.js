
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Prep from './pages/Prep';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="prep" element={<Prep />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
 // <Route path="*" element={<NoPage />} />
export default App;
