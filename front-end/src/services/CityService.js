import axios from "../axios";

const fetchCitiesService = () => {
    return axios.get(`/city/get-all`);
};

export const CityService = {
    fetchCitiesService
};
