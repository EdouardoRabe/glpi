import { del, get, post, put } from "../utils/expressApi";

class StatusTicket {
    constructor(){}

    static async getAll(){
        return await get("/status");
    }

    static async getByIdStatus(id){
        return await get(`/status/${id}`);
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

    static async getByIdByEnglishName(englishName){
        const status = await StatusTicket.getAll();
        const filtered = status.filter((status) => status.english_name === englishName);
        return filtered.length > 0 ? filtered [0] : null;
    }

    static async getByIdByFrenchName(frenchName){
        const status = await StatusTicket.getAll();
        const filtered = status.filter((status) => status.french_name === frenchName);
        return filtered.length > 0 ? filtered [0] : null;
    }

     static async getByIdByMalagasyName(MalagasyName){
        const status = await StatusTicket.getAll();
        const filtered = status.filter((status) => status.malagasy_name === MalagasyName);
        return filtered.length > 0 ? filtered [0] : null;
    }
}
export default StatusTicket;