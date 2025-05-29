import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Result() {
	const navigate = useNavigate();
	const location = useLocation();
	const [result, setResult] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Cek apakah ada parameter id di URL
		const params = new URLSearchParams(location.search);
		const idFromUrl = params.get("id");

		// Prioritaskan ID dari URL, jika tidak ada gunakan dari sessionStorage
		const resultId = idFromUrl || sessionStorage.getItem("resultId");

		console.log("Using result ID:", resultId); // Debug log

		if (!resultId) {
			setError("ID hasil tidak ditemukan");
			setLoading(false);
			return;
		}

		// Ambil hasil dari backend
		const fetchResult = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/result/${resultId}`
				);
				console.log("Result data received:", response.data); // Debug log
				setResult(response.data);
				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil hasil analisis");
				setLoading(false);
				console.error("Error fetching result:", err);
			}
		};

		fetchResult();
	}, [location.search]);

	const handleDownload = async (format) => {
		if (!result) return;

		try {
			const response = await axios.get(
				`http://localhost:5000/api/download-report/${result.id}?format=${format}`,
				{
					responseType: "blob",
				}
			);

			// Buat URL untuk file yang diunduh
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`hasil-analisis-${format === "excel" ? "excel.xlsx" : "pdf.pdf"}`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			setError(`Gagal mengunduh laporan dalam format ${format}`);
			console.error(err);
		}
	};

	const getCFLevelInfo = (cfPercentage) => {
		if (cfPercentage >= 81) {
			return {
				level: "Sangat Tinggi",
				color: "danger",
				icon: "exclamation-triangle-fill",
			};
		} else if (cfPercentage >= 61) {
			return {
				level: "Tinggi",
				color: "warning",
				icon: "exclamation-triangle",
			};
		} else if (cfPercentage >= 40) {
			return { level: "Sedang", color: "info", icon: "info-circle" };
		} else if (cfPercentage >= 20) {
			return { level: "Rendah", color: "success", icon: "check-circle" };
		} else {
			return {
				level: "Sangat Rendah",
				color: "success",
				icon: "check-circle-fill",
			};
		}
	};

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-3">Memuat hasil analisis...</p>
			</div>
		);
	}

	if (error && !result) {
		return (
			<div className="result-page">
				<div className="alert alert-danger mb-4">{error}</div>
				<div className="text-center">
					<button
						className="btn btn-primary"
						onClick={() => navigate("/questionnaire")}
					>
						Kembali ke Kuesioner
					</button>
				</div>
			</div>
		);
	}

	const cfLevelInfo = result ? getCFLevelInfo(result.cfPercentage) : null;

	return (
		<div className="result-page">
			<h2 className="mb-4 text-center">Hasil Analisis Kecanduan Game Online</h2>
			<div className="row justify-content-center">
				<div className="col-lg-10">
					{error && <div className="alert alert-danger">{error}</div>}

					{/* Informasi Pengguna */}
					<div className="card shadow mb-4">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">
								<i className="bi bi-person-fill me-2"></i>
								Informasi Pengguna
							</h3>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-6">
									<p>
										<strong>Nama:</strong> {result?.userInfo.nama}
									</p>
									<p>
										<strong>Usia:</strong> {result?.userInfo.usia} tahun
									</p>
									<p>
										<strong>Jenis Kelamin:</strong>{" "}
										{result?.userInfo.jenisKelamin}
									</p>
								</div>
								<div className="col-md-6">
									<p>
										<strong>Program Studi:</strong>{" "}
										{result?.userInfo.programStudi}
									</p>
									<p>
										<strong>Angkatan:</strong> {result?.userInfo.angkatan}
									</p>
									<p>
										<strong>Domisili:</strong> {result?.userInfo.domisili}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Hasil Analisis Utama */}
					<div className="card shadow mb-4">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">
								<i className="bi bi-graph-up me-2"></i>
								Hasil Analisis dengan Metode Backward Chaining & Certainty
								Factor
							</h3>
						</div>
						<div className="card-body">
							<div className="row mb-4">
								<div className="col-md-6">
									<div className="text-center p-4 bg-light rounded">
										<div className="display-4 fw-bold text-primary mb-2">
											{result?.cfPercentage.toFixed(2)}%
										</div>
										<p className="text-muted mb-2">Tingkat Keyakinan (CF)</p>
										<div className={`badge bg-${cfLevelInfo?.color} fs-6`}>
											<i className={`bi bi-${cfLevelInfo?.icon} me-1`}></i>
											{cfLevelInfo?.level}
										</div>
									</div>
								</div>
								<div className="col-md-6">
									<div className="p-4">
										<h5>Interpretasi Nilai CF:</h5>
										<div className="progress mb-3" style={{ height: "25px" }}>
											<div
												className={`progress-bar bg-${cfLevelInfo?.color}`}
												role="progressbar"
												style={{ width: `${result?.cfPercentage}%` }}
												aria-valuenow={result?.cfPercentage}
												aria-valuemin="0"
												aria-valuemax="100"
											>
												{result?.cfPercentage.toFixed(1)}%
											</div>
										</div>
										<small className="text-muted">
											<strong>Rumus yang digunakan:</strong>
											<br />
											CF<sub>kombinasi</sub> = CF<sub>expert</sub> × CF
											<sub>user</sub>
											<br />
											Kemudian digabungkan menggunakan formula kombinasi CF
										</small>
									</div>
								</div>
							</div>

							<div className={`alert alert-${cfLevelInfo?.color}`}>
								<h4 className="alert-heading">
									<i className={`bi bi-${cfLevelInfo?.icon} me-2`}></i>
									Diagnosis:
								</h4>
								<p className="mb-0 fs-5">{result?.diagnosis}</p>
							</div>

							<div className="card border-info">
								<div className="card-header bg-info text-white">
									<h5 className="mb-0">
										<i className="bi bi-lightbulb me-2"></i>
										Rekomendasi
									</h5>
								</div>
								<div className="card-body">
									<p className="mb-0">{result?.recommendation}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Detail Gejala yang Teridentifikasi */}
					<div className="card shadow mb-4">
						<div className="card-header bg-secondary text-white">
							<h3 className="h5 mb-0">
								<i className="bi bi-list-check me-2"></i>
								Detail Gejala yang Teridentifikasi
							</h3>
						</div>
						<div className="card-body">
							<div className="table-responsive">
								<table className="table table-striped table-hover">
									<thead className="table-dark">
										<tr>
											<th style={{ width: "5%" }}>No</th>
											<th style={{ width: "10%" }}>Kode</th>
											<th style={{ width: "45%" }}>Gejala</th>
											<th style={{ width: "12%" }}>CF Expert</th>
											<th style={{ width: "12%" }}>CF User</th>
											<th style={{ width: "16%" }}>CF Kombinasi</th>
										</tr>
									</thead>
									<tbody>
										{result?.identifiedSymptoms.map((symptom, index) => (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>
													<span className="badge bg-info">
														{symptom.symptomCode}
													</span>
												</td>
												<td>{symptom.symptomText}</td>
												<td>
													<span className="badge bg-success">
														{(symptom.cfExpert * 100).toFixed(0)}%
													</span>
												</td>
												<td>
													<span className="badge bg-warning">
														{(symptom.cfUser * 100).toFixed(0)}%
													</span>
												</td>
												<td>
													<span className="badge bg-primary">
														{(symptom.cfCombined * 100).toFixed(2)}%
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="mt-3">
								<small className="text-muted">
									<strong>Keterangan:</strong>
									<br />• <strong>CF Expert:</strong> Tingkat keyakinan pakar
									terhadap gejala
									<br />• <strong>CF User:</strong> Tingkat keyakinan pengguna
									terhadap gejala
									<br />• <strong>CF Kombinasi:</strong> Hasil perkalian CF
									Expert × CF User
								</small>
							</div>
						</div>
					</div>

					{/* Metodologi */}
					<div className="card shadow mb-4">
						<div className="card-header bg-success text-white">
							<h3 className="h5 mb-0">
								<i className="bi bi-gear me-2"></i>
								Metodologi yang Digunakan
							</h3>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-6">
									<h5>
										<i className="bi bi-arrow-left-right me-2"></i>
										Backward Chaining
									</h5>
									<p>
										Sistem dimulai dari hipotesis yang dipilih, kemudian mencari
										gejala-gejala yang relevan untuk memvalidasi hipotesis
										tersebut.
									</p>
								</div>
								<div className="col-md-6">
									<h5>
										<i className="bi bi-calculator me-2"></i>
										Certainty Factor
									</h5>
									<p>
										Menggunakan nilai kepastian untuk mengukur tingkat keyakinan
										dengan formula kombinasi CF untuk hasil yang akurat.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Download dan Navigasi */}
					<div className="text-center mb-5">
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">Unduh Laporan Lengkap</h5>
								<p className="card-text">
									Dapatkan laporan lengkap hasil analisis dalam format yang Anda
									inginkan:
								</p>
								<button
									className="btn btn-success me-3"
									onClick={() => handleDownload("excel")}
								>
									<i className="bi bi-file-earmark-excel me-2"></i>
									Unduh Excel
								</button>
								<button
									className="btn btn-danger"
									onClick={() => handleDownload("pdf")}
								>
									<i className="bi bi-file-earmark-pdf me-2"></i>
									Unduh PDF
								</button>
							</div>
						</div>
					</div>

					<div className="text-center">
						<button
							className="btn btn-primary btn-lg me-3"
							onClick={() => navigate("/")}
						>
							<i className="bi bi-house me-2"></i>
							Kembali ke Beranda
						</button>
						<button
							className="btn btn-outline-secondary btn-lg"
							onClick={() => navigate("/dashboard")}
						>
							<i className="bi bi-graph-up me-2"></i>
							Lihat Dashboard
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Result;
