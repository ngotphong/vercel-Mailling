require("dotenv").config();

const {
	downloadGoogleDocAsHTML,
	getPlaceholders,
	replacePlaceholders,
} = require("./getGoogleDoc"); // Adjust this import based on your structure
const { getSheetData } = require("./getGoogleSheetData"); // You need to implement or import this function
const { sendEmail, authenticateGmail } = require("./sendingMail");

async function findEmailRow(data) {
	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		if (row.includes("Email") || row.includes("email")) {
			return i; // Return the index of the header row
		}
	}
	return -1; // Return -1 if not found
}

async function customHTMLEmail({ docURL, sheetURL, range, subject }) {
	try {
		const data = await getSheetData(sheetURL, range);
		const htmlContent = await downloadGoogleDocAsHTML(docURL, true); // Get HTML content from Google Doc

		const emailRow = await findEmailRow(data);

		const emailColumnIndex =
			data[emailRow].indexOf("Email") !== -1
				? data[emailRow].indexOf("Email")
				: data[emailRow].indexOf("email");

		const columnIndexes = { Email: emailColumnIndex };

		// Find placeholders in the HTML content
		const placeholders = getPlaceholders(htmlContent);
		for (const fillIn of placeholders) {
			const index =
				data[emailRow].indexOf(fillIn) !== -1
					? data[emailRow].indexOf(fillIn)
					: data[emailRow].indexOf(fillIn.toLowerCase());
			columnIndexes[fillIn] = index;
		}

		const creds = await authenticateGmail(); // Ensure you have this function defined

		// Iterate over each data row, skipping the header
		for (const row of data.slice(emailRow + 1)) {
			const userData = { ...columnIndexes };
			for (const [key, index] of Object.entries(columnIndexes)) {
				userData[key] = row[index]; // Get user data from the current row
			}

			console.log(userData);

			// Create a fresh copy of the original HTML content for each email
			let emailContent = htmlContent;

			// Replace placeholders in the copied emailContent
			emailContent = replacePlaceholders(emailContent, userData);

			// Send the email with the modified emailContent
			await sendEmail({
				creds,
				to: userData["Email"],
				subject,
				htmlContent: emailContent,
			});
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

// Example usage
(async () => {
	try {
		await customHTMLEmail({
			docURL: "https://docs.google.com/document/d/your-doc-id/edit?usp=sharing",
			sheetURL:
				"https://docs.google.com/spreadsheets/d/your-sheet-id/edit?usp=sharing",
			range: "Sheet4", // Adjust as necessary
			subject: "testing",
		});
	} catch (error) {
		console.error("Error in customHTMLEmail:", error);
	}
})();
