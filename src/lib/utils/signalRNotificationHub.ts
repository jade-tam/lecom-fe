import { PUBLIC_API_URL } from '$env/static/public';
import type { Notification } from '$lib/types/Notification';
import * as SignalR from '@microsoft/signalr';

const HUB_URL = PUBLIC_API_URL + '/hubs/notifications';

export class SignalRNotificationHub {
	connection: SignalR.HubConnection | null = null;
	token: string | null = null;

	constructor(token: string) {
		this.token = token;
		this.createConnection();
	}

	private createConnection() {
		this.connection = new SignalR.HubConnectionBuilder()
			.withUrl(HUB_URL, {
				accessTokenFactory: () => this.token ?? ''
			})
			.withAutomaticReconnect()
			.configureLogging(SignalR.LogLevel.Critical)
			.build();
	}

	public async connect() {
		if (!this.connection) this.createConnection();

		try {
			await this.connection!.start();
			console.log('SignalR connected to', HUB_URL);
		} catch (err) {
			console.error('SignalR connection error:', err);
		}
	}

	public disconnect() {
		if (this.connection) {
			this.offReceiveNotification();
			this.offUnreadCount();
			this.connection.stop();
			this.connection = null;
		}
	}

	public onReceiveNotification(handler: (notification: Notification) => void) {
		this.connection?.on('ReceiveNotification', handler);
	}

	public offReceiveNotification() {
		this.connection?.off('ReceiveNotification');
	}

	public onUnreadCount(handler: (count: number) => void) {
		this.connection?.on('UnreadCount', handler);
	}

	public offUnreadCount() {
		this.connection?.off('UnreadCount');
	}
}
