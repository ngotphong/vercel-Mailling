import { google } from "googleapis";

function extractSheetId(url) {
	const regex = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

async function getSheetData(googleSheetURL, range) {
	try {
		const sheetId = extractSheetId(googleSheetURL);
		if (!sheetId) {
			throw new Error("Invalid Google Sheets URL");
		}

		const auth = new google.auth.GoogleAuth({
			credentials: {
				private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
				client_email: process.env.SA_CLIENT_EMAIL,
			},
			scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		});

		const sheets = google.sheets({ version: "v4", auth });
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId: sheetId,
			range: range,
		});

		return response.data.values;
	} catch (error) {
		console.error(
			`An error occurred while accessing the Google Sheet: ${error.message}`
		);
	}
}

async function findRowByPrimaryKey(sheetUrl, range, primaryKey) {
	let sheet = [];

	try {
		sheet = await getSheetData(sheetUrl, range);
	} catch (error) {
		console.error("Error fetching data:", error);
		return null; // Exit early if there was an error fetching data
	}

	try {
		// Iterate through each row to find the primary key
		for (let rowIndex = 0; rowIndex < sheet.length; rowIndex++) {
			const row = sheet[rowIndex];
			if (row.includes(primaryKey)) {
				return rowIndex;
			}
		}

		console.log(`Primary key '${primaryKey}' not found in any column.`);
		return null;
	} catch (error) {
		console.error(
			`An error occurred while searching for '${primaryKey}': ${error.message}`
		);
		return null;
	}
}

module.exports = { getSheetData, findRowByPrimaryKey };

getSheetData(
	"https://docs.google.com/spreadsheets/d/1vaKcL1u4031p7CbywG6_Yg4mLDGyU4AY3rUWNErj05E/edit?usp=sharing",
	"Sheet1"
).then((data) => {
	data.forEach((value) => console.log(value));
});
