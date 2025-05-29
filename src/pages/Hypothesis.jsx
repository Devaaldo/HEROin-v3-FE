import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Hypothesis() {
	const navigate = useNavigate();
	const [hypotheses, setHypotheses] = useState([]);
	const [selectedHypothesis, setSelectedHypothesis] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Periksa apakah user info sudah diisi
		const userInfo = sessionStorage.getItem("userInfo");
		if (!userInfo) {
			navigate("/user-info");
			return;
		}

		// Ambil data hipotesis dari backend
		const fetchHypotheses = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/hypotheses"
				);
				setHypotheses(response.data);
				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data hipotesis");
				setLoading(false);
				console.error(err);
			}
		};

		fetchHypotheses();
	}, [navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedHypothesis) {
			setError("Silakan pilih salah satu hipotesis");
			return;
		}

		try {
			// Simpan hipotesis ke session storage
			sessionStorage.setItem("selectedHypothesis", selectedHypothesis);

			// Kirim data ke backend
			await axios.post("http://localhost:5000/api/selected-hypothesis", {
				userId: JSON.parse(sessionStorage.getItem("userInfo")).nama,
				hypothesisId: selectedHypothesis,
			});

			// Navigasi ke halaman kuesioner
			navigate("/questionnaire");
		} catch (err) {
			setError("Terjadi kesalahan saat menyimpan hipotesis");
			console.error(err);
		}
	};

	const getHypothesisIcon = (code) => {
		switch (code) {
			case "P1":
				return "bi-emoji-smile";
			case "P2":
				return "bi-emoji-neutral";
			case "P3":
				return "bi-emoji-frown";
			default:
				return "bi-question-circle";
		}
	};

	const getHypothesisColor = (code) => {
		switch (code) {
			case "P1":
				return "success";
			case "P2":
				return "warning";
			case "P3":
				return "danger";
			default:
				return "primary";
		}
	};

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-3">Memuat data hipotesis...</p>
			</div>
		);
	}

	return (
		<div className="hypothesis-page">
			<h2 className="mb-4 text-center">
				Pilih Hipotesis Tingkat Kecanduan Game Online
			</h2>
			<div className="row justify-content-center">
				<div className="col-md-10">
					<div className="card shadow">
						<div className="card-body">
							<div className="alert alert-info">
								<h5>
									<i className="bi bi-info-circle me-2"></i>
									Sistem Pakar dengan Backward Chaining
								</h5>
								<p className="mb-2">
									Sistem ini menggunakan metode{" "}
									<strong>Backward Chaining</strong> untuk menentukan pertanyaan
									yang relevan berdasarkan hipotesis yang Anda pilih.
								</p>
								<p className="mb-0">
									Pilih hipotesis yang paling sesuai dengan kondisi Anda,
									kemudian sistem akan mengajukan pertanyaan spesifik untuk
									memvalidasi hipotesis tersebut menggunakan{" "}
									<strong>Certainty Factor</strong>.
								</p>
							</div>

							{error && <div className="alert alert-danger">{error}</div>}

							<form onSubmit={handleSubmit}>
								<div className="mb-4">
									<h5 className="mb-3">Pilih salah satu hipotesis berikut:</h5>

									{hypotheses.map((hypothesis) => (
										<div
											className={`card mb-3 ${
												selectedHypothesis === hypothesis.id
													? "border-primary"
													: ""
											}`}
											key={hypothesis.id}
										>
											<div className="card-body">
												<div className="form-check">
													<input
														className="form-check-input"
														type="radio"
														name="hypothesis"
														id={`hypothesis-${hypothesis.id}`}
														value={hypothesis.id}
														checked={selectedHypothesis === hypothesis.id}
														onChange={(e) =>
															setSelectedHypothesis(e.target.value)
														}
													/>
													<label
														className="form-check-label w-100"
														htmlFor={`hypothesis-${hypothesis.id}`}
														style={{ cursor: "pointer" }}
													>
														<div className="d-flex align-items-start">
															<div className="me-3">
																<i
																	className={`bi ${getHypothesisIcon(
																		hypothesis.code
																	)} text-${getHypothesisColor(
																		hypothesis.code
																	)}`}
																	style={{ fontSize: "2rem" }}
																></i>
															</div>
															<div className="flex-grow-1">
																<h5
																	className={`text-${getHypothesisColor(
																		hypothesis.code
																	)} mb-2`}
																>
																	{hypothesis.code} - {hypothesis.name}
																</h5>
																<p className="mb-2">{hypothesis.description}</p>
																<div className="row">
																	<div className="col-md-6">
																		<small className="text-muted">
																			<strong>Threshold CF:</strong>
																			{(
																				hypothesis.cfThresholdMin * 100
																			).toFixed(0)}
																			% -
																			{(
																				hypothesis.cfThresholdMax * 100
																			).toFixed(0)}
																			%
																		</small>
																	</div>
																	<div className="col-md-6">
																		<div
																			className="progress"
																			style={{ height: "10px" }}
																		>
																			<div
																				className={`progress-bar bg-${getHypothesisColor(
																					hypothesis.code
																				)}`}
																				role="progressbar"
																				style={{
																					width: `${
																						hypothesis.cfThresholdMax * 100
																					}%`,
																				}}
																				aria-valuenow={
																					hypothesis.cfThresholdMax * 100
																				}
																				aria-valuemin="0"
																				aria-valuemax="100"
																			></div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</label>
												</div>
											</div>
										</div>
									))}
								</div>

								<div className="card bg-light">
									<div className="card-body">
										<h6>
											<i className="bi bi-lightbulb me-2"></i>
											Panduan Memilih Hipotesis:
										</h6>
										<ul className="mb-0">
											<li>
												<strong>Kecanduan Ringan (P1):</strong> Jika Anda merasa
												gaming belum terlalu mengganggu aktivitas sehari-hari
											</li>
											<li>
												<strong>Kecanduan Sedang (P2):</strong> Jika Anda merasa
												gaming sudah mulai mempengaruhi rutinitas dan hubungan
												sosial
											</li>
											<li>
												<strong>Kecanduan Berat (P3):</strong> Jika Anda merasa
												gaming sudah sangat mengganggu akademik, kesehatan, dan
												hubungan
											</li>
										</ul>
									</div>
								</div>

								<div className="text-center mt-4">
									<button
										type="submit"
										className="btn btn-primary btn-lg px-5"
										disabled={!selectedHypothesis}
									>
										<i className="bi bi-arrow-right me-2"></i>
										Lanjutkan ke Kuesioner
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Hypothesis;
