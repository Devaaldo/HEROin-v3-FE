import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo";
import Hypothesis from "./pages/Hypothesis";
import Questionnaire from "./pages/Questionnaire";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";

export default function App() {
	return (
		<Router>
			<div className="App d-flex flex-column min-vh-100">
				<Navbar />
				<div className="container py-4 flex-grow-1">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/user-info" element={<UserInfo />} />
						<Route path="/hypothesis" element={<Hypothesis />} />
						<Route path="/questionnaire" element={<Questionnaire />} />
						<Route path="/result" element={<Result />} />
						<Route path="/dashboard" element={<Dashboard />} />
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	);
}
