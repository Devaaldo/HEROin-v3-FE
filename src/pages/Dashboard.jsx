import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
	Chart as ChartJS,
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Registrasi komponen Chart.js yang diperlukan
ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

function Dashboard() {
	const [statistics, setStatistics] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [reportFormat, setReportFormat] = useState("excel");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [selectedRespondent, setSelectedRespondent] = useState(null);
	const [deleteSuccess, setDeleteSuccess] = useState("");

	// Fungsi untuk mengambil data statistik
	const fetchStatistics = async () => {
		try {
			setLoading(true);
			const response = await axios.get("http://localhost:5000/api/statistics");
			setStatistics(response.data);
			setLoading(false);
		} catch (err) {
			setError("Gagal mengambil data statistik");
			setLoading(false);
			console.error("Error fetching statistics:", err);
		}
	};

	useEffect(() => {
		fetchStatistics();
	}, []);

	// Tangani hapus data
	const handleDelete = async (respondent) => {
		setSelectedRespondent(respondent);
		setShowDeleteConfirm(true);
	};

	// Konfirmasi hapus
	const confirmDelete = async () => {
		try {
			await axios.delete(
				`http://localhost:5000/api/result/${selectedRespondent.resultId}`
			);
			setShowDeleteConfirm(false);
			setDeleteSuccess(`Data ${selectedRespondent.nama} berhasil dihapus`);

			// Refresh data setelah penghapusan
			fetchStatistics();

			// Hapus pesan sukses setelah 3 detik
			setTimeout(() => {
				setDeleteSuccess("");
			}, 3000);
		} catch (err) {
			setError(`Gagal menghapus data: ${err.message}`);
			setShowDeleteConfirm(false);
		}
	};

	// Batal hapus
	const cancelDelete = () => {
		setShowDeleteConfirm(false);
		setSelectedRespondent(null);
	};

	// Download semua laporan
	const handleDownloadAllReport = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/download-all-reports?format=${reportFormat}`,
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
				`semua-hasil-analisis.${reportFormat === "excel" ? "xlsx" : "pdf"}`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			setError(`Gagal mengunduh laporan dalam format ${reportFormat}`);
			console.error(err);
		}
	};

	// Fungsi untuk mendapatkan level kecanduan berdasarkan CF
	const getAddictionLevel = (cfPercentage) => {
		if (cfPercentage >= 81) return "Sangat Tinggi";
		if (cfPercentage >= 61) return "Tinggi";
		if (cfPercentage >= 40) return "Sedang";
		if (cfPercentage >= 20) return "Rendah";
		return "Sangat Rendah";
	};

	// Fungsi untuk mendapatkan warna berdasarkan level CF
	const getCFColor = (cfPercentage) => {
		if (cfPercentage >= 81) return "danger";
		if (cfPercentage >= 61) return "warning";
		if (cfPercentage >= 40) return "info";
		if (cfPercentage >= 20) return "success";
		return "success";
	};

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-3">Memuat data dashboard...</p>
			</div>
		);
	}

	// Data untuk chart tingkat kecanduan (berdasarkan CF percentage)
	const addictionLevelData = {
		labels: [
			"Sangat Rendah (<20%)",
			"Rendah (20-39%)",
			"Sedang (40-60%)",
			"Tinggi (61-80%)",
			"Sangat Tinggi (≥81%)",
		],
		datasets: [
			{
				label: "Jumlah Mahasiswa",
				data: [
					statistics?.addictionLevels.veryLow || 0,
					statistics?.addictionLevels.low || 0,
					statistics?.addictionLevels.medium || 0,
					statistics?.addictionLevels.high || 0,
					statistics?.addictionLevels.veryHigh || 0,
				],
				backgroundColor: [
					"rgba(40, 167, 69, 0.8)", // Success - Sangat Rendah
					"rgba(40, 167, 69, 0.6)", // Success - Rendah
					"rgba(23, 162, 184, 0.8)", // Info - Sedang
					"rgba(255, 193, 7, 0.8)", // Warning - Tinggi
					"rgba(220, 53, 69, 0.8)", // Danger - Sangat Tinggi
				],
				borderColor: [
					"rgba(40, 167, 69, 1)",
					"rgba(40, 167, 69, 1)",
					"rgba(23, 162, 184, 1)",
					"rgba(255, 193, 7, 1)",
					"rgba(220, 53, 69, 1)",
				],
				borderWidth: 2,
			},
		],
	};

	// Data untuk chart berdasarkan prodi
	const programStudiData = {
		labels: statistics?.byProgramStudi.map((item) => item.programStudi) || [],
		datasets: [
			{
				label: "Jumlah Mahasiswa",
				data: statistics?.byProgramStudi.map((item) => item.count) || [],
				backgroundColor: "rgba(150, 48, 251, 0.8)",
				borderColor: "rgba(150, 48, 251, 1)",
				borderWidth: 2,
			},
		],
	};

	const byGenderData = {
		labels: ["Laki-laki", "Perempuan"],
		datasets: [
			{
				label: "Jumlah Berdasarkan Jenis Kelamin",
				data: [
					statistics?.byGender.male || 0,
					statistics?.byGender.female || 0,
				],
				backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
				borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
				borderWidth: 2,
			},
		],
	};

	return (
		<div className="dashboard-page">
			<h2 className="mb-4 text-center">
				Dashboard Analisis Kecanduan Game Online
			</h2>
			<p className="text-center text-muted mb-4">
				Sistem Pakar menggunakan Backward Chaining & Certainty Factor
			</p>

			{error && <div className="alert alert-danger">{error}</div>}
			{deleteSuccess && (
				<div className="alert alert-success">{deleteSuccess}</div>
			)}

			{/* Modal konfirmasi hapus */}
			{showDeleteConfirm && (
				<div
					className="modal fade show"
					style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Konfirmasi Hapus</h5>
								<button
									type="button"
									className="btn-close"
									onClick={cancelDelete}
								></button>
							</div>
							<div className="modal-body">
								<p>
									Anda yakin ingin menghapus data{" "}
									<strong>{selectedRespondent?.nama}</strong>?
								</p>
								<p className="text-danger">
									Tindakan ini tidak dapat dibatalkan!
								</p>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={cancelDelete}
								>
									Batal
								</button>
								<button
									type="button"
									className="btn btn-danger"
									onClick={confirmDelete}
								>
									Hapus
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Statistik Utama */}
			<div className="row mb-4">
				<div className="col-md-3">
					<div className="card shadow h-100 border-primary">
						<div className="card-body text-center">
							<i
								className="bi bi-people-fill text-primary mb-2"
								style={{ fontSize: "2rem" }}
							></i>
							<h3 className="card-title h6">Total Responden</h3>
							<p className="display-6 fw-bold text-primary">
								{statistics?.totalRespondents || 0}
							</p>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card shadow h-100 border-info">
						<div className="card-body text-center">
							<i
								className="bi bi-calculator text-info mb-2"
								style={{ fontSize: "2rem" }}
							></i>
							<h3 className="card-title h6">Rata-rata CF (%)</h3>
							<p className="display-6 fw-bold text-info">
								{statistics?.averageAddictionLevel?.toFixed(1) || 0}%
							</p>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card shadow h-100 border-warning">
						<div className="card-body text-center">
							<i
								className="bi bi-exclamation-triangle text-warning mb-2"
								style={{ fontSize: "2rem" }}
							></i>
							<h3 className="card-title h6">Kecanduan Tinggi</h3>
							<p className="display-6 fw-bold text-warning">
								{statistics?.highAddictionCases || 0}
							</p>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card shadow h-100 border-success">
						<div className="card-body text-center">
							<i
								className="bi bi-graph-up text-success mb-2"
								style={{ fontSize: "2rem" }}
							></i>
							<h3 className="card-title h6">Analisis Selesai</h3>
							<p className="display-6 fw-bold text-success">
								{statistics?.respondents?.length || 0}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="row mb-4">
				<div className="col-md-6">
					<div className="card shadow">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">
								<i className="bi bi-pie-chart me-2"></i>
								Distribusi Tingkat Kecanduan (Berdasarkan CF)
							</h3>
						</div>
						<div className="card-body">
							<Pie
								data={addictionLevelData}
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "bottom",
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													return (
														context.label + ": " + context.parsed + " orang"
													);
												},
											},
										},
									},
								}}
							/>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card shadow">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">
								<i className="bi bi-gender-ambiguous me-2"></i>
								Distribusi Berdasarkan Jenis Kelamin
							</h3>
						</div>
						<div className="card-body">
							<Pie
								data={byGenderData}
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "bottom",
										},
										tooltip: {
											callbacks: {
												label: function (context) {
													return (
														context.label + ": " + context.parsed + " orang"
													);
												},
											},
										},
									},
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="card shadow mb-4">
				<div className="card-header bg-primary text-white">
					<h3 className="h5 mb-0">
						<i className="bi bi-bar-chart me-2"></i>
						Responden Berdasarkan Program Studi
					</h3>
				</div>
				<div className="card-body">
					<Bar
						data={programStudiData}
						options={{
							responsive: true,
							plugins: {
								legend: {
									position: "top",
								},
								title: {
									display: false,
								},
							},
							scales: {
								y: {
									beginAtZero: true,
									ticks: {
										stepSize: 1,
									},
								},
							},
						}}
					/>
				</div>
			</div>

			{/* Tabel Data Responden */}
			<div className="card shadow mb-4">
				<div className="card-header bg-primary text-white">
					<h3 className="h5 mb-0">
						<i className="bi bi-table me-2"></i>
						Data Responden & Hasil Analisis CF
					</h3>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-striped table-hover">
							<thead className="table-dark">
								<tr>
									<th style={{ width: "5%" }}>No</th>
									<th style={{ width: "20%" }}>Nama</th>
									<th style={{ width: "20%" }}>Program Studi</th>
									<th style={{ width: "10%" }}>Angkatan</th>
									<th style={{ width: "10%" }}>Gender</th>
									<th style={{ width: "15%" }}>CF Value</th>
									<th style={{ width: "10%" }}>Level</th>
									<th style={{ width: "10%" }}>Aksi</th>
								</tr>
							</thead>
							<tbody>
								{statistics?.respondents?.map((respondent, index) => {
									const cfPercentage =
										respondent.cfPercentage || respondent.cfValue * 100;
									const level = getAddictionLevel(cfPercentage);
									const colorClass = getCFColor(cfPercentage);

									return (
										<tr key={respondent.id}>
											<td>{index + 1}</td>
											<td>
												<strong>{respondent.nama}</strong>
											</td>
											<td>{respondent.programStudi}</td>
											<td>
												<span className="badge bg-secondary">
													{respondent.angkatan}
												</span>
											</td>
											<td>
												<span
													className={`badge ${
														respondent.jenisKelamin === "Laki-laki"
															? "bg-primary"
															: "bg-info"
													}`}
												>
													{respondent.jenisKelamin}
												</span>
											</td>
											<td>
												<div className="d-flex align-items-center">
													<div
														className="progress flex-grow-1 me-2"
														style={{ height: "20px" }}
													>
														<div
															className={`progress-bar bg-${colorClass}`}
															role="progressbar"
															style={{ width: `${cfPercentage}%` }}
															aria-valuenow={cfPercentage}
															aria-valuemin="0"
															aria-valuemax="100"
														>
															{cfPercentage.toFixed(1)}%
														</div>
													</div>
												</div>
											</td>
											<td>
												<span className={`badge bg-${colorClass}`}>
													{level}
												</span>
											</td>
											<td>
												<div className="btn-group btn-group-sm">
													<a
														href={`/result?id=${respondent.resultId}`}
														className="btn btn-outline-primary btn-sm"
														target="_blank"
														rel="noopener noreferrer"
														title="Lihat Detail"
													>
														<i className="bi bi-eye"></i>
													</a>
													<button
														className="btn btn-outline-danger btn-sm"
														onClick={() => handleDelete(respondent)}
														title="Hapus Data"
													>
														<i className="bi bi-trash"></i>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>

						{statistics?.respondents?.length === 0 && (
							<div className="text-center py-4">
								<i
									className="bi bi-inbox text-muted"
									style={{ fontSize: "3rem" }}
								></i>
								<p className="text-muted mt-2">Belum ada data responden</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Metodologi & Info */}
			<div className="row mb-4">
				<div className="col-md-6">
					<div className="card shadow h-100">
						<div className="card-header bg-success text-white">
							<h5 className="mb-0">
								<i className="bi bi-gear me-2"></i>
								Metodologi Sistem
							</h5>
						</div>
						<div className="card-body">
							<h6>
								<i className="bi bi-arrow-left-right me-2"></i>
								Backward Chaining
							</h6>
							<p className="small">
								Sistem dimulai dari hipotesis yang dipilih pengguna, kemudian
								menentukan gejala-gejala yang perlu divalidasi untuk membuktikan
								hipotesis tersebut.
							</p>

							<h6>
								<i className="bi bi-calculator me-2"></i>
								Certainty Factor
							</h6>
							<p className="small mb-0">
								Menggunakan formula: <code>CF = CF_expert × CF_user</code>
								<br />
								Kemudian digabungkan menggunakan formula kombinasi CF untuk
								hasil akhir.
							</p>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card shadow h-100">
						<div className="card-header bg-info text-white">
							<h5 className="mb-0">
								<i className="bi bi-info-circle me-2"></i>
								Interpretasi Tingkat CF
							</h5>
						</div>
						<div className="card-body">
							<ul className="list-unstyled mb-0">
								<li className="mb-2">
									<span className="badge bg-success me-2">0-19%</span>
									<strong>Sangat Rendah:</strong> Tidak terdeteksi kecanduan
								</li>
								<li className="mb-2">
									<span className="badge bg-success me-2">20-39%</span>
									<strong>Rendah:</strong> Indikasi kecanduan minimal
								</li>
								<li className="mb-2">
									<span className="badge bg-info me-2">40-60%</span>
									<strong>Sedang:</strong> Kecanduan tingkat menengah
								</li>
								<li className="mb-2">
									<span className="badge bg-warning me-2">61-80%</span>
									<strong>Tinggi:</strong> Kecanduan signifikan
								</li>
								<li>
									<span className="badge bg-danger me-2">81-100%</span>
									<strong>Sangat Tinggi:</strong> Kecanduan berat
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Download Reports */}
			<div className="card shadow mb-4">
				<div className="card-header bg-primary text-white">
					<h3 className="h5 mb-0">
						<i className="bi bi-download me-2"></i>
						Laporan Keseluruhan
					</h3>
				</div>
				<div className="card-body">
					<div className="row align-items-center">
						<div className="col-md-6">
							<p className="mb-3">
								<i className="bi bi-file-earmark-text me-2"></i>
								Unduh semua data hasil analisis dalam format:
							</p>
							<div className="btn-group" role="group">
								<button
									type="button"
									className={`btn ${
										reportFormat === "excel"
											? "btn-success"
											: "btn-outline-success"
									}`}
									onClick={() => setReportFormat("excel")}
								>
									<i className="bi bi-file-earmark-excel me-1"></i>
									Excel
								</button>
								<button
									type="button"
									className={`btn ${
										reportFormat === "pdf" ? "btn-danger" : "btn-outline-danger"
									}`}
									onClick={() => setReportFormat("pdf")}
								>
									<i className="bi bi-file-earmark-pdf me-1"></i>
									PDF
								</button>
							</div>
						</div>
						<div className="col-md-6 text-md-end mt-3 mt-md-0">
							<button
								className="btn btn-primary btn-lg"
								onClick={handleDownloadAllReport}
								disabled={!statistics?.totalRespondents}
							>
								<i className="bi bi-download me-2"></i>
								Unduh Laporan Lengkap
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
