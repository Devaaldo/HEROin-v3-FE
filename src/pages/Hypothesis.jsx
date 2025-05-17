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
		<div className="hypothesis-page">
			<h2 className="mb-4 text-center">
				Hipotesis Dampak Kecanduan Game Online
			</h2>
			<div className="row justify-content-center">
				<div className="col-md-8">
					<div className="card shadow">
						<div className="card-body">
							<p className="mb-4">
								Silakan pilih salah satu hipotesis yang paling sesuai dengan
								kondisi Anda saat ini terkait dengan dampak kecanduan game
								online:
							</p>

							{error && <div className="alert alert-danger">{error}</div>}

							<form onSubmit={handleSubmit}>
								<div className="mb-4">
									{hypotheses.map((hypothesis) => (
										<div className="form-check mb-3" key={hypothesis.id}>
											<input
												className="form-check-input"
												type="radio"
												name="hypothesis"
												id={`hypothesis-${hypothesis.id}`}
												value={hypothesis.id}
												checked={selectedHypothesis === hypothesis.id}
												onChange={(e) => setSelectedHypothesis(e.target.value)}
											/>
											<label
												className="form-check-label"
												htmlFor={`hypothesis-${hypothesis.id}`}
											>
												{hypothesis.description}
											</label>
										</div>
									))}
								</div>

								<div className="text-center">
									<button type="submit" className="btn btn-primary">
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
