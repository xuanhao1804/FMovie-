import axios from "../axios";

const fetchShowtimeByMovieService = (data) => {
    return axios.post(`/showtime/get-all-showtime`, data);
};

export const ShowtimeService = {
    fetchShowtimeByMovieService
};
