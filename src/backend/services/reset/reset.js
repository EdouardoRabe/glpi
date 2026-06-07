import { deleteAll } from "../../utils/api";
import { or } from "../../utils/query";

export const toDelete = [
    // ── ITIL ──────────────────────────────────────────────────────────────────
    { order: 1,  name: 'Tickets',          endpoint: 'Assistance/Ticket' },
    { order: 2,  name: 'Changes',          endpoint: 'Assistance/Change' },
    { order: 3,  name: 'Problems',         endpoint: 'Assistance/Problem' },

    // ── Assets ────────────────────────────────────────────────────────────────
    { order: 4,  name: 'Computers',        endpoint: 'Assets/Computer' },
    { order: 5,  name: 'Monitors',         endpoint: 'Assets/Monitor' },
    { order: 6,  name: 'NetworkEquipment', endpoint: 'Assets/NetworkEquipment' },
    { order: 7,  name: 'Printers',         endpoint: 'Assets/Printer' },
    { order: 8,  name: 'Phones',           endpoint: 'Assets/Phone' },
    { order: 9,  name: 'Peripherals',      endpoint: 'Assets/Peripheral' },
    { order: 10, name: 'Software',         endpoint: 'Assets/Software' },
    { order: 11, name: 'SoftwareLicense',  endpoint: 'Assets/SoftwareLicense' },
    { order: 12, name: 'Certificates',     endpoint: 'Assets/Certificate' },
    { order: 13, name: 'Racks',            endpoint: 'Assets/Rack' },
    { order: 14, name: 'Enclosures',       endpoint: 'Assets/Enclosure' },
    { order: 15, name: 'Appliances',       endpoint: 'Assets/Appliance' },
    { order: 16, name: 'PDUs',             endpoint: 'Assets/PDU' },
    { order: 17, name: 'PassiveDCEquipment', endpoint: 'Assets/PassiveDCEquipment' },
    { order: 18, name: 'Cables',           endpoint: 'Assets/Cable' },
    { order: 19, name: 'Sockets',          endpoint: 'Assets/Socket' },
    { order: 20, name: 'Unmanaged',        endpoint: 'Assets/Unmanaged' },
    { order: 21, name: 'Consumables',      endpoint: 'Assets/Consumable' },
    { order: 22, name: 'Cartridges',       endpoint: 'Assets/Cartridge' },

    // ── Gestion ───────────────────────────────────────────────────────────────
    { order: 23, name: 'Contracts',        endpoint: 'Management/Contract' },
    { order: 24, name: 'Documents',        endpoint: 'Management/Document' },
    { order: 25, name: 'Budgets',          endpoint: 'Management/Budget' },
    { order: 26, name: 'Suppliers',        endpoint: 'Management/Supplier' },
    { order: 27, name: 'Contacts',         endpoint: 'Management/Contact' },
    { order: 28, name: 'Projects',         endpoint: 'Project' },

    // ── Dropdowns créés par l'import ──────────────────────────────────────────
    // À supprimer APRÈS les assets qui les référencent
    { order: 29, name: 'ComputerModels',   endpoint: 'Dropdowns/ComputerModel' },
    { order: 30, name: 'MonitorModels',    endpoint: 'Dropdowns/MonitorModel' },
    { order: 31, name: 'NetworkEquipmentModels', endpoint: 'Dropdowns/NetworkEquipmentModel' },
    { order: 32, name: 'PrinterModels',    endpoint: 'Dropdowns/PrinterModel' },
    { order: 33, name: 'PhoneModels',      endpoint: 'Dropdowns/PhoneModel' },
    { order: 34, name: 'PeripheralModels', endpoint: 'Dropdowns/PeripheralModel' },
    { order: 35, name: 'Manufacturers',    endpoint: 'Dropdowns/Manufacturer' },
    { order: 36, name: 'Locations',        endpoint: 'Dropdowns/Location' },
    { order: 37, name: 'States',           endpoint: 'Dropdowns/State' },

    // ── Users en dernier (dépendance des assets et tickets) ───────────────────
    { order: 38, name: 'Users',            endpoint: 'Administration/User' },
];

export const protectedIds = [
    { name: 'Users', ids: [2, 3, 4, 5, 6] },
];

export const reset = async (selected) => {
    try {
        for (const item of selected) {
            const protectedItem = protectedIds.find(p => p.name === item.name);
            await deleteAll(item.endpoint, protectedItem ? protectedItem.ids : []);
            console.log(`Reset completed for ${item.name}`);
        }
    } catch (error) {
        throw new Error(`Failed to delete: ${error.message}`, error);
    }
};

export default {
    toDelete,
    protectedIds,
    reset,
};