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