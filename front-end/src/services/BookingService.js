import axios from "../axios";

const createPaymentService = (data) => {
    return axios.post(`booking/create-payment`, data);
};

const getBookedSeats = (data) => {
    return axios.post(`booking/get-booked-seats`, data);
};

const getUserBookedHistory = (data) => {
    return axios.post(`booking/get-history`, data);
}

export const BookingService = {
    createPaymentService,
    getBookedSeats,
    getUserBookedHistory
};
