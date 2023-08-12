import "./App.css";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import * as PushAPI from "@pushprotocol/restapi";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import { NotificationType } from "./NotificationType";
import Dashboard from "./components/dashboard/Dashboard";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/login/LoginPage";

const user: string = "0xFa3D1BD6C0aB6be3A7397F909f645AB0bA0CcCe0";
const chainId: number = 5;

const userCAIP: string = `eip155:${chainId}:${user}`;

function toastError(message: string) {
	console.error(message);
	toast.error(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
}

function toastSuccess(message: string) {
	console.log(message);
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
}

function toastInfo(message: string) {
	console.log(message);
	toast.info(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
}

function sendBrowserNotification(title: string, body: string) {
	if ("Notification" in window && Notification.permission === "granted") {
		new Notification(title, {
			body: body,
		});
	} else {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				new Notification(title, {
					body: body,
				});
			}
		});
	}
}

function App() {
	const [data, setData] = useState<NotificationType[]>([]);
	const dataRef = useRef<NotificationType[]>([]);

	const pushSDKSocket = createSocketConnection({
		user: userCAIP,
		env: ENV.STAGING,
		socketOptions: { autoConnect: false },
	});

	pushSDKSocket?.on(EVENTS.CONNECT, () => {
		toastSuccess("Connection established!");
	});

	pushSDKSocket?.on(EVENTS.DISCONNECT, () => {
		toastError("Connection lost!");
	});

	pushSDKSocket?.on(EVENTS.USER_FEEDS, (message) => {
		const notification = new NotificationType(
			message.payload.notification.title,
			message.payload.notification.body,
			message.payload.sid,
		);

		dataRef.current = [notification, ...dataRef.current];
		setData(dataRef.current);

		toastInfo(`${notification.title}: ${notification.body}`);
		sendBrowserNotification(notification.title, notification.body);
	});

	useEffect(() => {
		pushSDKSocket?.connect();
	}, []);

	useEffect(() => {
	  PushAPI.user
			.getFeeds({
				user: userCAIP,
				env: ENV.STAGING,
				limit: 100,
			})
			.then((notifications) => {
				const initialData = new Array<NotificationType>()

				notifications.forEach((notification:any) => {
					initialData.push(new NotificationType(
						notification.notification.title,
						notification.notification.body,
						notification.sid,
					))
				})

				dataRef.current = initialData;
				setData(dataRef.current);
			});
	}, [])

	// ------- User Token -------

	return (
		<BrowserRouter>
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/login" element={<Login />} />
		</Routes>
		</BrowserRouter>
		
	);
}

export default App;
