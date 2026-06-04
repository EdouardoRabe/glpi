import Ticket from '../../model/Ticket.js';
import { parseCSV } from '../../utils/csv.js';

const ticket = async (data)=> {
    try {
        const text = await data?.text();
        const result = await parseCSV(text);
        
        for (const item of result) {
            const dataTicket = { name : item?.name, type : Number(item?.type) };
            const ticket = new Ticket(dataTicket);
            try {
                await ticket.save();
            } catch (error) {
                throw new Error("Erreur lors du save du ticket", error);
            }
        }
           

    } catch (err) {
        console.error("Error processing CSV:", err);
        throw err;
    }

};
export default ticket;