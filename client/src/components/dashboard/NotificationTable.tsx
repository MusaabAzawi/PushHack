import * as React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { NotificationType } from "./NotificationType";
import {Table} from "@mui/material";


interface NotificationTableProps {
	notifications: NotificationType[];
}

export default function NotificationTable({notifications}: NotificationTableProps) {
	return (
		<React.Fragment>
			<Title>History</Title>
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
					{notifications.length === 0 ? (
						<TableRow>
							<TableCell>Loading...</TableCell>
							<TableCell />
						</TableRow>
					) : (
						<>
							{notifications.map((notification) => (
								<TableRow key={notification.id}>
									<TableCell>
										{notification.title}{" "}
										{/*{notification.spam && (*/}
										{/*	<Chip*/}
										{/*		label="SPAM"*/}
										{/*		color="warning"*/}
										{/*		size={"small"}*/}
										{/*	/>*/}
										{/*)}*/}
									</TableCell>
									<TableCell>{notification.body}</TableCell>
								</TableRow>
							))}
						</>
					)}
				</TableBody>
			</Table>
		</React.Fragment>
	);
}
