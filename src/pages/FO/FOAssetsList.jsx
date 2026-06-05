import { useEffect } from "react"
import Computer from "../../backend/model/Computer";
import Monitor from "../../backend/model/Monitor";
import { useState } from "react";
import State from "../../backend/model/State";
import Location from "../../backend/model/Location";
import Manufacturer from "../../backend/model/Manufacturer";
import ComputerModel from "../../backend/model/ComputerModel";
import MonitorModel from "../../backend/model/MonitorModel";

export default function FOAssetsList() {
    const [computers, setComputers] = useState([]);
    const [monitors, setMonitors] = useState([]);
    const [states, setStates] = useState([]);
    const [locations, setLocations] = useState([]);
    const [manufacturer, setManufacturer] = useState([]);
    const [model, setModel] = useState([]);

    useEffect(() =>{
        const loadElements = async () =>{
            const com = await Computer.getAll();
            const mon = await Monitor.getAll();
            const sta = await State.getAll();
            const loc = await Location.getAll();
            const man = await Manufacturer.getAll();
            const modCom = await ComputerModel.getAll();
            const modMon = await MonitorModel.getAll();

            setComputers(com);
            setMonitors(mon);
            setStates(sta);
            setLocations(loc);
            setManufacturer(man);
        };
        loadElements();
    }, [])

    return (
        <div>
            <h1>Liste des elements</h1>
            <div>
                <h2>Liste des ordinateurs</h2>
                {computers.map( (computer) => (
                    <div key={computer.id}>
                        <h4>{computer.name}</h4>
                        <p>{computer.status.name}</p>
                        <p>{computer.manufacturer.name}</p>
                        <p>{computer.location.name}</p>
                        <p>{computer.model.name}</p>
                        <p>{computer.serial}</p>
                        <p>{computer.user?.name}</p>
                    </div>
                )
                )}
            </div>
            <div>
                <h2>Liste des moniteurs</h2>
                {monitors.map( (monitor) => (
                    <div key={monitor.id}>
                        <h4>{monitor.name}</h4>
                        <p>{monitor.manufacturer.name}</p>
                        <p>{monitor.location.name}</p>
                        <p>{monitor.model.name}</p>
                        <p>{monitor.serial}</p>
                        <p>{monitor.user?.name}</p>
                    </div>
                )
                )}
            </div>
        </div>
    )
}