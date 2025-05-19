import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
	return (
		<nav
			className="navbar navbar-expand-lg"
			style={{ backgroundColor: "#FFFFFF" }}
		>
			<div className="container">
				<Link className="navbar-brand text-white" to="/">
					<img
						src={logo}
						alt="HEROin Logo"
						className="me-2"
						style={{ height: "50px", width: "auto" }}
					/>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ms-auto">
						<li className="nav-item">
							<Link className="nav-link text-black" to="/">
								Home
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link text-black" to="/user-info">
								Identitas
							</Link>
						</li>
						<li className="nav-item ms-2">
							<Link
								className="btn btn-outline-dark rounded-pill"
								to="/dashboard"
							>
								Dashboard
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
