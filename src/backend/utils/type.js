export const ASSET_TYPES_CONFIG = {
    computer: { name: "Computer", model: "ComputerModel", linkable: true },
    monitor: { name: "Monitor", model: "MonitorModel", linkable: true },
    printer: { name: "Printer", model: "PrinterModel", linkable: true },
    networkequipment: { name: "NetworkEquipment", model: "NetworkEquipmentModel", linkable: true },
    phone: { name: "Phone", model: "PhoneModel", linkable: true },
    peripheral: { name: "Peripheral", model: "PeripheralModel", linkable: true },
    enclosure: { name: "Enclosure", model: "EnclosureModel", linkable: true },
    pdu: { name: "PDU", model: null, linkable: true },
    software: { name: "Software", model: null, linkable: true },
    softwarelicense: { name: "SoftwareLicense", model: null, linkable: true },
    certificate: { name: "Certificate", model: null, linkable: true },
    rack: { name: "Rack", model: null, linkable: true },
    appliance: { name: "Appliance", model: null, linkable: true },
    passivedcequipment: { name: "PassiveDCEquipment", model: null, linkable: true },
    cable: { name: "Cable", model: null, linkable: true },
    socket: { name: "Socket", model: null, linkable: false },
    // unmanaged: { name: "Unmanaged", model: null, linkable: true },
};

export const ITEM_TYPES = Object.values(ASSET_TYPES_CONFIG).map(config => config.name);
export const  MODEL_TYPES = Object.values(ASSET_TYPES_CONFIG).filter(config => config.model).map(config => config.model);
