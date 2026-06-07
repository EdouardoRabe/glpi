export const ASSET_TYPES_CONFIG = {
    computer: { name: "Computer", model: "ComputerModel", linkWithTicket: true },
    monitor: { name: "Monitor", model: "MonitorModel", linkWithTicket: true },
    printer: { name: "Printer", model: "PrinterModel", linkWithTicket: true },
    networkequipment: { name: "NetworkEquipment", model: "NetworkEquipmentModel", linkWithTicket: true },
    phone: { name: "Phone", model: "PhoneModel", linkWithTicket: true },
    peripheral: { name: "Peripheral", model: "PeripheralModel", linkWithTicket: true },
    enclosure: { name: "Enclosure", model: "EnclosureModel", linkWithTicket: true },
    pdu: { name: "PDU", model: null, linkWithTicket: true },
    software: { name: "Software", model: null, linkWithTicket: true },
    softwarelicense: { name: "SoftwareLicense", model: null, linkWithTicket: true },
    certificate: { name: "Certificate", model: null, linkWithTicket: true },
    rack: { name: "Rack", model: null, linkWithTicket: true },
    appliance: { name: "Appliance", model: null, linkWithTicket: true },
    passivedcequipment: { name: "PassiveDCEquipment", model: null, linkWithTicket: true },
    cable: { name: "Cable", model: null, linkWithTicket: true },
    socket: { name: "Socket", model: null, linkWithTicket: false },
    // unmanaged: { name: "Unmanaged", model: null, linkWithTicket: true },
};

export const ITEM_TYPES = Object.values(ASSET_TYPES_CONFIG).map(config => config.name);
export const  MODEL_TYPES = Object.values(ASSET_TYPES_CONFIG).filter(config => config.model).map(config => config.model);
