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

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
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

	return (
		<div className="result-page">
			<h2 className="mb-4 text-center">Hasil Analisis</h2>
			<div className="row justify-content-center">
				<div className="col-lg-10">
					{error && <div className="alert alert-danger">{error}</div>}

					<div className="card shadow mb-4">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">Informasi Pengguna</h3>
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

					<div className="card shadow mb-4">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">Hasil Analisis Kecanduan Game Online</h3>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-center mb-4">
								<div className="text-center">
									<div className="display-4 fw-bold text-primary">
										{(result?.cfValue * 100).toFixed(2)}%
									</div>
									<p className="text-muted">
										Tingkat Keyakinan (Certainty Factor)
									</p>
								</div>
							</div>

							<div className="alert alert-primary">
								<h4 className="alert-heading">Diagnosis:</h4>
								<p className="mb-0">{result?.diagnosis}</p>
							</div>

							<div className="mb-4">
								<h4>Gejala yang Teridentifikasi:</h4>
								<ul className="list-group">
									{result?.identifiedSymptoms.map((symptom, index) => (
										<li className="list-group-item" key={index}>
											{symptom.symptomText}
											<span className="badge bg-primary float-end">
												CF: {(symptom.cfValue * 100).toFixed(2)}%
											</span>
										</li>
									))}
								</ul>
							</div>

							<div className="mb-4">
								<h4>Rekomendasi:</h4>
								<div className="card">
									<div className="card-body">
										<p className="mb-0">{result?.recommendation}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="text-center mb-5">
						<p className="mb-3">Unduh laporan dalam format:</p>
						<button
							className="btn btn-success me-2"
							onClick={() => handleDownload("excel")}
						>
							<i className="bi bi-file-earmark-excel me-2"></i>
							Excel
						</button>
						<button
							className="btn btn-danger"
							onClick={() => handleDownload("pdf")}
						>
							<i className="bi bi-file-earmark-pdf me-2"></i>
							PDF
						</button>
					</div>

					<div className="text-center">
						<button
							className="btn btn-primary me-2"
							onClick={() => navigate("/")}
						>
							Kembali ke Beranda
						</button>
						<button
							className="btn btn-secondary"
							onClick={() => navigate("/dashboard")}
						>
							Lihat Dashboard
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Result;
