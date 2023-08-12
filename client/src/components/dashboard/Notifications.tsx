import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { toast, ToastOptions } from "react-toastify";
import { NotificationType } from "./NotificationType";
import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { ENV } from "@pushprotocol/socket/src/lib/constants";
import * as PushAPI from "@pushprotocol/restapi";
import { Chip } from "@mui/material";

const user: string = "0xFa3D1BD6C0aB6be3A7397F909f645AB0bA0CcCe0";
const chainId: number = 5;
const userCAIP: string = `eip155:${chainId}:${user}`;
const env: ENV = ENV.STAGING;
const notificationsLimit: number = 100;

const toastOptions: ToastOptions = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "light",
};

function toastError(message: string) {
	console.error(message);
	toast.error(message, toastOptions);
}

function toastSuccess(message: string) {
	console.log(message);
	toast.success(message, toastOptions);
}

function toastInfo(message: string) {
	console.log(message);
	toast.info(message, toastOptions);
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

function decryptNotification(encryptedNotification: NotificationType): NotificationType {
	let body: string = encryptedNotification.body;
	let title: string = encryptedNotification.title;

	body = decryptString(body);
	title = decryptString(title);

	return new NotificationType(title, body, encryptedNotification.id, encryptedNotification.spam);
}

function decryptString(message: string): string {
	return `DECRYPT: ${message}`;
}

export default function Notifications() {
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
			false,
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
				limit: notificationsLimit,
			})
			.then((notifications) => {
				const initialData = new Array<NotificationType>();

				notifications.forEach((notification: any) => {
					initialData.push(
						new NotificationType(
							notification.notification.title,
							notification.notification.body,
							notification.sid,
							false,
						),
					);
				});

				dataRef.current = [...initialData, ...dataRef.current];
				dataRef.current = dataRef.current.sort((a, b) => b.id - a.id);
				setData(dataRef.current);
			});

		PushAPI.user
			.getFeeds({
				user: userCAIP,
				env: env,
				limit: notificationsLimit,
				spam: true,
			})
			.then((notifications) => {
				const initialSpamData = new Array<NotificationType>();

				notifications.forEach((notification: any) => {
					initialSpamData.push(
						new NotificationType(
							notification.notification.title,
							notification.notification.body,
							notification.sid,
							true,
						),
					);
				});

				dataRef.current = [...initialSpamData, ...dataRef.current];
				dataRef.current = dataRef.current.sort((a, b) => b.id - a.id);
				setData(dataRef.current);
			});
	}, []);

	return (
		<React.Fragment>
			<Title>Recent Notifications</Title>
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
					{dataRef.current.length === 0 ? (
						<TableRow>
							<TableCell>Loading...</TableCell>
							<TableCell />
						</TableRow>
					) : (
						<>
							{dataRef.current.map((row) => (
								<TableRow key={row.id}>
									<TableCell>
										{row.title}{" "}
										{row.spam && (
											<Chip
												label="SPAM"
												color="warning"
												size={"small"}
											/>
										)}
									</TableCell>
									<TableCell>{row.body}</TableCell>
								</TableRow>
							))}
						</>
					)}
				</TableBody>
			</Table>
		</React.Fragment>
	);
}
