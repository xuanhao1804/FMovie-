import axios from "../axios";

const fetchMoviesService = () => {
    return axios.get(`/movie/get-all`);
};

const fetchMovieDetailService = (id) => {
    return axios.get("/movie/detail/" + id)
}

const fetchMovieByCityService = (data) => {
    return axios.post("/movie/get-by-city", data)
}

export const MovieService = {
    fetchMoviesService,
    fetchMovieDetailService,
    fetchMovieByCityService
};
