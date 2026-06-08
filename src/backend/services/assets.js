import { ITEM_TYPES } from "../../backend/utils/type";

export function nbAssetsByType(assets, type) {
    return assets.filter((a) => a.itemType === type).length;
}

export function nbAssetsByTypes(assets) {
    return ITEM_TYPES.map((type) => {
        return {
            label: type,
            count: nbAssetsByType(assets, type)
        };
    });
}

export function nbAssetsByStatus(assets, statusId) {
    return assets.filter((a) => {
        return a.status?.id === statusId;
    }).length;
}

export function nbAssetsByStatuses(assets, statuses) {
    return statuses.map((status) => {
        return {
            label: status.name,
            count: nbAssetsByStatus(assets, status.id)
        };
    });
}

export function nbAssetsByModel(assets, modelId) {
    return assets.filter((a) => {
        return a.model?.id === modelId;
    }).length;
}

export function nbAssetsByModels(assets, models) {
    return models.map((model) => {
        return {
            label: model.name,
            count: nbAssetsByModel(assets, model.id)
        };
    });
}

export function nbAssetsByLocation(assets, locationId) {
    return assets.filter((a) => {
        return a.location?.id === locationId;
    }).length;
}

export function nbAssetsByLocations(assets, locations) {
    return locations.map((location) => {
        return {
            label: location.name,
            count: nbAssetsByLocation(assets, location.id)
        };
    });
}

export function nbAssetsByManufacturer(assets, manufacturerId) {
    return assets.filter((a) => {
        return a.manufacturer?.id === manufacturerId;
    }).length;
}

export function nbAssetsByManufacturers(assets, manufacturers) {
    return manufacturers.map((manufacturer) => {
        return {
            label: manufacturer.name,
            count: nbAssetsByManufacturer(assets, manufacturer.id)
        };
    });
}