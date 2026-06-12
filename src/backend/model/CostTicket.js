import { postV1 } from "../utils/apiV1";
import { del, get, post, put } from "../utils/expressApi";

class CostTicket {
    constructor(){}

    static async getAll(){
        return await get("/cost");
    }


    static async create(data = {}){
       return await post(`/cost`, data);
    }

    static async getByTicket(id_ticket){
        const all = await CostTicket.getAll();
        return all.find((cost) => Number(cost.id_ticket) === Number(id_ticket));
    }
}
export default CostTicket;