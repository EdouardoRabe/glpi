import api   from "../utils/api";
import apiV1  from "../utils/apiV1";
import { clause, and, or, fetchAll } from "../utils/query";
import { ASSET_TYPES_CONFIG, ITEM_TYPES } from "../utils/type";

const DEFAULT_LIMIT = 100;

const PROTECTED_IDS = {};


class Asset {

    constructor(data = {}, itemType = "") {
        this.itemType      = itemType;

        this.id            = data.id            ?? null;
        this.name          = data.name          ?? "";
        this.serial        = data.serial        ?? null;
        this.otherserial   = data.otherserial   ?? null;
        this.comment       = data.comment       ?? null;
        this.is_deleted    = data.is_deleted    ?? false;
        this.date_creation = data.date_creation ?? null;
        this.date_mod      = data.date_mod      ?? null;

        this.status        = data.status        ?? null;
        this.entity        = data.entity        ?? null;
        this.location      = data.location      ?? null;
        this.manufacturer  = data.manufacturer  ?? null;
        this.model         = data.model         ?? null;
        this.type          = data.type          ?? null;
        this.user          = data.user          ?? null;
        this.user_tech     = data.user_tech     ?? null;
    }


    get endpoint() {
        return `Assets/${this.itemType}`;
    }

    static #endpointFor(itemType) {
        return `Assets/${itemType}`;
    }

    static #fromArray(dataArray = [], itemType) {
        return dataArray.map(item => new Asset(item, itemType));
    }

    static #requireItemType(itemType) {
        if (!itemType || typeof itemType !== "string" || itemType.trim() === "") {
            throw new Error("Asset : itemType est requis (ex: 'Computer', 'Monitor')");
        }
    }

    static async #fetchAllSimple(itemType, queryParams = {}) {
        Asset.#requireItemType(itemType);
        const raw = await fetchAll(queryParams, Asset.#endpointFor(itemType), DEFAULT_LIMIT);
        return Asset.#fromArray(raw, itemType);
    }

    static async #fetchAll(queryParams = {}) {
        const results = await Promise.all(
            ITEM_TYPES.map(itemType => Asset.#fetchAllSimple(itemType, queryParams))
        );
        return results.flat();
    }


    async getDocumentItem() {
        // Socket n'a pas d'endpoint Document_Item dans GLPI V1
        if (this.itemType === "Socket" || this.itemType === "Glpi\\Socket") {
            return null;
        }

        if(!ASSET_TYPES_CONFIG[this.itemType.toLowerCase()]?.linkable) {
            return null;
        }

        return apiV1.getV1(`${this.itemType}/${this.id}/Document_Item`);
    }

    async getImageUrl() {
        const items = await this.getDocumentItem();
        if (!items || items.length === 0) {
            console.warn(`Aucun document trouvé pour ${this.itemType} #${this.id}`);
            return null;
        }
        return apiV1.getDocumentBlobV1(items[0].documents_id);
    }

    async getDocument() {
        const items = await this.getDocumentItem();
        if (!items || items.length === 0) {
            console.warn(`Aucun document trouvé pour ${this.itemType} #${this.id}`);
            return null;
        }
        const doc = await apiV1.getV1(`Document/${items[0].documents_id}`);
        console.log(`Détails du Document lié à ${this.itemType} #${this.id} :`, doc);
        return doc;
    }

    async save() {
        if (this.id !== null) {
            throw new Error("save() : cet asset a déjà un ID, utilisez update()");
        }
        const result = await api.post(this.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la création du ${this.itemType}`);
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : cet asset n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(this.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du ${this.itemType} #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error("delete() : cet asset n'a pas d'ID");
        }
        const result = await api.del(this.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du ${this.itemType} #${this.id}`);
        }
        this.id = null;
    }


    static async getAllCompleteSimple(itemType) {
        const assets = await Asset.getAllSimple(itemType);
        return Promise.all(
            assets.map(async (asset) => ({
                asset,
                imageUrl: await asset.getImageUrl(),
            }))
        );
    }

    static async deleteAllSimple(itemType) {
        Asset.#requireItemType(itemType);
        const protectedIds = PROTECTED_IDS[itemType] ?? [];
        await api.deleteAll(Asset.#endpointFor(itemType), protectedIds);
    }

    static async getAllSimple(itemType) {
        return Asset.#fetchAllSimple(itemType);
    }

    static async getByIdSimple(itemType, id) {
        Asset.#requireItemType(itemType);
        const result = await api.get(Asset.#endpointFor(itemType), id);
        if (result?.error) {
            throw new Error(result.message || `${itemType} #${id} introuvable`);
        }
        return new Asset(result, itemType);
    }

    static async getBySimple(itemType, column, value) {
        const filter = clause(column, "==", value);
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getByAndSimple(itemType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAndSimple : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getByOrSimple(itemType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOrSimple : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getByNotSimple(itemType, column, value) {
        const filter = clause(column, "!=", value);
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getByNotAndSimple(itemType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAndSimple : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getByNotOrSimple(itemType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOrSimple : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getInclSimple(itemType, ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getInclSimple : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return Asset.#fetchAllSimple(itemType, { filter });
    }

    static async getExclSimple(itemType, ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExclSimple : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return Asset.#fetchAllSimple(itemType, { filter });
    }


    static async getAllComplete() {
        const assets = await Asset.getAll();
        return Promise.all(
            assets.map(async (asset) => ({
                asset,
                imageUrl: await asset.getImageUrl(),
            }))
        );
    }

    async enrich() {
        return {
            asset: this,
            imageUrl: await this.getImageUrl(),
        };
    }

    static async enrichAll(assets) {
        return Promise.all(assets.map(asset => asset.enrich()));
    }


    static async deleteAll() {
        await Promise.all(
            ITEM_TYPES.map(itemType => Asset.deleteAllSimple(itemType))
        );
    }

    static async getAll() {
        return Asset.#fetchAll();
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return Asset.#fetchAll({ filter });
    }


    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return Asset.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return Asset.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return Asset.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return Asset.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return Asset.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return Asset.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return Asset.#fetchAll({ filter });
    }
}

export default Asset;