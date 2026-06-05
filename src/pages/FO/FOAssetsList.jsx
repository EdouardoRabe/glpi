import { useEffect } from "react"
import Computer from "../../backend/model/Computer";
import Monitor from "../../backend/model/Monitor";
import { useState } from "react";

export default function FOAssetsList() {
    const [computers, setComputers] = useState([]);
    const [monitors, setMonitors] = useState([]);

    useEffect(() =>{
        const loadElements = async () =>{
            const com = await Computer.getAll();
            const mon = await Monitor.getAll();
            setComputers(com);
            setMonitors(mon);
        };
        loadElements();
    }, [])

    return (
        <div>
            <h1>Liste des elements</h1>
            <div>
                <h4>Liste des ordinateurs</h4>
                {computers.map( (computer) => (
                    <div key={computer.id}>
                        <h6>{computer.name}</h6>
                    </div>
                )
                )}
            </div>
            <div>
                <h4>Liste des moniteurs</h4>
                {monitors.map( (monitor) => (
                    <div key={monitor.id}>
                        <h6>{monitor.name}</h6>
                    </div>
                )
                )}
            </div>
        </div>
    )
}