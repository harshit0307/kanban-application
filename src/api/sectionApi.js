import axiosClient from "./axiosClient";

const sectionApi = {
    create: (boardID) => axiosClient.post(`boards/${boardID}/sections`),
    delete: (boardID, sectionId) => axiosClient.delete(`boards/${boardID}/sections/${sectionId}`),
    update: (boardID, sectionId, params) => axiosClient.put(`boards/${boardID}/sections/${sectionId}`, params)
}

export default sectionApi