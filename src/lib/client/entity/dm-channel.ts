import { makeObservable, observable } from "mobx";
import type { ApiPublicDmChannel } from "@/lib/http/types";
import type { ActorMention } from "../common/actor";
import { Channel } from "./channel";

export class DmChannel extends Channel implements ApiPublicDmChannel {
	owner: ActorMention;
	recipients: ActorMention[];

	constructor(opts: ApiPublicDmChannel) {
		super(opts);

		this.owner = opts.owner;
		this.recipients = opts.recipients;

		makeObservable(this, {
			owner: observable,
			recipients: observable,
		});
	}
}
