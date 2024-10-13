import axios from "../axios";

const fetchMoviesService = () => {
    return axios.get(`/movie/get-all`);
};

export const MovieService = {
    fetchMoviesService
};
