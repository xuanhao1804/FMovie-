import { io } from "socket.io-client";
import Home from "./pages/Home/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Films from "./pages/Films/Films";
import Header from "./components/Header/Header";
import Authentication from "./pages/Authentication/Authentication";
import Playing from "./pages/Films/Playing/Playing";
import Upcoming from "./pages/Films/Upcoming/Upcoming";
import CinemaDetail from "./pages/Cinemas/CinemaIntro";  // Thêm import CinemaDetail
import FilmDetail from "./pages/FilmDetail/FilmDetail";
import CustomFooter from "./components/Footer/Footer";
import Booking from "./pages/Booking/Booking";
import { useDispatch } from "react-redux"
import { useEffect } from "react";
import { fetchCities } from "./reducers/CityReducer";
import CinemaMovies from "./pages/Films/CinemaMovies/CinemaMovies";
import ManageMovie from "./pages/ManageMovie/ManageMovie";

export const socket = io.connect(process.env.REACT_APP_API_HOST);

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCities())
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/sign-in" element={<Authentication />} />
          <Route path="films" element={<Films />} >
            <Route index element={<Navigate to={"playing"} replace={true} />} />
            <Route path="playing" element={<Playing />} />
            <Route path="upcoming" element={<Upcoming />} />
          </Route>
          <Route path="/cinemas/:cinemaId" element={<CinemaDetail />} />
          <Route path="film/detail/:id" element={<FilmDetail />} />
          <Route path="booking" element={<Booking />} />
          <Route path="/cinemas-movies/:cinemaId" element={<CinemaMovies />} />
          <Route path="/managemovie" element={<ManageMovie />} />
        </Routes>
        <CustomFooter />
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
