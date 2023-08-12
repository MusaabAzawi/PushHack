export class NotificationType {
	private _title: string;
	private _body: string;
	private _id: number;

	constructor(title: string, body: string, id: number) {
		this._title = title;
		this._body = body;
		this._id = id;
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

	get id(): number {
		return this._id;
	}

	set id(id: number) {
		this._id = id;
	}
}
