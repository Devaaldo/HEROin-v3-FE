import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserInfo() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nama: "",
		usia: "",
		angkatan: "",
		programStudi: "",
		domisili: "",
		jenisKelamin: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validasi form
		for (const key in formData) {
			if (formData[key] === "") {
				setError("Semua field harus diisi");
				return;
			}
		}

		try {
			// Simpan data ke session storage untuk digunakan di halaman lain
			sessionStorage.setItem("userInfo", JSON.stringify(formData));

			// Kirim data ke backend
			await axios.post("http://localhost:5000/api/user-info", formData);

			// Navigasi ke halaman hipotesis
			navigate("/hypothesis");
		} catch (err) {
			setError("Terjadi kesalahan saat menyimpan data");
			console.error(err);
		}
	};

	return (
		<div className="user-info-page">
			<h2 className="mb-4 text-center">Identitas Pengguna</h2>
			<div className="row justify-content-center">
				<div className="col-md-8">
					<div className="card shadow">
						<div className="card-body">
							{error && <div className="alert alert-danger">{error}</div>}
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="nama" className="form-label">
										Nama Lengkap
									</label>
									<input
										type="text"
										className="form-control"
										id="nama"
										name="nama"
										value={formData.nama}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="usia" className="form-label">
										Usia
									</label>
									<input
										type="number"
										className="form-control"
										id="usia"
										name="usia"
										value={formData.usia}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="angkatan" className="form-label">
										Angkatan
									</label>
									<input
										type="text"
										className="form-control"
										id="angkatan"
										name="angkatan"
										value={formData.angkatan}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="programStudi" className="form-label">
										Program Studi
									</label>
									<input
										type="text"
										className="form-control"
										id="programStudi"
										name="programStudi"
										value={formData.programStudi}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="domisili" className="form-label">
										Domisili
									</label>
									<input
										type="text"
										className="form-control"
										id="domisili"
										name="domisili"
										value={formData.domisili}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="jenisKelamin" className="form-label">
										Jenis Kelamin
									</label>
									<select
										className="form-select"
										id="jenisKelamin"
										name="jenisKelamin"
										value={formData.jenisKelamin}
										onChange={handleChange}
										required
									>
										<option value="">Pilih jenis kelamin</option>
										<option value="Laki-laki">Laki-laki</option>
										<option value="Perempuan">Perempuan</option>
									</select>
								</div>

								<div className="text-center">
									<button type="submit" className="btn btn-primary">
										Lanjutkan
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

export default UserInfo;
