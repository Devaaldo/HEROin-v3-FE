import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Pastikan path sesuai dengan struktur folder Anda

function Footer() {
	return (
		<div className="container">
			<footer
				className="bg-dark text-white py-4 px-4 rounded-top"
				style={{ maxWidth: "95%", margin: "0 auto" }}
			>
				<div className="container-fluid px-4">
					<div className="row">
						<div className="col-md-12">
							{/* Logo */}
							<div className="mb-4">
								<img
									src={logo}
									alt="HEROin Logo"
									style={{ height: "50px", width: "auto" }}
								/>
							</div>

							{/* Contact Section */}
							<div className="mb-3">
								<h5 className="mb-3">
									<span
										className="px-3 py-1 rounded"
										style={{ backgroundColor: "#9630FB" }}
									>
										Contact Us
									</span>
								</h5>

								<div className="mb-2">
									<strong>Email:</strong> info@heroin.com
								</div>
								<div className="mb-2">
									<strong>Phone:</strong> 555-567-8901
								</div>
								<div className="mb-2">
									<strong>Address:</strong> 1234 Main St
									<br />
									Moonstone City, Stardust State 12345
								</div>
							</div>

							{/* Horizontal Line */}
							<hr className="my-4" />

							{/* Copyright */}
							<div className="d-flex justify-content-between">
								<div>
									© {new Date().getFullYear()} HEROin. All Rights Reserved.
								</div>
								<div>
									<Link
										to="/privacy"
										className="text-white text-decoration-none"
									>
										Privacy Policy
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default Footer;
