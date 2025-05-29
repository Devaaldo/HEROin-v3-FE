import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
	return (
		<div className="container py-5">
			{/* Hero Section */}
			<div className="row align-items-center mb-5">
				<div className="col-lg-6">
					<h1 className="display-4 fw-bold mb-2">
						<span className="hero-title">HERO</span>in
					</h1>
					<h3 className="mb-3">Sahabat candu-mu</h3>
					<p className="lead mb-4">
						Sistem Pakar Identifikasi Dampak Negatif Kecanduan Game Online di
						Kalangan Mahasiswa
					</p>
					<Link to="/user-info" className="btn btn-primary btn-lg px-4 py-2">
						Mulai Diagnosa
					</Link>
				</div>
				<div className="col-lg-6">
					<div className="hero-image-container">
						<img
							src="/src/assets/dontol.png"
							alt="Gaming Addiction Illustration"
							className="img-fluid hero-image"
						/>
					</div>
				</div>
			</div>

			{/* Services Section */}
			<div className="services-section mt-5">
				<div className="d-flex align-items-center mb-4">
					<div className="service-badge me-3">Services</div>
					<p className="mb-0">
						Kami memudahkan identifikasi tingkat dan dampak kecanduan game
						online
					</p>
				</div>

				<div className="row g-4">
					{/* Service Card 1 */}
					<div className="col-md-6 col-lg-3">
						<div className="card service-card bg-dark text-white h-100">
							<div className="card-body position-relative p-4">
								<div className="card-tag">Problem Solving</div>
								<div className="icon-container">
									<span className="service-icon">📺</span>
								</div>
							</div>
						</div>
					</div>

					{/* Service Card 2 */}
					<div className="col-md-6 col-lg-3">
						<div className="card service-card bg-light h-100">
							<div className="card-body position-relative p-4">
								<div className="card-tag">Time Management</div>
								<div className="icon-container">
									<span className="service-icon">⏱️</span>
								</div>
							</div>
						</div>
					</div>

					{/* Service Card 3 */}
					<div className="col-md-6 col-lg-3">
						<div className="card service-card purple-bg text-white h-100">
							<div className="card-body position-relative p-4">
								<div className="card-tag">Questionnaire</div>
								<div className="icon-container">
									<span className="service-icon">📝</span>
								</div>
							</div>
						</div>
					</div>

					{/* Service Card 4 */}
					<div className="col-md-6 col-lg-3">
						<div className="card service-card bg-light h-100">
							<div className="card-body position-relative p-4">
								<div className="card-tag">Analytics and Insight</div>
								<div className="icon-container">
									<span className="service-icon">📊</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
