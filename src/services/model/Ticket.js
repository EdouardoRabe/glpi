import api from "../utils/api";

class Ticket {
    endpoint = "Assistance/Ticket";
    limit = 100;

    constructor() { return }

    #rsqlValue(value) {
        if (typeof value === "number") return String(value);
        const str = String(value);
        if (/[\s,;()=!<>]/.test(str)) return `"${str.replace(/"/g, '\\"')}"`;
        return str;
    }

    #clause(column, op, value) {
        if (Array.isArray(value)) {
            const list = value.map(v => this.#rsqlValue(v)).join(",");
            return `${column}${op}(${list})`;
        }
        return `${column}${op}${this.#rsqlValue(value)}`;
    }

    #and(...clauses) {
        return clauses.filter(Boolean).join(";");
    }

    #or(...clauses) {
        return clauses.filter(Boolean).join(",");
    }


    async #fetchAll(queryParams = {}) {
        let start = 0;
        const allItems = [];

        while (true) {
            const result = await api.get(this.endpoint, null, {
                query: { ...queryParams, start, limit: this.limit },
            });

            if (result?.error) {
                throw new Error(
                    result.message || `Erreur API (status ${result.status ?? "inconnu"})`
                );
            }

            const items = Array.isArray(result) ? result : result?.data ?? [];
            allItems.push(...items);

            if (items.length < this.limit) break;
            start += this.limit;
        }

        return allItems;
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
        const filter = this.#clause(column, "==", value);
        return await this.#fetchAll({ filter });
    }

    async getByAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByAnd : le paramètre doit être un tableau non vide");
        }
        const filter = this.#and(
            ...criteria.map(({ column, value }) => this.#clause(column, "==", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getByOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByOr : le paramètre doit être un tableau non vide");
        }
        const filter = this.#or(
            ...criteria.map(({ column, value }) => this.#clause(column, "==", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getByNot(column, value) {
        const filter = this.#clause(column, "!=", value);
        return await this.#fetchAll({ filter });
    }
  
    async getByNotAnd(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotAnd : le paramètre doit être un tableau non vide");
        }
        const filter = this.#and(
            ...criteria.map(({ column, value }) => this.#clause(column, "!=", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getByNotOr(criteria) {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            throw new Error("getByNotOr : le paramètre doit être un tableau non vide");
        }
        const filter = this.#or(
            ...criteria.map(({ column, value }) => this.#clause(column, "!=", value))
        );
        return await this.#fetchAll({ filter });
    }

    async getIncl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getIncl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = this.#clause("id", "=in=", ids);
        return await this.#fetchAll({ filter });
    }

    async getExcl(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new Error("getExcl : le paramètre doit être un tableau d'IDs non vide");
        }
        const filter = this.#clause("id", "=out=", ids);
        return await this.#fetchAll({ filter });
    }
}

export default Ticket;