import { action, makeAutoObservable, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import type { DeepPartial } from "react-hook-form";

export class SettingsStore {
	@observable voice = {
		input_volume: 1,
		output_volume: 1,
		agc: true,
		echo: true,
		noise: true,
	};

	constructor() {
		makeAutoObservable(this);

		makePersistable(this, {
			name: "settings-store",
			properties: ["voice"],
			storage: window.localStorage,
		});
	}

	@action
	public setSettings = (opts: DeepPartial<SettingsStore>) => {
		if (opts.voice?.input_volume !== undefined)
			this.voice.input_volume = opts.voice.input_volume;

		if (opts.voice?.output_volume !== undefined)
			this.voice.output_volume = opts.voice.output_volume;

		if (opts.voice?.agc !== undefined) this.voice.agc = opts.voice.agc;
		if (opts.voice?.noise !== undefined) this.voice.noise = opts.voice.noise;
		if (opts.voice?.echo !== undefined) this.voice.echo = opts.voice.echo;
	};
}
