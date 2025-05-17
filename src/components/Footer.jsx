import React from "react";

export default function Footer() {
	return (
		<footer className="bg-dark text-white py-3 mt-auto">
			<div className="container text-center">
				<p className="mb-0">
					&copy; {new Date().getFullYear()} HEROin - Sistem Pakar Identifikasi
					Dampak Negatif Kecanduan Game Online
				</p>
			</div>
		</footer>
	);
}
