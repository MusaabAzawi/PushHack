import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Tooltip} from 'recharts';
import Title from './Title';
import { NotificationType } from "./NotificationType";
import {parseStringToFloat} from "../../common/parse";

interface ChartProps {
    notifications: NotificationType[];
}

export default function NotificationChart({notifications}: ChartProps) {
    const theme = useTheme();


    const parsedNotifications = notifications.filter(notification => {
        return !isNaN(parseFloat(notification.body));
    }).map(notification => {
       const value:number = parseStringToFloat(notification.body);
       const id:number = notification.id;
       console.log({id: id, value: value})
       return {id: id, value: value};
    })

    return (
        <React.Fragment>
            <Title>Chart</Title>
            <ResponsiveContainer>
                <LineChart margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                }} data={parsedNotifications}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="id" tick={false} />
                    <YAxis><Label
                        angle={270}
                        position="left"
                        style={{
                            textAnchor: 'middle',
                            fill: theme.palette.text.primary,
                            ...theme.typography.body1,
                        }}
                    >
                        Balance ($)
                    </Label>
                    </YAxis>
                    <Tooltip
                        labelFormatter={id => {
                            return `ID: ${id}`;
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}