import api from "../utils/api";
import { clause, and, or, fetchAll } from "../utils/query";

class Location {

    static endpoint     = "Dropdowns/Location";
    static limit        = 100;
    static protectedIds = [];

    constructor(data = {}) {
        this.id            = data.id            ?? null;
        this.name          = data.name          ?? "";
        this.completename  = data.completename  ?? null;
        this.comment       = data.comment       ?? null;
        this.is_recursive  = data.is_recursive  ?? false;
        this.date_creation = data.date_creation ?? null;
        this.date_mod      = data.date_mod      ?? null;
        this.entity        = data.entity        ?? null;
        this.parent        = data.parent        ?? null;
    }

    async save() {
        if (this.id !== null) {
            throw new Error("save() : ce Location a déjà un ID, utilisez update()");
        }
        const result = await api.post(Location.endpoint, this);
        if (result?.error) {
            throw new Error(result.message || "Erreur lors de la création du Location");
        }
        this.id = result.id ?? null;
        return this;
    }

    async update(fields = {}) {
        if (this.id === null) {
            throw new Error("update() : ce Location n'a pas d'ID, utilisez save()");
        }
        Object.assign(this, fields);
        const result = await api.patch(Location.endpoint, fields, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la mise à jour du Location #${this.id}`);
        }
        return this;
    }

    async delete() {
        if (this.id === null) {
            throw new Error("delete() : ce Location n'a pas d'ID");
        }
        const result = await api.del(Location.endpoint, this.id);
        if (result?.error) {
            throw new Error(result.message || `Erreur lors de la suppression du Location #${this.id}`);
        }
        this.id = null;
    }

    static async deleteAll() {
        await api.deleteAll(Location.endpoint, Location.protectedIds);
    }

    static fromArray(dataArray = []) {
        return dataArray.map(item => new Location(item));
    }

    static async #fetchAll(queryParams = {}) {
        const raw = await fetchAll(queryParams, Location.endpoint, Location.limit);
        return Location.fromArray(raw);
    }

    static async getAll() {
        return await Location.#fetchAll();
    }

    static async getById(id) {
        const result = await api.get(Location.endpoint, id);
        if (result?.error) {
            throw new Error(result.message || `Location #${id} introuvable (status ${result.status})`);
        }
        return new Location(result);
    }

    static async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await Location.#fetchAll({ filter });
    }

    static async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await Location.#fetchAll({ filter });
    }

    static async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "==", value)));
        return await Location.#fetchAll({ filter });
    }

    static async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await Location.#fetchAll({ filter });
    }

    static async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await Location.#fetchAll({ filter });
    }

    static async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(...criteria.map(({ column, value }) => clause(column, "!=", value)));
        return await Location.#fetchAll({ filter });
    }

    static async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await Location.#fetchAll({ filter });
    }

    static async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await Location.#fetchAll({ filter });
    }
}

export default Location;
