"use client";
import React, { useState } from "react";

const GoogleIntegrationForm = () => {
	// State hooks to store input values
	const [docUrl, setDocUrl] = useState("");
	const [sheetUrl, setSheetUrl] = useState("");
	const [title, setTitle] = useState("");
	const [range, setRange] = useState("");

	// Function to handle form submission
	const handleSubmit = (e: any) => {
		e.preventDefault(); // Prevent default form submission behavior

		// Replace with your send logic, such as an API request
		console.log("Sending Data:");
		console.log("Google Doc URL:", docUrl);
		console.log("Google Sheet URL:", sheetUrl);
		console.log("Title:", title);
		console.log("Range:", range);

		// Example: You can perform an API call here using fetch or axios
		// fetch('/api/sendData', { method: 'POST', body: JSON.stringify({ docUrl, sheetUrl, title, range }) });

		alert("Data Sent!"); // Confirmation for the user
	};

	return (
		<div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			<h2>Google Integration Form</h2>

			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="docUrl">Google Doc URL:</label>
				<input
					type="url"
					id="docUrl"
					value={docUrl}
					onChange={(e) => setDocUrl(e.target.value)}
					required
					style={{
						width: "100%",
						padding: "8px",
						marginTop: "5px",
					}}
				/>
			</div>

			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="sheetUrl">Google Sheet URL:</label>
				<input
					type="url"
					id="sheetUrl"
					value={sheetUrl}
					onChange={(e) => setSheetUrl(e.target.value)}
					required
					style={{
						width: "100%",
						padding: "8px",
						marginTop: "5px",
					}}
				/>
			</div>

			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="title">Title:</label>
				<input
					type="text"
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					style={{
						width: "100%",
						padding: "8px",
						marginTop: "5px",
					}}
				/>
			</div>

			<div style={{ marginBottom: "10px" }}>
				<label htmlFor="range">Range:</label>
				<input
					type="text"
					id="range"
					value={range}
					onChange={(e) => setRange(e.target.value)}
					required
					style={{
						width: "100%",
						padding: "8px",
						marginTop: "5px",
					}}
				/>
			</div>

			{/* Submit button that triggers the handleSubmit function */}
			<button
				type="submit"
				style={{ padding: "10px 20px", marginTop: "10px" }}
				onClick={handleSubmit}
			>
				Send
			</button>
		</div>
	);
};

export default GoogleIntegrationForm;
