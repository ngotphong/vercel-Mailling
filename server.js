// server.js
import express from "express";
import { google } from "googleapis";
import open from "open";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI; // Redirect URI
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const oAuth2Client = new google.auth.OAuth2(
	OAUTH_CLIENT_ID,
	OAUTH_CLIENT_SECRET,
	OAUTH_REDIRECT_URI
);

// Start the authentication flow
app.get("/auth", async (req, res) => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});

	console.log("Authorize this app by visiting this URL:", authUrl);

	// Automatically open the authorization URL in the default browser
	await open(authUrl);

	res.send("Opening authentication page...");
});

// Handle the redirect and extract the authorization code
app.get("/auth/callback", async (req, res) => {
	const code = req.query.code;
	const { tokens } = await oAuth2Client.getToken(code);
	oAuth2Client.setCredentials(tokens);

	res.send("Authentication successful! You can close this window.");
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
