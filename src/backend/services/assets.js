import { ITEM_TYPES } from "../../backend/utils/type";

export function nbAssetsByType(assets, type) {
    return assets.filter((a) => a.itemType === type).length;
}

export function nbAssetsByTypes(assets) {
    return ITEM_TYPES.reduce((acc, type) => {
        acc[type] = nbAssetsByType(assets, type);
        return acc;
    }, {});
}