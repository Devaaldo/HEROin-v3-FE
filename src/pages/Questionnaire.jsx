import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Questionnaire() {
	const navigate = useNavigate();
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Periksa apakah user info dan hipotesis sudah diisi
		const userInfo = sessionStorage.getItem("userInfo");
		const selectedHypothesis = sessionStorage.getItem("selectedHypothesis");

		if (!userInfo) {
			navigate("/user-info");
			return;
		}

		if (!selectedHypothesis) {
			navigate("/hypothesis");
			return;
		}

		// Ambil pertanyaan berdasarkan hipotesis dari backend (backward chaining)
		const fetchQuestions = async () => {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/questions/${selectedHypothesis}`
				);
				setQuestions(response.data);

				// Inisialisasi object answers dengan id pertanyaan sebagai key
				const initialAnswers = {};
				response.data.forEach((question) => {
					initialAnswers[question.id] = "";
				});
				setAnswers(initialAnswers);

				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data pertanyaan");
				setLoading(false);
				console.error(err);
			}
		};

		fetchQuestions();
	}, [navigate]);

	const handleAnswerChange = (questionId, value) => {
		setAnswers((prevAnswers) => ({
			...prevAnswers,
			[questionId]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validasi semua pertanyaan sudah dijawab
		const unansweredQuestions = Object.values(answers).filter(
			(answer) => answer === ""
		);
		if (unansweredQuestions.length > 0) {
			setError("Silakan jawab semua pertanyaan");
			return;
		}

		try {
			// Siapkan data untuk dikirim ke backend
			const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
			const selectedHypothesis = sessionStorage.getItem("selectedHypothesis");

			const submissionData = {
				userId: userInfo.nama,
				hypothesisId: selectedHypothesis,
				answers: Object.entries(answers).map(([questionId, value]) => ({
					questionId,
					value: parseFloat(value), // Pastikan value adalah number
				})),
			};

			// Kirim data ke backend
			const response = await axios.post(
				"http://localhost:5000/api/submit-questionnaire",
				submissionData
			);

			// Simpan ID hasil untuk digunakan di halaman hasil
			sessionStorage.setItem("resultId", response.data.resultId);

			// Navigasi ke halaman hasil
			navigate("/result");
		} catch (err) {
			setError("Terjadi kesalahan saat mengirim jawaban");
			console.error(err);
		}
	};

	// Skala Nilai sesuai dengan penelitian
	const cfValues = [
		{
			value: 1.0,
			text: "Sangat yakin",
			description: "Saya sangat yakin hal ini terjadi pada saya",
		},
		{
			value: 0.8,
			text: "Yakin",
			description: "Saya yakin hal ini terjadi pada saya",
		},
		{
			value: 0.6,
			text: "Cukup yakin",
			description: "Saya cukup yakin hal ini terjadi pada saya",
		},
		{
			value: 0.4,
			text: "Kadang-kadang",
			description: "Kadang-kadang hal ini terjadi pada saya",
		},
		{
			value: 0.2,
			text: "Jarang",
			description: "Jarang hal ini terjadi pada saya",
		},
		{
			value: 0.0,
			text: "Tidak pernah",
			description: "Tidak pernah hal ini terjadi pada saya",
		},
	];

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-3">
					Memuat pertanyaan berdasarkan hipotesis yang dipilih...
				</p>
			</div>
		);
	}

	return (
		<div className="questionnaire-page">
			<h2 className="mb-4 text-center">
				Kuesioner Analisis Kecanduan Game Online
			</h2>
			<div className="row justify-content-center">
				<div className="col-lg-10">
					<div className="card shadow">
						<div className="card-body">
							<div className="alert alert-info">
								<h5>Petunjuk Pengisian:</h5>
								<p className="mb-2">
									Silakan jawab setiap pertanyaan berdasarkan kondisi Anda saat
									ini. Pilih tingkat keyakinan yang paling sesuai dengan
									pengalaman Anda.
								</p>
								<p className="mb-0">
									<strong>
										Pertanyaan yang muncul telah disesuaikan dengan hipotesis
										yang Anda pilih
									</strong>
									menggunakan metode backward chaining.
								</p>
							</div>

							{error && <div className="alert alert-danger">{error}</div>}

							<form onSubmit={handleSubmit}>
								{questions.map((question, index) => (
									<div className="mb-4 p-4 bg-light rounded" key={question.id}>
										<div className="mb-3">
											<h5 className="fw-bold text-primary mb-2">
												Pertanyaan {index + 1}
											</h5>
											<p className="mb-3" style={{ fontSize: "1.1rem" }}>
												{question.text}
											</p>
											{question.symptomCode && (
												<small className="text-muted">
													<strong>Gejala:</strong> {question.symptomCode}
												</small>
											)}
										</div>

										<div className="row">
											{cfValues.map((cf, cfIndex) => (
												<div
													className="col-md-6 col-lg-4 mb-3"
													key={`${question.id}-${cf.value}`}
												>
													<div className="form-check h-100">
														<input
															className="form-check-input"
															type="radio"
															name={`question-${question.id}`}
															id={`question-${question.id}-cf-${cf.value}`}
															value={cf.value}
															checked={
																answers[question.id] === cf.value.toString()
															}
															onChange={() =>
																handleAnswerChange(
																	question.id,
																	cf.value.toString()
																)
															}
														/>
														<label
															className="form-check-label w-100"
															htmlFor={`question-${question.id}-cf-${cf.value}`}
															style={{ cursor: "pointer" }}
														>
															<div className="p-2 border rounded h-100 d-flex flex-column">
																<strong className="text-primary mb-1">
																	{cf.text}
																</strong>
																<small className="text-muted">
																	{cf.description}
																</small>
																<small className="text-success mt-auto">
																	<strong>Nilai CF: {cf.value}</strong>
																</small>
															</div>
														</label>
													</div>
												</div>
											))}
										</div>
									</div>
								))}

								<div className="text-center mt-5">
									<div className="alert alert-warning">
										<h6>Perhitungan Certainty Factor</h6>
										<p className="mb-0">
											Sistem akan menghitung tingkat kecanduan menggunakan
											rumus:
											<br />
											<strong>CF Kombinasi = CF Expert × CF User</strong>
											<br />
											Kemudian semua CF digabungkan untuk mendapatkan hasil
											akhir.
										</p>
									</div>
									<button type="submit" className="btn btn-primary btn-lg px-5">
										<i className="bi bi-calculator me-2"></i>
										Analisis Hasil
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

export default Questionnaire;
