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

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	// Data untuk chart tingkat kecanduan
	const addictionLevelData = {
		labels: ["Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"],
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
					"rgba(75, 192, 192, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(255, 206, 86, 0.6)",
					"rgba(255, 159, 64, 0.6)",
					"rgba(255, 99, 132, 0.6)",
				],
				borderColor: [
					"rgba(75, 192, 192, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(255, 99, 132, 1)",
				],
				borderWidth: 1,
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
				backgroundColor: "rgba(54, 162, 235, 0.6)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
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
				backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
				borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
				borderWidth: 1,
			},
		],
	};

	return (
		<div className="dashboard-page">
			<h2 className="mb-4 text-center">Dashboard Analisis</h2>

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

			<div className="row mb-4">
				<div className="col-md-4">
					<div className="card shadow h-100">
						<div className="card-body text-center">
							<h3 className="card-title h5">Total Responden</h3>
							<p className="display-4 fw-bold text-primary">
								{statistics?.totalRespondents || 0}
							</p>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow h-100">
						<div className="card-body text-center">
							<h3 className="card-title h5">Rata-rata Tingkat Kecanduan</h3>
							<p className="display-4 fw-bold text-primary">
								{statistics?.averageAddictionLevel?.toFixed(2) || 0}%
							</p>
						</div>
					</div>
				</div>
				<div className="col-md-4">
					<div className="card shadow h-100">
						<div className="card-body text-center">
							<h3 className="card-title h5">Kasus Kecanduan Tinggi</h3>
							<p className="display-4 fw-bold text-primary">
								{statistics?.highAddictionCases || 0}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="row mb-4">
				<div className="col-md-6">
					<div className="card shadow">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">Tingkat Kecanduan Game Online</h3>
						</div>
						<div className="card-body">
							<Pie data={addictionLevelData} />
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card shadow">
						<div className="card-header bg-primary text-white">
							<h3 className="h5 mb-0">Berdasarkan Jenis Kelamin</h3>
						</div>
						<div className="card-body">
							<Pie data={byGenderData} />
						</div>
					</div>
				</div>
			</div>

			<div className="card shadow mb-4">
				<div className="card-header bg-primary text-white">
					<h3 className="h5 mb-0">Responden Berdasarkan Program Studi</h3>
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
						}}
					/>
				</div>
			</div>

			<div className="card shadow mb-4">
				<div className="card-header bg-primary text-white">
					<h3 className="h5 mb-0">Tabel Data Responden</h3>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<table className="table table-striped table-hover">
							<thead>
								<tr>
									<th>No</th>
									<th>Nama</th>
									<th>Program Studi</th>
									<th>Angkatan</th>
									<th>Jenis Kelamin</th>
									<th>Tingkat Kecanduan</th>
									<th>Aksi</th>
								</tr>
							</thead>
							<tbody>
								{statistics?.respondents.map((respondent, index) => (
									<tr key={respondent.id}>
										<td>{index + 1}</td>
										<td>{respondent.nama}</td>
										<td>{respondent.programStudi}</td>
										<td>{respondent.angkatan}</td>
										<td>{respondent.jenisKelamin}</td>
										<td>
											<div className="progress">
												<div
													className={`progress-bar ${
														respondent.cfValue < 0.4
															? "bg-success"
															: respondent.cfValue < 0.7
															? "bg-warning"
															: "bg-danger"
													}`}
													role="progressbar"
													style={{ width: `${respondent.cfValue * 100}%` }}
													aria-valuenow={respondent.cfValue * 100}
													aria-valuemin="0"
													aria-valuemax="100"
												>
													{(respondent.cfValue * 100).toFixed(1)}%
												</div>
											</div>
										</td>
										<td>
											<div className="btn-group">
												<a
													href={`/result?id=${respondent.resultId}`}
													className="btn btn-sm btn-primary"
													target="_blank"
													rel="noopener noreferrer"
												>
													Detail
												</a>
												<button
													className="btn btn-sm btn-danger"
													onClick={() => handleDelete(respondent)}
												>
													Hapus
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className="card shadow mb-4">
				<div className="card-header bg-primary text-white">
					<h3 className="h5 mb-0">Laporan Keseluruhan</h3>
				</div>
				<div className="card-body">
					<div className="row align-items-center">
						<div className="col-md-6">
							<p>Unduh semua data dalam format:</p>
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
									Excel
								</button>
								<button
									type="button"
									className={`btn ${
										reportFormat === "pdf" ? "btn-danger" : "btn-outline-danger"
									}`}
									onClick={() => setReportFormat("pdf")}
								>
									PDF
								</button>
							</div>
						</div>
						<div className="col-md-6 text-md-end mt-3 mt-md-0">
							<button
								className="btn btn-primary"
								onClick={handleDownloadAllReport}
							>
								<i className="bi bi-download me-1"></i> Unduh Laporan
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
