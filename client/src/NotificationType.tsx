export class NotificationType {
	private _title: string;
	private _body: string;

	constructor(title: string, body: string) {
		this._title = title;
		this._body = body;
	}

	get body(): string {
		return this._body;
	}

	set body(value: string) {
		this._body = value;
	}
	get title(): string {
		return this._title;
	}

	set title(value: string) {
		this._title = value;
	}
}
