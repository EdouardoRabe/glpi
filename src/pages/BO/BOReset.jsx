import { useEffect } from "react"
import Ticket from "../../services/model/Ticket"

export default function BOReset() {
    useEffect(() => {
        const loadTicket = async () => {
            try {
                // const data = {
                //     name : "edouardo55",
                //     content : "test",
                //     type : "1",
                // }
                // const tickets = new Ticket(data);
                // tickets.save();
                // console.log("Tickets created:", tickets);

                // await Ticket.deleteAll();
                // console.log("All tickets deleted");

                // const tickets2 = await Ticket.getAll();
                // console.log("Fetched tickets:", tickets2);

                // const ticket = await Ticket.getById(2);
                // await ticket.delete();
                // console.log("Ticket deleted:", ticket);

                // const tickets2 = await Ticket.getAll();
                // console.log("Fetched tickets:", tickets2);

                // await ticket.update({name: "edouardo99", type:2});
                // console.log("Ticket updated:", ticket);

            
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        };
        loadTicket();
    }, []);

    return (
        <div>
            <h1>BOReset</h1>
        </div>
    )
}