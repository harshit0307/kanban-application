import axiosClient from "./axiosClient";

const taskApi = {
    create: (boardID, params) => axiosClient.post(`boards/${boardID}/tasks`, params),
    updatePosition: (boardID, params) => axiosClient.put(`boards/${boardID}/tasks/update-position`, params),
    delete: (boardID, taskID) => axiosClient.delete(`boards/${boardID}/tasks/${taskID}`),
    update: (boardID, taskID, params) => axiosClient.put(`boards/${boardID}/tasks/${taskID}`, params)
}

export default taskApi