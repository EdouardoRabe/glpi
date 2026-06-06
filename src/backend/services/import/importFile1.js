import { parseCSV, checkCSVHeader } from "../../utils/csv.js";
import Asset      from "../../model/Asset.js";
import AssetModel from "../../model/AssetModel.js";
import Location   from "../../model/Location.js";
import Manufacturer from "../../model/Manufacturer.js";
import State      from "../../model/State.js";
import User       from "../../model/User.js";
import { ITEM_TYPE_TO_MODEL_TYPE } from "../../utils/type.js";

const EXPECTED_HEADERS = [
    "name", "status", "location", "manufacturer",
    "item_type", "model", "inventory_number", "user"
];


const _cache = new Map();

async function getOrCreate(Model, name, extraFields = {}) {
    if (!name || name.trim() === "") return null;

    const cacheKey = `${Model.endpoint}::${name.trim().toLowerCase()}`;
    if (_cache.has(cacheKey)) return _cache.get(cacheKey);

    const existing = await Model.getBy("name", name.trim());
    if (existing.length > 0) {
        _cache.set(cacheKey, existing[0]);
        return existing[0];
    }

    const instance = new Model({ name: name.trim(), ...extraFields });
    await instance.save();
    console.log(`[CREATED] ${Model.endpoint} → "${name}"`);
    _cache.set(cacheKey, instance);
    return instance;
}

async function getOrCreateUser(fullName) {
    if (!fullName || fullName.trim() === "") return null;

    const cacheKey = `user::${fullName.trim().toLowerCase()}`;
    if (_cache.has(cacheKey)) return _cache.get(cacheKey);

    const existing = await User.getBy("username", fullName.trim());
    if (existing.length > 0) {
        _cache.set(cacheKey, existing[0]);
        return existing[0];
    }

    const instance = new User({ username: fullName.trim() });
    await instance.save();
    console.log(`[CREATED] User → "${fullName}"`);
    _cache.set(cacheKey, instance);
    return instance;
}

async function getOrCreateModel(modelType, name) {
    if (!name || name.trim() === "") return null;

    const cacheKey = `${modelType}::${name.trim().toLowerCase()}`;
    if (_cache.has(cacheKey)) return _cache.get(cacheKey);

    const existing = await AssetModel.getBySimple(modelType, "name", name.trim());
    if (existing.length > 0) {
        _cache.set(cacheKey, existing[0]);
        return existing[0];
    }

    const instance = new AssetModel({ name: name.trim() }, modelType);
    await instance.save();
    console.log(`[CREATED] ${modelType} → "${name}"`);
    _cache.set(cacheKey, instance);
    return instance;
}

export const importFile1 = async (file) => {
    const text = await file.text();

    checkCSVHeader(text, EXPECTED_HEADERS);

    const rows    = parseCSV(text);
    const results = { created: 0, errors: [] };

    for (const row of rows) {
        try {
            const itemTypeLower = row.item_type?.trim().toLowerCase();

            if (!itemTypeLower) {
                throw new Error("Colonne item_type manquante");
            }

            const modelType = ITEM_TYPE_TO_MODEL_TYPE[itemTypeLower];
            if (!modelType) {
                throw new Error(
                    `item_type inconnu : "${itemTypeLower}" (attendu: ${Object.keys(ITEM_TYPE_TO_MODEL_TYPE).join(", ")})`
                );
            }

            const [location, manufacturer, state, user] = await Promise.all([
                getOrCreate(Location,     row.location),
                getOrCreate(Manufacturer, row.manufacturer),
                getOrCreate(State,        row.status),
                getOrCreateUser(row.user),
            ]);

            const model = await getOrCreateModel(modelType, row.model);

            const glpiItemType = itemTypeLower.charAt(0).toUpperCase() + itemTypeLower.slice(1);

            const assetData = {
                name:         row.name?.trim()             ?? "",
                serial:       row.inventory_number?.trim() ?? null,
                status:       state        ? { id: state.id }        : null,
                location:     location     ? { id: location.id }     : null,
                manufacturer: manufacturer ? { id: manufacturer.id } : null,
                model:        model        ? { id: model.id }        : null,
                user:         user         ? { id: user.id }         : null,
            };

            const asset = new Asset(assetData, glpiItemType);
            await asset.save();

            console.log(`[CREATED] ${glpiItemType} → "${row.name}" (#${asset.id})`);
            results.created++;

        } catch (err) {
            console.error(`[ERROR] Ligne "${row.name}" : ${err.message}`);
            results.errors.push({ row: row.name, error: err.message });
        }
    }

    console.log(`\nImport Feuille 1 terminé : ${results.created} créés, ${results.errors.length} erreurs`);
    return results;
};

export default importFile1;