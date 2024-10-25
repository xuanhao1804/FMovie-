import axios from "../axios";

const fetchRoomByIDService = (data) => {
    return axios.post(`/room/detail`, data);
};


export const RoomService = {
    fetchRoomByIDService
};
