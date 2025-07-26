import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

export const NumberedSlider = ({
	label,
	...props
}: React.ComponentProps<typeof Slider> & {
	label?: (v: number[]) => string;
}) => {
	const [value, setValue] = useState<number[]>(props.defaultValue ?? []);

	return (
		<div className={cn(props.className, "flex gap-2")}>
			<Slider
				{...props}
				className=""
				onValueChange={(v) => {
					setValue(v);
					props.onValueChange?.(v);
				}}
			/>
			<Label>{label ? label(value) : value}</Label>
		</div>
	);
};
