import { useEffect, useState } from "react"
import Computer from "../../backend/model/Computer";
import Monitor from "../../backend/model/Monitor";
import Ticket from "../../backend/model/Ticket";

export default function BODashboard (){
    const [computers, setComputers] = useState([]);
    const [monitors, setMonitors] = useState([]);
    const [tickets, setTickets] = useState(new Map());
        
    useEffect(() =>{
        const loadElements = async () =>{
            const com = await Computer.getAll();
            const mon = await Monitor.getAll();
            const tic = await Ticket.getTicketsWithItems();

            setComputers(com);
            setMonitors(mon);
            setTickets(tic);
           
        };
        loadElements();
    }, [])

    const totalComputers = computers.length;
    const totalMonitors = monitors.length;
    const totalAssets = totalComputers + totalMonitors;

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <h2>Total Assets : {totalAssets}</h2>
                <h4>Total ordinateurs : {totalComputers}</h4>
                <h4>Total moniteurs : {totalMonitors}</h4>
            </div>
        </div>
    )
}
