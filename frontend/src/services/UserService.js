import axios from "axios";

class UserService {
    urlBackend = 'http://localhost:8000/api';

    async saveUser(user) {
        console.log(user)
        let new_user = await axios.post(`${this.urlBackend}/user/`, user)
        console.log(new_user)
        return new_user;
    }

    async getById(id){
        let user = await axios.get(`${this.urlBackend}/user/${id}`)
        return user.data
    }

    async getUserByEmail(email) {
        let body= {"email" : email}
        let user= await axios?.get(`${this.urlBackend}/user`, { params: body })
        return user
    }
    async getDocumentationUploaded(id){
        let documentation= await axios?.get(`${this.urlBackend}/process/documentation/${id}`)
        return documentation.data
    }

    async getTranslators(){
        let translators = await axios.get(`${this.urlBackend}/user/translators`)
        return translators.data
    }

    async searchTranslatorByEmail(email){
        let body= {"email" : email}
        let translator = await axios?.get(`${this.urlBackend}/user/translator/email`, { params: body })
        return translator.data
    }

    async getNotifications(id){
        let notifications = await axios.get(`${this.urlBackend}/user/${id}/notifications`)
        return notifications.data
    }

    async sendNotification(origin_id, destination_id, text){
        await axios.post(`${this.urlBackend}/notification/alert-translator/${origin_id}/${destination_id}?description=${text}` )
    }

    async sendAlert(origin_id, destination_id, text){
        await axios.post(`${this.urlBackend}/notification/alert/${origin_id}/${destination_id}?description=${text}` )
    }

    async searchTranslateRequests(id_translator){
        let translation_requests = await axios.get(`${this.urlBackend}/user/${id_translator}/translation-requests`)
        return translation_requests.data
    }

    async searchRequestByRequesterAndTranslator(id_requester, id_translator){
        let translation_requests = await axios.get(`${this.urlBackend}/user/translation-requests/requester/${id_requester}/translator/${id_translator}`)
        return translation_requests.data
    }

    async searchRequestByRequester(id_requester){
        let translation_request = await axios.get(`${this.urlBackend}/user/requests/requester/${id_requester}`)
        return translation_request.data
    }

    async deleteAlert(alert_id){
        await axios.delete(`${this.urlBackend}/notification/alert/${alert_id}` )
    }

    async deleteTranslationRequest(translation_request_id){
        await axios.delete(`${this.urlBackend}/notification/request/${translation_request_id}`)
    }

    async deleteTranslationRequestByRequester(requester_id){
        await axios.delete(`${this.urlBackend}/notification/request/requester/${requester_id}`)
    }

    async createTranslationTask(requester_id, translator_id){
        let translation_task = await axios.post(`${this.urlBackend}/task/requester/${requester_id}/translator/${translator_id}`)
        return translation_task.data
    }

    async searchTranslationTask(translator_id){
        let translation_task = await axios.get(`${this.urlBackend}/task/translator/${translator_id}`)
        return translation_task.data
    }

    async deleteTranslationTask(task_id){
        await axios.delete(`${this.urlBackend}/task/${task_id}`)
    }

    async createDownloadRequest(requester_id, translator_id, documents){
        let response = await axios.post(
            `${this.urlBackend}/download-request/requester/${requester_id}/translator/${translator_id}`,
                    JSON.stringify(documents),
                { headers: { "Content-Type": "application/json" } })
        console.log(response.data)
        return response
    }

    async searchDownloadRequestByRequesterId(requester_id){
        let download_request = await axios.get(`${this.urlBackend}/download-request/requester/${requester_id}`)
        return download_request.data
    }

    async deleteDownloadRequest(id){
        await axios.delete(`${this.urlBackend}/download-request/${id}`)
        console.log("Download request deleted")
    }
    
    async updateUserData(id, body) {
        try {
            let user = await axios?.put(`${this.urlBackend}/user/${id}`, body);
            return user.data;
        } catch (error) {
            console.error("Update user error:", error);
            throw error;
        }
    }
 
}

const userService = new UserService();

export default userService;
