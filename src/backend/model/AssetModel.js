import api from "../utils/api";
import { clause, and, or, fetchAll } from "../utils/query";

const DEFAULT_LIMIT = 100;
const PROTECTED_IDS = {};

export const MODEL_TYPES = [
    "ComputerModel",
    "MonitorModel",
    "PrinterModel",
    "NetworkEquipmentModel",
    "PhoneModel",
];

class AssetModel {

  
    constructor(data = {}, modelType = "") {
        this.modelType      = modelType;

        this.id             = data.id             ?? null;
        this.name           = data.name           ?? "";
        this.comment        = data.comment        ?? null;
        this.product_number = data.product_number ?? null;
        this.date_creation  = data.date_creation  ?? null;
        this.date_mod       = data.date_mod       ?? null;
    }

    get endpoint() {
        return `Dropdowns/${this.modelType}`;
    }

    static #endpointFor(modelType) {
        return `Dropdowns/${modelType}`;
    }

    static #fromArray(dataArray = [], modelType) {
        return dataArray.map(item => new AssetModel(item, modelType));
    }

    static #requireModelType(modelType) {
        if (!modelType || typeof modelType !== "string" || modelType.trim() === "") {
            throw new Error("AssetModel : modelType est requis (ex: 'ComputerModel', 'MonitorModel')");
        }
    }

    static async #fetchAllSimple(modelType, queryParams = {}) {
        AssetModel.#requireModelType(modelType);
        const raw = await fetchAll(queryParams, AssetModel.#endpointFor(modelType), DEFAULT_LIMIT);
        return AssetModel.#fromArray(raw, modelType);
    }

    static async #fetchAll(queryParams = {}) {
        const results = await Promise.all(
            MODEL_TYPES.map(modelType => AssetModel.#fetchAllSimple(modelType, queryParams))
        );
        return results.flat();
    }


    async save() {
        if (this.id !== null) {
            throw new Error(`save() : ce ${this.modelType} a déjà un ID, utilisez update()`);
        }
        const result = await api.post(this.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la création du ${this.modelType}`);
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error(`update() : ce ${this.modelType} n'a pas d'ID, utilisez save()`);
        }
        Object.assign(this, fields);
        const result = await api.patch(this.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du ${this.modelType} #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error(`delete() : ce ${this.modelType} n'a pas d'ID`);
        }
        const result = await api.del(this.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du ${this.modelType} #${this.id}`);
        }
        this.id = null;
    }


    static async deleteAllSimple(modelType) {
        AssetModel.#requireModelType(modelType);
        const protectedIds = PROTECTED_IDS[modelType] ?? [];
        await api.deleteAll(AssetModel.#endpointFor(modelType), protectedIds);
    }

    static async getAllSimple(modelType) {
        return AssetModel.#fetchAllSimple(modelType);
    }

    static async getByIdSimple(modelType, id) {
        AssetModel.#requireModelType(modelType);
        const result = await api.get(AssetModel.#endpointFor(modelType), id);
        if (result?.error) {
            throw new Error(result.message || `${modelType} #${id} introuvable`);
        }
        return new AssetModel(result, modelType);
    }

    static async getBySimple(modelType, column, value) {
        const filter = clause(column, "==", value);
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getByAndSimple(modelType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAndSimple : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getByOrSimple(modelType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOrSimple : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getByNotSimple(modelType, column, value) {
        const filter = clause(column, "!=", value);
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getByNotAndSimple(modelType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAndSimple : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getByNotOrSimple(modelType, criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOrSimple : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getInclSimple(modelType, ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getInclSimple : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    static async getExclSimple(modelType, ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExclSimple : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return AssetModel.#fetchAllSimple(modelType, { filter });
    }

    // ── Méthodes statiques — tous les MODEL_TYPES ───────────────────────────

    static async deleteAll() {
        await Promise.all(MODEL_TYPES.map(modelType => AssetModel.deleteAllSimple(modelType)));
    }

    static async getAll() {
        return AssetModel.#fetchAll();
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return AssetModel.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return AssetModel.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return AssetModel.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return AssetModel.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return AssetModel.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return AssetModel.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return AssetModel.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return AssetModel.#fetchAll({ filter });
    }
}

export default AssetModel;