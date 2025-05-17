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

		// Ambil pertanyaan berdasarkan hipotesis dari backend
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
					value,
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

	// CFValues (Certainty Factor) yang disederhanakan sesuai tabel
	const cfValues = [
		{ value: 1.0, text: "Sangat yakin" },
		{ value: 0.8, text: "Yakin" },
		{ value: 0.6, text: "Cukup Yakin" },
		{ value: 0.4, text: "Hampir yakin" },
		{ value: 0.2, text: "Kurang yakin" },
		{ value: 0.0, text: "Tidak yakin" },
	];

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="questionnaire-page">
			<h2 className="mb-4 text-center">
				Kuesioner Dampak Kecanduan Game Online
			</h2>
			<div className="row justify-content-center">
				<div className="col-lg-10">
					<div className="card shadow">
						<div className="card-body">
							<p className="mb-4">
								Jawab pertanyaan berikut sesuai dengan kondisi Anda saat ini.
								Pilih tingkat keyakinan Anda untuk setiap pernyataan yang
								diberikan.
							</p>

							{error && <div className="alert alert-danger">{error}</div>}

							<form onSubmit={handleSubmit}>
								{questions.map((question, index) => (
									<div className="mb-4 p-3 bg-light rounded" key={question.id}>
										<p className="fw-bold mb-3">
											{index + 1}. {question.text}
										</p>
										<div className="row">
											{cfValues.map((cf) => (
												<div
													className="col-md-4"
													key={`${question.id}-${cf.value}`}
												>
													<div className="form-check mb-2">
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
															className="form-check-label"
															htmlFor={`question-${question.id}-cf-${cf.value}`}
														>
															{cf.text}
														</label>
													</div>
												</div>
											))}
										</div>
									</div>
								))}

								<div className="text-center mt-4">
									<button type="submit" className="btn btn-primary btn-lg">
										Kirim Jawaban
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
