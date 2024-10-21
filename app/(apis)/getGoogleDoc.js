import cheerio from "cheerio";
import fs from "fs";
import { google } from "googleapis";

function extractDocId(url) {
	const regex = /document\/d\/([a-zA-Z0-9-_]+)/;
	const match = url.match(regex);
	return match ? match[1] : null;
}

function disableBodyStyling(htmlContent) {
	const $ = cheerio.load(htmlContent);
	$("body").attr("style", ""); // Remove inline styles
	$("body").removeAttr("class"); // Remove any class on the <body> tag
	return $.html(); // Return modified HTML
}

async function downloadGoogleDocAsHTML(docUrl, file = false) {
	const auth = new google.auth.GoogleAuth({
		credentials: {
			private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
			client_email: process.env.SA_CLIENT_EMAIL,
		},
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
	});

	const docId = extractDocId(docUrl);
	if (!docId) {
		throw new Error("Invalid Google Doc URL.");
	}

	const drive = google.drive({ version: "v3", auth });

	const response = await drive.files.export(
		{
			fileId: docId,
			mimeType: "text/html",
		},
		{ responseType: "stream" }
	);

	let htmlContent = "";
	response.data.on("data", (chunk) => {
		htmlContent += chunk;
	});

	return new Promise((resolve, reject) => {
		response.data.on("end", () => {
			const processedHtml = disableBodyStyling(htmlContent);
			if (file) {
				fs.writeFileSync("output.html", processedHtml);
				console.log(`The file has been saved to output.html`);
			}
			resolve(processedHtml);
		});
		response.data.on("error", reject);
	});
}

function getPlaceholders(htmlContent) {
	const pattern = /\$\[([^\]]+)\]/g;
	const matches = [...htmlContent.matchAll(pattern)];
	return matches.map((match) => match[1]);
}

function replacePlaceholders(htmlContent, replacementDict) {
	const pattern = /\$\[([^\]]+)\]/g;
	return htmlContent.replace(pattern, (match, p1) => {
		return replacementDict[p1] !== undefined ? replacementDict[p1] : match;
	});
}

module.exports = {
	downloadGoogleDocAsHTML,
	getPlaceholders,
	replacePlaceholders,
};

// Example usage
downloadGoogleDocAsHTML(
	"https://docs.google.com/document/d/1D0bZ22qu7qxx6pnXq5bPBhRLKHkdOsPnTP2ziDF_J74/edit?usp=sharing",
	true
)
	.then((html) => {
		const placeholders = getPlaceholders(html);
		console.log("Placeholders found:", placeholders);

		const object = {
			Tên: "John Doe",
			"Lớp (vd: 10B4)": "8a2",
			"SĐT (không bắt buộc)": "2024-10-21",
			"Quầy (loại vé)": "Hắc (6-7-8)",
		};

		const data = replacePlaceholders(html, object);

		// Write the replaced HTML to a file
		fs.writeFile("output.html", data, (err) => {
			if (err) {
				console.error("Error writing to file:", err);
			} else {
				console.log("File has been written successfully!");
			}
		});
	})
	.catch((error) => {
		console.error("Error downloading the document:", error);
	});
