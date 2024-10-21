import { google } from "googleapis";

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI; // Redirect URI
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

/**
 * Authenticate with Gmail API using OAuth2
 */
async function authenticateGmail() {
	const oAuth2Client = new google.auth.OAuth2(
		OAUTH_CLIENT_ID,
		OAUTH_CLIENT_SECRET,
		OAUTH_REDIRECT_URI
	);

	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});

	console.log("Authorize this app by visiting this URL:", authUrl);

	const code = "USER_AUTH_CODE"; // Replace this with user input for the auth code

	const { tokens } = await oAuth2Client.getToken(code);
	oAuth2Client.setCredentials(tokens);

	return oAuth2Client;
}

/**
 * Create an email message
 */
function createEmail({
	to,
	cc,
	bcc,
	subject,
	messageText,
	htmlContent,
	imagePath,
	filePath,
}) {
	const message = [];
	message.push(`To: ${to}`);
	message.push(`Subject: ${subject}`);

	if (cc) {
		message.push(`Cc: ${cc}`);
	}
	if (bcc) {
		message.push(`Bcc: ${bcc}`);
	}

	message.push("MIME-Version: 1.0");
	message.push('Content-Type: multipart/mixed; boundary="boundary"');
	message.push("");
	message.push("--boundary");
	message.push('Content-Type: text/plain; charset="UTF-8"');
	message.push("Content-Transfer-Encoding: 7bit");
	message.push("");
	message.push(messageText);
	message.push("--boundary");
	message.push('Content-Type: text/html; charset="UTF-8"');
	message.push("Content-Transfer-Encoding: 7bit");
	message.push("");
	message.push(htmlContent);

	if (imagePath) {
		const image = fs.readFileSync(imagePath).toString("base64");
		message.push("--boundary");
		message.push(`Content-Type: image/jpeg; name="${imagePath}"`);
		message.push(`Content-Disposition: inline; filename="${imagePath}"`);
		message.push(`Content-Transfer-Encoding: base64`);
		message.push("");
		message.push(image);
	}

	if (filePath) {
		const file = fs.readFileSync(filePath).toString("base64");
		message.push("--boundary");
		message.push(
			`Content-Type: application/octet-stream; name="${filePath}"`
		);
		message.push(`Content-Disposition: attachment; filename="${filePath}"`);
		message.push(`Content-Transfer-Encoding: base64`);
		message.push("");
		message.push(file);
	}

	message.push("--boundary--");

	return Buffer.from(message.join("\r\n")).toString("base64url");
}

/**
 * Send the email
 */
async function sendEmail({
	creds,
	to,
	cc,
	bcc,
	subject,
	messageText,
	htmlContent,
	imagePath,
	filePath,
}) {
	try {
		const service = google.gmail({ version: "v1", auth: creds });
		const emailMessage = createEmail({
			to,
			cc,
			bcc,
			subject,
			messageText,
			htmlContent,
			imagePath,
			filePath,
		});

		const response = await service.users.messages.send({
			userId: "me",
			requestBody: {
				raw: emailMessage,
			},
		});

		console.log("Email sent successfully! Message ID:", response.data.id);
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

// Wrap the main logic in an async function
(async () => {
	try {
		const creds = await authenticateGmail();

		await sendEmail({
			creds,
			to: "phongunin@gmail.com",
			cc: "", // Optional
			bcc: "", // Optional
			subject: "Test Email",
			messageText: "This is a plain text email message",
			htmlContent: "<h1>This is an HTML email message</h1>",
			//   imagePath: "path/to/your/image.jpg", // Optional
			//   filePath: "path/to/your/attachment.pdf", // Optional
		});
	} catch (error) {
		console.error("Error:", error);
	}
})();
