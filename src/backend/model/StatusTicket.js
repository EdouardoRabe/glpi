import { del, get, post, put } from "../utils/expressApi";

class StatusTicket {
    constructor(){}

    static async getAll(){
        return await get("/status");
    }

    static async update(id, data = {}){
       await put(`/status/${id}`, data);
    }

    static async delete(id){
        return await del(`/status/${id}`);
    }

    static async create(id, data = {}){
       await post(`/status/${id}`, data);
    }

    static getByEnglishName(status, englishName){
        const filtered = status.filter((status) => status.english_name === englishName);
        return filtered.length > 0 ? filtered [0] : null;
    }

    static getByFrenchName(status, frenchName){
        const filtered = status.filter((status) => status.french_name === frenchName);
        return filtered.length > 0 ? filtered [0] : null;
    }

    static getByMalagasyName(status, MalagasyName){
        const filtered = status.filter((status) => status.malagasy_name === MalagasyName);
        return filtered.length > 0 ? filtered [0] : null;
    }

    static getByIdStatus(status, idStatus){
        const filtered = status.filter((status) => status.id_status === idStatus);
        return filtered.length > 0 ? filtered [0] : null;
    }
}
export default StatusTicket;