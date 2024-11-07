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
import { fetchMovies } from "./reducers/MovieReducer";
import ManageMovie from "./pages/ManageMovie/ManageMovie";
import { fetchPopcorns } from "./reducers/PopcornReducer";
import UserProfile from "./pages/UserProfile/UserProfile";
import AutoScrollToTop from "./components/AutoScrollToTop/AutoScrollToTop";
import ForgotPassword from "./pages/ResetPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import CinemaMovies from "./pages/CinemaMovies/CinemaMovies";

export const socket = io.connect(process.env.REACT_APP_API_HOST);

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCities())
    dispatch(fetchMovies())
    dispatch(fetchPopcorns())
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <AutoScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth/sign-in" element={<Authentication />} />

          <Route path="user-profile" element={<UserProfile />} />

          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
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
