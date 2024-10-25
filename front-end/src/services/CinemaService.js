import axios from "../axios";

const fetchCinemaByCityService = (id) => {
    return axios.get(`/cinema/get-by-city/${id}`);
};

export const CinemaService = {
    fetchCinemaByCityService
};
