import { useEffect, useState } from "react"
import Computer from "../../backend/model/Computer";
import Monitor from "../../backend/model/Monitor";
import Ticket from "../../backend/model/Ticket";
import { TICKET_TYPE, getEnumNameById } from "../../backend/utils/utils";

export default function BODashboard (){
    const [computers, setComputers] = useState([]);
    const [monitors, setMonitors] = useState([]);
    const [tickets, setTickets] = useState([]);
        
    useEffect(() =>{
        const loadElements = async () =>{
            const com = await Computer.getAll();
            const mon = await Monitor.getAll();
            const tic = await Ticket.getAll();

            setComputers(com);
            setMonitors(mon);
            setTickets(tic);
           
        };
        loadElements();
    }, [])

    const totalComputers = computers.length;
    const totalMonitors = monitors.length;
    const totalAssets = totalComputers + totalMonitors;
    const nbTicketType = tickets.reduce((acc, t) => {
                const id = String(t.type);
                const label = getEnumNameById(TICKET_TYPE, id);
                acc[label] = (acc[label] ?? 0) + 1;
                return acc;
    }, {});

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>Total Assets : {totalAssets}</h2>
                <h4>Total ordinateurs : {totalComputers}</h4>
                <h4>Total moniteurs : {totalMonitors}</h4>
            </div>
            <div>
                <h2>Tickets</h2>
                <p>Nombre de tickets : {tickets.length}</p>
                <ul>
                    {Object.entries(nbTicketType).map(([label, count]) => (
                        <li key={label}>{label} : {count}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
