# Guide: Étendre les Classes (Héritage) Asset.js

Ce guide explique comment créer des classes spécialisées qui étendent Asset.js avec des attributs et méthodes propres.

## Table des matières

1. [Concept](#concept)
2. [Exemple Simple](#exemple-simple)
3. [Exemple Complet](#exemple-complet)
4. [Patterns Avancés](#patterns-avancés)
5. [Cas d'Usages Réels](#cas-dusages-réels)

---

## Concept

**Héritage = Réutiliser + Spécialiser**

```
Asset (classe parent)
  ├── id, name, status, location, ...
  └── getImageUrl(), getDocument(), ...
    │
    ├── Computer (classe enfant)
    │   ├── cpu, ram, storage (attributs spécialisés)
    │   └── getSpecs(), getPerformance() (méthodes spécialisées)
    │
    └── Printer (classe enfant)
        ├── tonerLevel, color (attributs spécialisés)
        └── getToner(), printTest() (méthodes spécialisées)
```

**Avantages:**
- ✅ Réutilise le code d'Asset (pas de duplication)
- ✅ Ajoute des propriétés/méthodes spécifiques
- ✅ Utilise `super()` pour appeler le parent
- ✅ Polymorphisme (traiter Computer comme Asset)

---

## Exemple Simple

### Computer.js

```javascript
import Asset from "./Asset";

export default class Computer extends Asset {
    constructor(data = {}) {
        // Appelle le constructeur parent
        super(data, "Computer");
        
        // Attributs spécifiques à Computer
        this.cpu = data.cpu ?? "";
        this.ram = data.ram ?? 0;  // GB
        this.storage = data.storage ?? 0;  // GB
        this.os = data.os ?? "";
    }

    // Méthode spécifique
    getSpecs() {
        return {
            cpu: this.cpu,
            ram: `${this.ram}GB`,
            storage: `${this.storage}GB`,
            os: this.os,
        };
    }

    // Peut aussi utiliser les méthodes du parent!
    async enrich() {
        return {
            asset: this,
            specs: this.getSpecs(),
            imageUrl: await this.getImageUrl(),  // ← Méthode d'Asset!
        };
    }
}
```

**Usage:**

```javascript
import Computer from "./Computer";

const computerData = {
    id: 1,
    name: "Dell Laptop",
    cpu: "Intel i7",
    ram: 16,
    storage: 512,
    os: "Windows 11",
};

const computer = new Computer(computerData);

console.log(computer.name);           // Dell Laptop (du parent)
console.log(computer.getSpecs());     // { cpu, ram, storage, os }
console.log(await computer.getImageUrl());  // Appelle Asset.getImageUrl()!
```

---

## Exemple Complet

### Printer.js avec validation

```javascript
import Asset from "./Asset";

export default class Printer extends Asset {
    constructor(data = {}) {
        super(data, "Printer");
        
        this.tonerLevel = data.tonerLevel ?? 100;  // 0-100%
        this.colorSupport = data.colorSupport ?? false;
        this.printSpeed = data.printSpeed ?? 20;  // pages/min
        this.pagePrinted = data.pagePrinted ?? 0;
    }

    // Méthode spécifique 1
    getToner() {
        if (this.tonerLevel < 20) {
            return { status: "warning", level: this.tonerLevel };
        }
        return { status: "ok", level: this.tonerLevel };
    }

    // Méthode spécifique 2
    needsMaintenance() {
        return this.pagePrinted > 100000;
    }

    // Surcharger une méthode du parent
    async enrich() {
        return {
            asset: this,
            toner: this.getToner(),
            maintenance: this.needsMaintenance(),
            imageUrl: await this.getImageUrl(),
        };
    }

    // Méthode statique pour créer depuis un Asset générique
    static fromAsset(asset) {
        if (asset.itemType !== "Printer") {
            throw new Error("Cet asset n'est pas une imprimante");
        }
        return new Printer(asset);
    }
}
```

---

## Patterns Avancés

### Pattern 1: Factory (créer la bonne classe)

```javascript
import Computer from "./Computer";
import Printer from "./Printer";
import Monitor from "./Monitor";

export class AssetFactory {
    static createSpecialized(assetData) {
        switch (assetData.itemType) {
            case "Computer":
                return new Computer(assetData);
            case "Printer":
                return new Printer(assetData);
            case "Monitor":
                return new Monitor(assetData);
            default:
                return new Asset(assetData, assetData.itemType);
        }
    }
}

// Usage
const asset = await Asset.getByIdSimple("Computer", 1);
const computer = AssetFactory.createSpecialized(asset);
console.log(computer.getSpecs());  // ✅ Fonctionne!
```

### Pattern 2: Validation dans le constructeur

```javascript
export default class Computer extends Asset {
    constructor(data = {}) {
        super(data, "Computer");
        
        this.ram = this.#validateRam(data.ram);
        this.cpu = this.#validateCpu(data.cpu);
    }

    #validateRam(value) {
        const ram = Number(value) || 0;
        if (ram < 0 || ram > 256) {
            throw new Error(`RAM invalide: ${value}`);
        }
        return ram;
    }

    #validateCpu(value) {
        if (!value || typeof value !== "string") {
            throw new Error("CPU requis");
        }
        return value;
    }
}
```

### Pattern 3: Enrichissement hiérarchique

```javascript
export default class Computer extends Asset {
    async enrich() {
        // Appelle le parent d'abord
        const parentEnrich = {
            asset: this,
            imageUrl: await this.getImageUrl(),
        };

        // Ajoute les specs du Computer
        return {
            ...parentEnrich,
            specs: this.getSpecs(),
            performance: await this.getPerformance(),
        };
    }

    async getPerformance() {
        // Exemple: appel API pour des infos de performance
        return {
            cpu: this.cpu,
            ram: this.ram,
            score: Math.random() * 100,
        };
    }
}
```

---

## Cas d'Usages Réels

### Use Case 1: Tous les Computers enrichis

```javascript
// Récupérer tous les computers
const allAssets = await Asset.getAll();
const computers = allAssets.filter(a => a.itemType === "Computer");

// Les convertir en classe Computer
const computerObjects = computers.map(c => new Computer(c));

// Enrichir tous
const enriched = await Promise.all(
    computerObjects.map(c => c.enrich())
);

console.log(enriched);
// [
//   { asset: Computer, specs: {...}, imageUrl: "..." },
//   { asset: Computer, specs: {...}, imageUrl: "..." },
//   ...
// ]
```

### Use Case 2: Filtre spécialisé

```javascript
export default class Computer extends Asset {
    static async getHighRamComputers(minRam = 16) {
        const all = await Asset.getAllSimple("Computer");
        return all
            .map(c => new Computer(c))
            .filter(c => c.ram >= minRam);
    }
}

// Usage
const powerComputers = await Computer.getHighRamComputers(32);
console.log(powerComputers);
```

### Use Case 3: Méthode de classe pour update

```javascript
export default class Computer extends Asset {
    async updateSpecs(specs) {
        this.cpu = specs.cpu ?? this.cpu;
        this.ram = specs.ram ?? this.ram;
        this.storage = specs.storage ?? this.storage;
        
        // Appelle la méthode parent update()
        return await this.update({
            cpu: this.cpu,
            ram: this.ram,
            storage: this.storage,
        });
    }
}

// Usage
const computer = new Computer(computerData);
await computer.updateSpecs({ ram: 32, storage: 1024 });
```

---

## Structure de Fichiers

```
src/backend/model/
├── Asset.js           ← Classe parent générique
├── Computer.js        ← Spécialisée pour Computer
├── Printer.js         ← Spécialisée pour Printer
├── Monitor.js         ← Spécialisée pour Monitor
└── AssetFactory.js    ← Factory pour créer la bonne classe
```

---

## Résumé

| Concept | Code | Quand l'utiliser |
|---------|------|-----------------|
| **Classe enfant** | `class Computer extends Asset { }` | Propriétés spécialisées |
| **super()** | `super(data, "Computer")` | Appeler le parent |
| **Méthodes propres** | `getSpecs() { ... }` | Logique spécialisée |
| **Utiliser parent** | `await this.getImageUrl()` | Réutiliser du parent |
| **Factory** | `AssetFactory.createSpecialized()` | Créer la bonne classe |

✅ **L'avantage:** Computer hérite de tout Asset MAIS peut aussi faire ses propres trucs! 👍
