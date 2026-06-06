import { useEffect, useState } from "react";
import Asset from "../../backend/model/Asset";
import State from "../../backend/model/State";
import Location from "../../backend/model/Location";
import Manufacturer from "../../backend/model/Manufacturer";

export default function FOAssetsList() {
    const [assets, setAssets]             = useState([]);
    const [states, setStates]             = useState([]);
    const [locations, setLocations]       = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels]             = useState([]);
    const [filters, setFilters]           = useState({
        modelId:        0,
        locationId:     0,
        stateId:        0,
        manufacturerId: 0,
    });

    useEffect(() => {
        const loadElements = async () => {
            const all  = await Asset.getAllComplete();
            const sta  = await State.getAll();
            const loc  = await Location.getAll();
            const man  = await Manufacturer.getAll();

            const modMap = new Map();
            all.forEach(({ asset }) => {
                if (asset.model?.id) modMap.set(asset.model.id, asset.model);
            });

            setAssets(all);
            setStates(sta);
            setLocations(loc);
            setManufacturers(man);
            setModels([...modMap.values()]);
        };
        loadElements();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value === "" ? 0 : Number(value) }));
    };

    const resetFilter = () => {
        setFilters({ modelId: 0, locationId: 0, stateId: 0, manufacturerId: 0 });
    };

    const filteredAssets = assets.filter(({ asset }) => {
        if (filters.locationId     > 0 && asset.location?.id     !== filters.locationId)     return false;
        if (filters.manufacturerId > 0 && asset.manufacturer?.id !== filters.manufacturerId) return false;
        if (filters.modelId        > 0 && asset.model?.id        !== filters.modelId)        return false;
        if (filters.stateId        > 0 && asset.status?.id       !== filters.stateId)        return false;
        return true;
    });

    return (
        <div>
            <h1>Liste des éléments</h1>
            <button onClick={resetFilter}>Reset Filter</button>

            <div>
                <select value={filters.stateId} onChange={(e) => handleFilterChange("stateId", e.target.value)}>
                    <option value="0">State</option>
                    {states.map((state) => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <select value={filters.locationId} onChange={(e) => handleFilterChange("locationId", e.target.value)}>
                    <option value="0">Location</option>
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <select value={filters.manufacturerId} onChange={(e) => handleFilterChange("manufacturerId", e.target.value)}>
                    <option value="0">Fabriquant</option>
                    {manufacturers.map((manufacturer) => (
                        <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <select value={filters.modelId} onChange={(e) => handleFilterChange("modelId", e.target.value)}>
                    <option value="0">Modèle</option>
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <h2>Liste des assets</h2>
                {filteredAssets.map(({ asset, imageUrl }) => (
                    <div key={`${asset.itemType}-${asset.id}`}>
                        <h4>{asset.name}</h4>
                        {imageUrl && <img src={imageUrl} alt={asset.name} />}
                        <p>{asset.itemType}</p>
                        <p>{asset.status?.name}</p>
                        <p>{asset.manufacturer?.name}</p>
                        <p>{asset.location?.name}</p>
                        <p>{asset.model?.name}</p>
                        <p>{asset.serial}</p>
                        <p>{asset.user?.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}