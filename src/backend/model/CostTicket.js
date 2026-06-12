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

   
    static async remove(id_ticket){
         return await del(`/cost/remove/${id_ticket}`);
    }

    static async reouvrir(id_ticket, data){
         return await post(`/cost/ouvrir/${id_ticket}`, data);
    }
}
export default CostTicket;