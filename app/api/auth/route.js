import { NextResponse } from "next/server";
import { google } from "googleapis";

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

export async function GET() {
	const oauth2Client = new google.auth.OAuth2(
		OAUTH_CLIENT_ID,
		OAUTH_CLIENT_SECRET,
		OAUTH_REDIRECT_URI
	);

	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});

	return NextResponse.json({ authUrl });
}
