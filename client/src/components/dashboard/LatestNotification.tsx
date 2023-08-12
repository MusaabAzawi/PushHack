import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import {NotificationType} from "./NotificationType";
import {parseStringToFloat} from "../../common/parse";

interface LatestNotificationProps {
    notifications: NotificationType[];
}

export default function LatestNotification({notifications}: LatestNotificationProps) {
    if (notifications.length === 0) {
        return (
            <React.Fragment>
                <Title>Current Balance</Title>
                <Typography component="p" variant="h4">
                    Loading...
                </Typography>
            </React.Fragment>
        );
    }
    const value = parseStringToFloat(notifications[0].body);
    return (
        <React.Fragment>
            <Title>Current Balance</Title>
            <Typography component="p" variant="h4">
                ${value}
            </Typography>
        </React.Fragment>
    );
}