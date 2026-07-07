import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import type { DeepPartial } from "react-hook-form";

export class SettingsStore {
	voice = {
		input_volume: 1,
		output_volume: 1,
		agc: true,
		echo: true,
		noise: true,
	};

	// on mobile, make the buttons bigger by default
	ui_density: number = import.meta.env.VITE_IS_MOBILE_TAURI ? 0.3 : 0.25;

	notifications = {
		enabled: false,
		device_name: navigator.userAgent,
	};

	constructor() {
		makeAutoObservable(this);

		void makePersistable(this, {
			name: "settings-store",
			properties: ["voice", "ui_density", "notifications"],
			storage: window.localStorage,
		});
	}

	public setSettings = (opts: DeepPartial<SettingsStore>) => {
		if (opts.voice?.input_volume !== undefined)
			this.voice.input_volume = opts.voice.input_volume;

		if (opts.voice?.output_volume !== undefined)
			this.voice.output_volume = opts.voice.output_volume;

		if (opts.voice?.agc !== undefined) this.voice.agc = opts.voice.agc;
		if (opts.voice?.noise !== undefined) this.voice.noise = opts.voice.noise;
		if (opts.voice?.echo !== undefined) this.voice.echo = opts.voice.echo;

		if (opts.ui_density) this.ui_density = opts.ui_density;
	};
}
