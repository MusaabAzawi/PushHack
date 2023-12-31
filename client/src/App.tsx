import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/login/LoginPage";
import SignUp from "./components/register/SignUp";

function App() {
	// ------- User Token -------
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/dash" element={<Dashboard />} />
				<Route path="/" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
