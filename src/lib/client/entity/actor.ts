import { makeObservable, observable } from "mobx";
import { splitQualifiedMention } from "@/lib/utils";
import type { ActorMention } from "../common/actor";

export class Actor {
	@observable mention: ActorMention;
	@observable name: string;

	public get domain() {
		const mention = splitQualifiedMention(this.mention);
		return mention.domain;
	}

	constructor(opts: { mention: ActorMention; name: string }) {
		this.mention = opts.mention;
		this.name = opts.name;

		makeObservable(this);
	}
}
