import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { NotificationType } from "./NotificationType";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import * as PushAPI from "@pushprotocol/restapi";

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

export default function Notifications() {
	const [data, setData] = useState<NotificationType[]>([new NotificationType("Loading", "Please wait!", -1)]);
	const dataRef = useRef<NotificationType[]>([new NotificationType("Loading", "Please wait!", -1)]);

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
				const initialData = new Array<NotificationType>();

				notifications.forEach((notification: any) => {
					initialData.push(
						new NotificationType(
							notification.notification.title,
							notification.notification.body,
							notification.sid,
						),
					);
				});

				// Check if initial data is empty
				if (initialData.length === 0) {
					toastInfo("It seems like there haven't been any notifications sent yet.");
				}

				dataRef.current = initialData;
				setData(dataRef.current);
			});
	}, []);

	return (
		<React.Fragment>
			<Title>Recent Orders</Title>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>
							<b>Title</b>
						</TableCell>
						<TableCell>
							<b>Body</b>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{dataRef.current.map((row) => (
						<TableRow key={row.id}>
							<TableCell>{row.title}</TableCell>
							<TableCell>{row.body}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</React.Fragment>
	);
}
