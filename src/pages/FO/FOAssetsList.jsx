import { useEffect, useState } from "react";
import Asset from "../../backend/model/Asset";
import User from "../../backend/model/User";
import State from "../../backend/model/State";
import Location from "../../backend/model/Location";
import Manufacturer from "../../backend/model/Manufacturer";
import { ITEM_TYPES } from "../../backend/utils/type";
import "../../css/pages/FO/FOAssetsList.css";

export default function FOAssetsList() {
    const [assets, setAssets]             = useState([]);
    const [states, setStates]             = useState([]);
    const [locations, setLocations]       = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels]             = useState([]);
    const [users, setUsers]               = useState([]);
    const [filters, setFilters]           = useState({
        modelId:        0,
        locationId:     0,
        stateId:        0,
        manufacturerId: 0,
        itemType:      "",
        userId:          0,
        searchName:     "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const nbItemsPerPage = [3,6,9];

    useEffect(() => {
        const loadElements = async () => {
            const all  = await Asset.getAllComplete();
            const sta  = await State.getAll();
            const loc  = await Location.getAll();
            const man  = await Manufacturer.getAll();
            const usr  = await User.getExcl([2, 3, 4, 5, 6]);

            const modMap = new Map();
            all.forEach(({ asset }) => {
                if (asset.model?.id) modMap.set(asset.model.id, asset.model);
            });

            setAssets(all);
            setStates(sta);
            setLocations(loc);
            setManufacturers(man);
            setModels([...modMap.values()]);
            setUsers(usr);
        };
        loadElements();
    }, []);

    const handleFilterChange = (key, value) => {
        if (key === "itemType" || key === "searchName") {
            setFilters(prev => ({ ...prev, [key]: value }));
        } else {
            setFilters(prev => ({ ...prev, [key]: value === "" ? 0 : Number(value) }));
        }
    };

    const resetFilter = () => {
        setFilters({ modelId: 0, locationId: 0, stateId: 0, manufacturerId: 0, itemType: "", userId: 0, searchName: "" });
    };

    const filteredAssetsAvantPagination = assets.filter(({ asset }) => {
        if (filters.locationId     > 0 && asset.location?.id     !== filters.locationId)     return false;
        if (filters.manufacturerId > 0 && asset.manufacturer?.id !== filters.manufacturerId) return false;
        if (filters.modelId        > 0 && asset.model?.id        !== filters.modelId)        return false;
        if (filters.stateId        > 0 && asset.status?.id       !== filters.stateId)        return false;
        if (filters.itemType        !== ""  && asset.itemType         !== filters.itemType)         return false;
        if (filters.userId           > 0 && asset.user?.id          !== filters.userId)           return false;
        if (filters.searchName      !== ""  && !asset.name?.toLowerCase().includes(filters.searchName.toLowerCase())) return false;
        return true;
    });


    const totalPages = Math.ceil(filteredAssetsAvantPagination.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filteredAssets = filteredAssetsAvantPagination.slice(startIndex, endIndex);

    const goToPage = (pageNumber) => {
        const pageNum = Math.max(1, Math.min(pageNumber, totalPages));
        setCurrentPage(pageNum);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const prevPage = () => {
        goToPage(currentPage - 1);
    };


    return (
        <div className="fo-assets-list">
            <h1>Assets Catalog</h1>

            <div className="fo-assets-filters">
                <h3>Filters</h3>

                <div className="fo-assets-filter-item">
                    <label htmlFor="filter-search-name">Search by Name</label>
                    <input
                        id="filter-search-name"
                        type="text"
                        placeholder="Search assets by name..."
                        value={filters.searchName}
                        onChange={(e) => handleFilterChange("searchName", e.target.value)}
                    />
                </div>

                <div className="fo-assets-filter-group">
                    <div className="fo-assets-filter-item">
                        <label htmlFor="filter-item-type">Item Type</label>
                        <select id="filter-item-type" value={filters.itemType} onChange={(e) => handleFilterChange("itemType", e.target.value)}>
                            <option value="">All Types</option>
                            {ITEM_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="fo-assets-filter-item">
                        <label htmlFor="filter-state">State</label>
                        <select id="filter-state" value={filters.stateId} onChange={(e) => handleFilterChange("stateId", e.target.value)}>
                            <option value="0">All States</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="fo-assets-filter-item">
                        <label htmlFor="filter-location">Location</label>
                        <select id="filter-location" value={filters.locationId} onChange={(e) => handleFilterChange("locationId", e.target.value)}>
                            <option value="0">All Locations</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="fo-assets-filter-item">
                        <label htmlFor="filter-manufacturer">Manufacturer</label>
                        <select id="filter-manufacturer" value={filters.manufacturerId} onChange={(e) => handleFilterChange("manufacturerId", e.target.value)}>
                            <option value="0">All Manufacturers</option>
                            {manufacturers.map((manufacturer) => (
                                <option key={manufacturer.id} value={manufacturer.id}>{manufacturer.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="fo-assets-filter-item">
                        <label htmlFor="filter-model">Model</label>
                        <select id="filter-model" value={filters.modelId} onChange={(e) => handleFilterChange("modelId", e.target.value)}>
                            <option value="0">All Models</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="fo-assets-filter-item">
                        <label htmlFor="filter-user">User</label>
                        <select id="filter-user" value={filters.userId} onChange={(e) => handleFilterChange("userId", e.target.value)}>
                            <option value="0">All Users</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                     <div className="fo-assets-filter-item">
                        <label htmlFor="filter-user">Pagination</label>
                        <select id="filter-user" value={itemsPerPage} onChange={(e) => setItemsPerPage( Number(e.target.value))}>
                            <option value="3">Par Defaut</option>
                            {nbItemsPerPage.map((nb) => (
                                <option key={nb} value={nb}>{nb}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="fo-assets-filter-actions">
                    <button onClick={resetFilter}>Reset Filters</button>
                </div>
            </div>

            <div className="fo-assets-content">
                <h2>Available Assets ({filteredAssets.length})</h2>

                {filteredAssets.length === 0 ? (
                    <div className="fo-assets-empty">
                        <p>No assets match your filters.</p>
                    </div>
                ) : (
                    <div className="fo-assets-grid">
                        {filteredAssets.map(({ asset, imageUrl }) => (
                            <div key={`${asset.itemType}-${asset.id}`} className="fo-assets-card">
                                <div className="fo-assets-card-image-container">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={asset.name} className="fo-assets-card-image" />
                                    ) : (
                                        <div className="fo-assets-card-image-placeholder"></div>
                                    )}
                                </div>
                                <div className="fo-assets-card-content">
                                    <h4>{asset.name}</h4>
                                    <p><strong>Type:</strong> {asset.itemType}</p>
                                    {asset.manufacturer?.name && <p><strong>Manufacturer:</strong> {asset.manufacturer.name}</p>}
                                    {asset.model?.name && <p><strong>Model:</strong> {asset.model.name}</p>}
                                    {asset.serial && <p><strong>Serial:</strong> {asset.serial}</p>}
                                    {asset.status?.name && <p><strong>Status:</strong> {asset.status.name}</p>}
                                    {asset.location?.name && <p><strong>Location:</strong> {asset.location.name}</p>}
                                    {asset.user?.name && <p><strong>User:</strong> {asset.user.name}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        ← Précédent
                    </button>

                    <div className="pagination-info">
                        <span>Page {currentPage} sur {totalPages}</span>
                        <span className="pagination-items">
                        Affichant {startIndex + 1} à {Math.min(endIndex, assets.length) } sur {assets.length} items
                        </span>
                    </div>

                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Suivant →
                    </button>
                </div>
            )}
        </div>
    );
}