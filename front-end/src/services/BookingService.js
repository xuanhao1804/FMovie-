import axios from "../axios";

const createPaymentService = (data) => {
    return axios.post(`booking/create-payment`, data);
};

export const BookingService = {
    createPaymentService
};
