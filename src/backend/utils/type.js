
export const ITEM_TYPES = [
    "Computer",
    "Monitor",
    "Printer",
    "NetworkEquipment",
    "Phone",
    "Software",
    "SoftwareLicense",
    "Certificate",
    "Peripheral",
    "Rack",
    "Appliance",
    "Enclosure",
    "PDU",
    "PassiveDCEquipment",
    "Cable",
    "Socket",
    "Unmanaged",
    // "Consumable",
    // "Cartridge",
];

export const MODEL_TYPES = [
    "ComputerModel",
    "MonitorModel",
    "PrinterModel",
    "NetworkEquipmentModel",
    "PhoneModel",
    // "SoftwareModel",
    // "SoftwareLicenseModel",
    // "CertificateModel",
    "PeripheralModel",
    // "RackModel",
    // "ApplianceModel",
    "EnclosureModel",
    // "PDUModel",
    // "PassiveDCEquipmentModel",
    // "CableModel",
    // "SocketModel",
    // "UnmanagedModel",
];

export const ITEM_TYPE_TO_MODEL_TYPE = {
    computer: "ComputerModel",
    monitor:  "MonitorModel",
    printer:  "PrinterModel",
    networkequipment: "NetworkEquipmentModel",
    phone:    "PhoneModel",
    // software: "SoftwareModel",
    // softwarelicense: "SoftwareLicenseModel",
    // certificate: "CertificateModel",
    peripheral: "PeripheralModel",
    // rack: "RackModel",
    // appliance: "ApplianceModel",
    enclosure: "EnclosureModel",
    // pdu: "PDUModel",
    // passivedcequipment: "PassiveDCEquipmentModel",
    // cable: "CableModel",
    // socket: "SocketModel",
    // unmanaged: "UnmanagedModel",
};

// Mapping lowercase → PascalCase (normaliser les types du CSV)
export const ITEM_TYPE_NORMALIZE = Object.fromEntries(
    ITEM_TYPES.map(type => [type.toLowerCase(), type])
);
