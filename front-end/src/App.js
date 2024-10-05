import { io } from "socket.io-client";
import Home from "./pages/Home/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import Films from "./pages/Films/Films";

export const socket = io.connect(process.env.REACT_APP_API_HOST);

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Navigate to={"home"} replace={true} />} />
            <Route path="home" element={<Home />} />
            <Route path="films" element={<Films />} />
          </Route>
        </Routes>

        <ToastContainer
          position="bottom-left"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
