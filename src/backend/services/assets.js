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