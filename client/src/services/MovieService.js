import axios from "../axios";

const fetchMoviesService = () => {
    return axios.get(`/movie/get-all`);
};

const fetchMovieDetailService = (id) => {
    return axios.get("/movie/detail/" + id)
}

export const MovieService = {
    fetchMoviesService,
    fetchMovieDetailService
};
