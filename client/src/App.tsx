import "./App.css";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import * as PushAPI from "@pushprotocol/restapi";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import { NotificationType } from "./NotificationType";

const user: string = "0xFa3D1BD6C0aB6be3A7397F909f645AB0bA0CcCe0";
const chainId: number = 5;

const userCAIP: string = `eip155:${chainId}:${user}`;

function toastError(message: string) {
    console.error(message)
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
    console.log(message)
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
    console.log(message)
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

function App() {
	const [data, setData] = useState<NotificationType[]>([]);

	const pushSDKSocket = createSocketConnection({
		user: userCAIP,
		env: ENV.STAGING,
		socketOptions: { autoConnect: false },
	});

	const pushSDKSPAMSocket = createSocketConnection({
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
		setData([notification, ...data]);
		toastInfo(`${notification.title}: ${notification.body}`);
	});

	// pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (message) => {
	//   // TODO: Should it show spam?
	//   console.log(message)
	//   const notification = new NotificationType(message.payload.notification.title, message.payload.notification.body)
	//   setData( [notification, ...data])
	// })

	useEffect(() => {
		// TODO
		// Notification.requestPermission();
		pushSDKSocket?.connect();
	}, [pushSDKSocket]);

	useEffect(() => {
	  PushAPI.user
			.getFeeds({
				user: userCAIP,
				env: ENV.STAGING,
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

				setData(initialData);
			});
	}, [])

	return (
		<div className="App">
			<ToastContainer newestOnTop />
			{data.map((notification) => {
				return (
					<p key={notification.id}>
						<b>{notification.title}</b>: {notification.body}
					</p>
				);
			})}
		</div>
	);
}

export default App;
