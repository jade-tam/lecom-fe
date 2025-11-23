import { PUBLIC_API_URL } from '$env/static/public';
import type { ChatMessage } from '$lib/types/Chat';
import * as SignalR from '@microsoft/signalr';

const HUB_URL = PUBLIC_API_URL + '/hubs/chat';

export class SignalRChatHub {
	connection: SignalR.HubConnection | null = null;
	token: string | null = null;
	currentConversationId: string | null = null;

	constructor(conversationId: string, token: string) {
		this.currentConversationId = conversationId;
		this.token = token;
		this.createConnection();
	}

	private createConnection() {
		this.connection = new SignalR.HubConnectionBuilder()
			.withUrl(HUB_URL, {
				accessTokenFactory: () => this.token ?? ''
			})
			.withAutomaticReconnect()
			.build();

		this.connection.onreconnected(async () => {
			if (this.currentConversationId) {
				await this.connection!.invoke('JoinConversation', this.currentConversationId);
			}
		});
	}

	public async connect() {
		if (!this.connection) this.createConnection();

		await this.connection!.start();
		if (this.currentConversationId) {
			await this.connection!.invoke('JoinConversation', this.currentConversationId);
		}
	}

	public disconnect() {
		if (this.connection) {
			this.offReceiveMessage();
			this.connection.stop();
			this.connection = null;
			this.currentConversationId = null;
		}
	}

	public onReceiveMessage(handler: (msg: ChatMessage) => void) {
		this.connection?.on('ReceiveMessage', handler);
	}

	public offReceiveMessage() {
		this.connection?.off('ReceiveMessage');
	}
}
