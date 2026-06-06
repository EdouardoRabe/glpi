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
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [filters, setFilters] = useState(
        {
            modelId : 0,
            locationId : 0,
            stateId: 0,
            manufacturerId: 0
        }
    )

    useEffect(() =>{
        const loadElements = async () =>{
            const com = await Computer.getAllComplete();
            const mon = await Monitor.getAllComplete();
            const sta = await State.getAll();
            const loc = await Location.getAll();
            const man = await Manufacturer.getAll();
            const modCom = await ComputerModel.getAll();
            const modMon = await MonitorModel.getAll();
            const mod = [...modCom, ...modMon];

          
            setComputers(com);
            setMonitors(mon);
            setStates(sta);
            setLocations(loc);
            setManufacturers(man);
            setModels(mod);
        };
        loadElements();
    }, [])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === '' ? '' : value,  
        }))
    }

    const filterdComputers = computers.filter( ({computer}) =>{
        if(filters.locationId > 0 && computer.location.id !=filters.locationId) return false
        if(filters.manufacturerId > 0 && computer.manufacturer.id !=filters.manufacturerId) return false
        if(filters.modelId > 0 && computer.model.id !=filters.modelId) return false
        if(filters.stateId > 0 && computer.status.id !=filters.stateId) return false
        return true;
    });

    
    const filterdMonitors = monitors.filter( ({monitor}) =>{
        if(filters.locationId > 0 && monitor.location.id !=filters.locationId) return false
        if(filters.manufacturerId > 0 && monitor.manufacturer.id !=filters.manufacturerId) return false
        if(filters.modelId > 0 && monitor.model.id !=filters.modelId) return false
        if(filters.stateId > 0 && monitor.status.id !=filters.stateId) return false
        return true;
    });

    const resetFilter = () =>{
        setFilters(
             {
                modelId : 0,
                locationId : 0,
                stateId: 0,
                manufacturerId: 0
            }
        )
    }

    return (
        <div>
            <h1>Liste des elements</h1>
            <button onClick={resetFilter}>Reset Filter</button>
            <div>
                <select 
                    value={filters.stateId}
                    onChange={(e) => handleFilterChange('stateId', e.target.value)}
                >
                    <option value="0">State</option>
                    { states.map( (state) =>(
                        <option key={state.id} value={state.id}>{state.name}</option>
                        )
                    )

                    }
                </select>
            </div>
            <div>
                <select 
                    value={filters.locationId}
                     onChange={(e) => handleFilterChange('locationId', e.target.value)}
                >
                    <option value="0">Location</option>
                    { locations.map( (location) =>(
                        <option key={location.id} value={location.id}>{location.name}</option>
                        )
                    )

                    }
                </select>
            </div>
            <div>
                <select 
                    value={filters.manufacturerId}
                      onChange={(e) => handleFilterChange('manufacturerId', e.target.value)}
                >
                    <option value="0">Fabriquant</option>
                    { manufacturers.map( (manufacturer) =>(
                        <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</option>
                        )
                    )

                    }
                </select>
            </div>
            <div>
                <select 
                    value={filters.modelId}
                      onChange={(e) => handleFilterChange('modelId', e.target.value)}
                >
                    <option value="0">Model</option>
                    { models.map( (model) =>(
                        <option key={model.id} value={model.id}>{model.name}</option>
                        )
                    )

                    }
                </select>
            </div>
            <div>
                <h2>Liste des ordinateurs</h2>
                {filterdComputers.map( ({ computer, imageUrl }) => (
                    <div key={computer.id}>
                        <h4>{computer.name}</h4>
                        <img src={imageUrl} alt="images"  />
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
                {filterdMonitors.map( ({ monitor, imageUrl }) => (
                    <div key={monitor.id}>
                        <h4>{monitor.name}</h4>
                        <img src={imageUrl} alt="images"  />
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