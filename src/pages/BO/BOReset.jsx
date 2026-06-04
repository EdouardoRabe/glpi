import { useEffect } from "react"
import Ticket from "../../services/model/Ticket"

export default function BOReset() {
    useEffect(() => {
        const loadTicket = async () => {
            try {
                const ticketClass = new Ticket();
                const tickets = await ticketClass.getByNotOr([
                    { column: "name", value: "edouardo3" },
                    { column: "status.id", value: 1 }, 
                ]);
                console.log("Tickets loaded:", tickets);
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