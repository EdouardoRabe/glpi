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
    
    static async getLanguages(){
        return await get("/status/languages");
    }

    static async createITIL(id, data = {}){
        return await postV1(`Ticket/${id}/ITILFollowup`, data);
    }
    static getByLanguageName(status, language, name) {
        const key = `${language.toLowerCase()}_name`;
        const filtered = status.find((s) => s?.[key]?.toLowerCase() === name.toLowerCase());
        return filtered ?? null;
    }


    static getByIdStatus(status, idStatus){
        const filtered = status.find((status) => status?.id_status === idStatus);
        return filtered ?? null;
    }

    static getDisplayName(status){
        return status?.[status?.to_display + "_name"] ?? status.french_name;
    }
}
export default StatusTicket;