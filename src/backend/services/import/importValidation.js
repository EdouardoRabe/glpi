import { parseCSV } from "../../utils/csv";
import {parseCSVNumber}  from "../../utils/utils";

const FILE_RULES = {
	file1: {
		label: 'Fichier 1',
		allowedColumns: [
            "name", "status", "location", "manufacturer", "item_type", "model", "inventory_number", "user"
        ]
	},
	file2: {
		label: 'Fichier 2',
		allowedColumns: [
            "ref_ticket", "date", "heure", "type", "titre", "description", "status", "priority", "items",
        ]
	},
	file3: {
		label: 'Fichier 3',
		allowedColumns: [
            "num_ticket", "duration_second", "time_cost", "fixed_cost"
        ],
	},
}

const isValidDDMMYYYY = (value) => {
	if (!value) {
		return true
	}

	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
	if (!match) {
		return false
	}

	const day = Number.parseInt(match[1], 10)
	const month = Number.parseInt(match[2], 10)
	const year = Number.parseInt(match[3], 10)
	const date = new Date(year, month - 1, day)

	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}


const validateColumns = (rows, fileLabel, allowedColumns, errors) => {

	const allowed = new Set(allowedColumns.map((col) => col.trim().toLowerCase()))
	const headers = Object.keys(rows?.[0] || {})

	headers.forEach((header) => {
		const normalizedHeader = header.trim().toLowerCase()
		if (!allowed.has(normalizedHeader)) {
			errors.push({
				file: fileLabel,
				line: '-',
				field: header,
				value: header,
				rule: 'Nom de colonne conforme (avec accents requis)',
				message: `Colonne non reconnue: "${header}". Colonnes acceptées: ${allowedColumns.join(', ')}`,
			})
		}
	})
}

const validateRows = (rows, fileLabel, errors, options = {}) => {
	const dateField = options.dateField || null
	const amountFields = options.amountFields || []

	rows.forEach((row, index) => {
		if (dateField && Object.hasOwn(row, dateField)) {
			const dateValue = row[dateField]
			if (!isValidDDMMYYYY(dateValue)) {
				errors.push({
					file: fileLabel,
					line: index + 2,
					field: dateField,
					value: dateValue,
					rule: 'Format de date différent de DD/MM/YYYY',
					message: `Date invalide: ${dateValue}`,
				})
			}
		}

		amountFields.forEach((fieldName) => {
			if (!Object.hasOwn(row, fieldName)) {
				return
			}

			const value = row[fieldName]
			const numericValue = parseCSVNumber(value)
			if (numericValue === null) {
				return
			}

			if (Number.isNaN(numericValue)) {
				errors.push({
					file: fileLabel,
					line: index + 2,
					field: fieldName,
					value,
					rule: 'Montant positif',
					message: `Montant invalide: ${value}`,
				})
				return
			}

			if (numericValue < 0) {
				errors.push({
					file: fileLabel,
					line: index + 2,
					field: fieldName,
					value,
					rule: 'Montant positif',
					message: `Montant negatif: ${value}`,
				})
			}
		})
	})
}

const validateSingleCsvFile = async ({ file, fileKey, errors, options = {} }) => {
	if (!file) {
		return []
	}

	const rule = FILE_RULES[fileKey]
	if (!rule) {
		return []
	}
	const text = await file.text();
	const rows = await parseCSV(text);

	validateColumns(rows, rule.label, rule.allowedColumns, errors)
	validateRows(rows, rule.label, errors, options)

	return rows
}

export const validateImportBatch = async ({ file1, file2, file3 } = {}) => {
	const errors = []
	if (file1){ await validateSingleCsvFile({ file: file1, fileKey: 'file1', errors})}
	if (file2){ await validateSingleCsvFile({ file: file2, fileKey: 'file2', errors, options: { dateField: 'date'} } )}
	if (file3){ await validateSingleCsvFile({ file: file3, fileKey: 'file3', errors, options: {  amountFields: ['duration', 'time_cost', 'fixed_cost'] } })}
	console.log("Validation result: ", { valid: errors.length === 0, errors })
	return {
		valid: errors.length === 0,
		errors,
	}
}
