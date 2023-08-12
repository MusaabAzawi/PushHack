import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationTable from "./NotificationTable";
import NotificationChart from "./NotificationChart";
import LatestNotification from "./LatestNotification";
import {toast, ToastContainer, ToastOptions} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import LoginIcon from "@mui/icons-material/Login";
import ListItemText from "@mui/material/ListItemText";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { Copyright } from "../Copyright";
import {ENV} from "@pushprotocol/socket/src/lib/constants";
import {useEffect, useRef, useState} from "react";
import {NotificationType} from "./NotificationType";
import {createSocketConnection, EVENTS} from "@pushprotocol/socket";
import * as PushAPI from "@pushprotocol/restapi";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

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

export default function Dashboard() {
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};
	const navigate = useNavigate();

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
		<ThemeProvider theme={defaultTheme}>
			<ToastContainer newestOnTop />
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar position="absolute" open={open}>
					<Toolbar
						sx={{
							pr: "24px", // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: "36px",
								...(open && { display: "none" }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							Dashboard
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open}>
					<Toolbar
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
							px: [1],
						}}
					>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<List component="nav">
						<ListItemButton onClick={() => navigate("/")}>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText primary="Dashboard" />
						</ListItemButton>
						<Divider sx={{ my: 1 }} />
						<ListSubheader component="div" inset>
							User Account
						</ListSubheader>
						<ListItemButton onClick={() => navigate("/login")}>
							<ListItemIcon>
								<LoginIcon />
							</ListItemIcon>
							<ListItemText primary="Login" />
						</ListItemButton>
						<ListItemButton onClick={() => navigate("/signup")}>
							<ListItemIcon>
								<AppRegistrationIcon />
							</ListItemIcon>
							<ListItemText primary="Register" />
						</ListItemButton>
						<ListItemButton>
							{/* TODO */}
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItemButton>
					</List>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: "100vh",
						overflow: "auto",
					}}
				>
					<Toolbar />
					<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
						<Grid container spacing={3}>
							{/* Chart */}
							<Grid item xs={12} md={8} lg={9}>
								<Paper
									sx={{
										p: 2,
										display: 'flex',
										flexDirection: 'column',
										height: 240,
									}}
								>
									<NotificationChart notifications={dataRef.current} />
								</Paper>
							</Grid>
							{/* Recent Deposits */}
							<Grid item xs={12} md={4} lg={3}>
								<Paper
									sx={{
										p: 2,
										display: 'flex',
										flexDirection: 'column',
										height: 240,
									}}
								>
									<LatestNotification notifications={dataRef.current} />
								</Paper>
							</Grid>
							{/* Recent Orders */}
							<Grid item xs={12}>
								<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
									<NotificationTable notifications={dataRef.current} />
								</Paper>
							</Grid>
						</Grid>
						<Copyright sx={{ pt: 4 }} />
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
