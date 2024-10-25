import axios from "../axios";

const fetchPopcorn = (data) => {
    return axios.get(`/popcorn/get-all`, data);
};


export const PopcornService = {
    fetchPopcorn
};
