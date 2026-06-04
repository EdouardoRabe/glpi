import api from "../utils/api";
import { clause, and, or, fetchAll } from "../utils/query";

class Ticket {
    endpoint = "Assistance/Ticket";
    limit = 100;

    constructor() { return }

    async #fetchAll(queryParams = {}, endpoint = this.endpoint, limit = this.limit) {
        return await fetchAll(queryParams, endpoint, limit);
    }

    async getAll() {
        return await this.#fetchAll();
    }

    async getById(id) {
        const result = await api.get(this.endpoint, id);
        if (result?.error) {
            throw new Error(
                result.message || `Ticket #${id} introuvable (status ${result.status})`
            );
        }
        return result;
    }

    async getBy(column, value) {
        const filter = clause(column, "==", value);
        return await this.#fetchAll({ filter });
    }

    async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(
            ...criteria.map(({ column, value }) => clause(column, "==", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(
            ...criteria.map(({ column, value }) => clause(column, "==", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getByNot(column, value) {
        const filter = clause(column, "!=", value);
        return await this.#fetchAll({ filter });
    }
  
    async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = and(
            ...criteria.map(({ column, value }) => clause(column, "!=", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = or(
            ...criteria.map(({ column, value }) => clause(column, "!=", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=in=", ids);
        return await this.#fetchAll({ filter });
    }

    async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = clause("id", "=out=", ids);
        return await this.#fetchAll({ filter });
    }
}

export default Ticket;