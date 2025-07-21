import { makeAutoObservable, observable } from "mobx";
import type { ApiPublicAttachment, ApiPublicMessage } from "@/lib/http/types";
import { type AppStore, getAppStore } from "@/lib/store/AppStore";
import type { ActorMention } from "../common/actor";

export class Message implements ApiPublicMessage {
	@observable id: string;
	@observable content: string;
	@observable published: string;
	@observable updated: string;
	@observable author_id: ActorMention;
	@observable channel_id: ActorMention;
	@observable files: ApiPublicAttachment[];

	private app: AppStore;

	public get channel() {
		return this.app.getChannel(this.channel_id);
	}

	constructor(opts: ApiPublicMessage) {
		this.app = getAppStore();

		this.id = opts.id;
		this.content = opts.content;
		this.published = opts.published;
		this.updated = opts.updated;
		this.author_id = opts.author_id;
		this.channel_id = opts.channel_id;
		this.files = opts.files;

		makeAutoObservable(this);
	}
}
