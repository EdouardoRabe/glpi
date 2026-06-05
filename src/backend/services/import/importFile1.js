import { parseCSV, checkCSVHeader } from "../../utils/csv.js";
import Computer      from "../../model/Computer.js";
import Monitor       from "../../model/Monitor.js";
import Location      from "../../model/Location.js";
import Manufacturer  from "../../model/Manufacturer.js";
import State         from "../../model/State.js";
import ComputerModel from "../../model/ComputerModel.js";
import MonitorModel  from "../../model/MonitorModel.js";
import User          from "../../model/User.js";

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


export const importFile1 = async (file) => {
    const text = await file.text();

    checkCSVHeader(text, EXPECTED_HEADERS);

    const rows = parseCSV(text);
    const results = { created: 0, errors: [] };

    for (const row of rows) {
        try {
            const itemType = row.item_type?.trim().toLowerCase();

            if (!itemType) {
                throw new Error(`Colonne item_type manquante`);
            }
            if (itemType !== "computer" && itemType !== "monitor") {
                throw new Error(`item_type inconnu : "${itemType}" (attendu: computer ou monitor)`);
            }

            const [location, manufacturer, state, user] = await Promise.all([
                getOrCreate(Location,     row.location),
                getOrCreate(Manufacturer, row.manufacturer),
                getOrCreate(State,        row.status),
                getOrCreateUser(row.user),
            ]);

            const ModelClass = itemType === "computer" ? ComputerModel : MonitorModel;
            const model = await getOrCreate(ModelClass, row.model);

            const assetData = {
                name:         row.name?.trim()              ?? "",
                serial:  row.inventory_number?.trim()  ?? null,
                status:       state        ? { id: state.id }        : null,
                location:     location     ? { id: location.id }     : null,
                manufacturer: manufacturer ? { id: manufacturer.id } : null,
                model:        model        ? { id: model.id }        : null,
                user:         user         ? { id: user.id }         : null,
            };

            const AssetClass = itemType === "computer" ? Computer : Monitor;
            const asset = new AssetClass(assetData);
            await asset.save();

            console.log(`[CREATED] ${itemType} → "${row.name}" (#${asset.id})`);
            results.created++;

        } catch (err) {
            console.error(`[ERROR] Ligne "${row.name}" : ${err.message}`);
            results.errors.push({ row: row.name, error: err.message });
        }
    }

    console.log(`\n Import Feuille 1 terminé : ${results.created} créés, ${results.errors.length} erreurs`);
    return results;
};

export default importFile1;
