import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<div className="home-page">
			<div className="text-center mb-5">
				<h1 className="display-4 fw-bold">
					<span className="text-primary">HERO</span>in
				</h1>
				<p className="lead">
					Sistem Pakar Identifikasi Dampak Negatif Kecanduan Game Online di
					Kalangan Mahasiswa
				</p>
			</div>

			<div className="row mb-5">
				<div className="col-md-6">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h2 className="card-title h4">Apa itu HEROin?</h2>
							<p className="card-text">
								HEROin adalah sistem pakar yang dirancang untuk membantu
								mengidentifikasi dampak negatif kecanduan game online pada
								mahasiswa. Menggunakan metode backward chaining dan certainty
								factor, sistem ini memberikan analisis komprehensif terhadap
								tingkat kecanduan game dan dampaknya.
							</p>
						</div>
					</div>
				</div>

				<div className="col-md-6">
					<div className="card shadow-sm h-100">
						<div className="card-body">
							<h2 className="card-title h4">Mengapa Penting?</h2>
							<p className="card-text">
								Kecanduan game online dapat berdampak serius pada prestasi
								akademik, kesehatan mental, dan kehidupan sosial mahasiswa.
								Identifikasi dini dapat membantu mencegah dampak jangka panjang
								dan memberikan intervensi yang tepat.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="row mb-5">
				<div className="col-md-4">
					<div className="card shadow-sm h-100">
						<div className="card-body text-center">
							<i className="bi bi-search fs-1 text-primary mb-3"></i>
							<h3 className="card-title h5">Identifikasi</h3>
							<p className="card-text">
								Sistem akan mengidentifikasi tingkat kecanduan game online
								berdasarkan jawaban atas pertanyaan yang diajukan.
							</p>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-sm h-100">
						<div className="card-body text-center">
							<i className="bi bi-graph-up fs-1 text-primary mb-3"></i>
							<h3 className="card-title h5">Analisis</h3>
							<p className="card-text">
								Menggunakan metode backward chaining dan certainty factor untuk
								analisis tingkat kecanduan dan dampaknya.
							</p>
						</div>
					</div>
				</div>

				<div className="col-md-4">
					<div className="card shadow-sm h-100">
						<div className="card-body text-center">
							<i className="bi bi-clipboard-data fs-1 text-primary mb-3"></i>
							<h3 className="card-title h5">Laporan</h3>
							<p className="card-text">
								Hasil analisis dapat diunduh dalam format Excel atau PDF untuk
								keperluan dokumentasi dan tindak lanjut.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="text-center">
				<Link to="/user-info" className="btn btn-primary btn-lg">
					Mulai Sekarang
				</Link>
			</div>
		</div>
	);
}

export default Home;
