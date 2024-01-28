import axiosClient from "./axiosClient";

const boardApi = {
    create: () => axiosClient.post('boards'),
    getAll: () => axiosClient.get('boards'),
    updatePosition: (params) => axiosClient.put('boards', params),
    getOne: (_id) => axiosClient.get(`boards/${_id}`),
    delete: (_id) => axiosClient.delete(`boards/${_id}`),
    update: (_id, params) => axiosClient.put(`boards/${_id}`, params),
    getFavourites: () => axiosClient.get('boards/favourites'),
    updateFavouritePosition: (params) => axiosClient.put('boards/favourites', params)
}

export default boardApi