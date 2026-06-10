import { postV1 } from "../utils/apiV1";
import { del, get, post, put } from "../utils/expressApi";

class StatusTicket {
    constructor(){}

    static async getAll(){
        return await get("/status");
    }

    static async update(id, data = {}){
       return await put(`/status/${id}`, data);
    }

    static async delete(id){
        return await del(`/status/${id}`);
    }

    static async create(id, data = {}){
       return await post(`/status/${id}`, data);
    }

    static async createITIL(id, data = {}){
        return await postV1(`Ticket/${id}/ITILFollowup`, data);
    }

    static getByEnglishName(status, englishName){
        const filtered = status.find((status) => status?.english_name.toLowerCase() === englishName.toLowerCase());
        return filtered ?? null;
    }

    static getByFrenchName(status, frenchName){
        const filtered = status.find((status) => status?.french_name.toLowerCase() === frenchName.toLowerCase());
        return filtered ?? null;
    }

    static getByMalagasyName(status, MalagasyName){
        const filtered = status.find((status) => status?.malagasy_name.toLowerCase() === MalagasyName.toLowerCase());
        return  filtered ?? null;
    }

    static getByIdStatus(status, idStatus){
        const filtered = status.find((status) => status?.id_status === idStatus);
        return filtered ?? null;
    }
}
export default StatusTicket;