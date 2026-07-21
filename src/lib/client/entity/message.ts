import { action, computed, makeObservable, observable } from "mobx";
import { getHttpClient } from "@/lib/http/client";
import type { ApiPublicAttachment, ApiPublicEmbed, ApiPublicMessage } from "@/lib/http/types";
import { type AppStore, getAppStore } from "@/lib/store/app-store";
import type { ActorMention } from "../common/actor";

export class Message implements Omit<ApiPublicMessage, "published" | "updated"> {
	id: string;
	content: string;
	published: Date;
	updated: Date;
	author_id: ActorMention;
	channel_id: ActorMention;
	files: ApiPublicAttachment[];
	embeds: ApiPublicEmbed[];

	private app: AppStore;

	public get channel() {
		return this.app.getChannel(this.channel_id);
	}

	constructor(opts: ApiPublicMessage) {
		this.app = getAppStore();

		this.id = opts.id;
		this.content = opts.content;
		this.published = new Date(opts.published);
		this.updated = new Date(opts.updated);
		this.author_id = opts.author_id;
		this.channel_id = opts.channel_id;
		this.files = opts.files;
		this.embeds = opts.embeds;

		makeObservable(this, {
			id: observable,
			content: observable,
			published: observable,
			updated: observable,
			author_id: observable,
			channel_id: observable,
			files: observable,
			embeds: observable,
			channel: computed,
			delete: action,
		});
	}

	public delete = async () => {
		const { $fetch } = getHttpClient();

		const { error } = await $fetch.DELETE("/channel/{channel_id}/messages/{message_id}/", {
			params: {
				path: {
					message_id: this.id,
					channel_id: this.channel_id,
				},
			},
		});

		if (error) throw new Error(error.message);

		return true;
	};
}
