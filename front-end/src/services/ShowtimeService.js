import axios from "../axios";

const fetchShowtimeByMovieService = (data) => {
    return axios.post(`/showtime/get-all-showtime`, data);
};

const fetchShowtimeByCinema = (id) => {
    return axios.get(`/showtime/get-by-cinema/${id}`);
};

export const ShowtimeService = {
    fetchShowtimeByMovieService,
    fetchShowtimeByCinema
};
