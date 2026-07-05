import { cn } from "@/lib/utils";
import { useRef, type ChangeEventHandler } from "react";

export enum TriCheckboxValue {
	neutral = 0,
	denied = 1,
	allowed = 2,
}

export const TriCheckbox = ({
	onChange,
	defaultValue,
}: {
	defaultValue?: TriCheckboxValue;
	onChange?: (value: TriCheckboxValue) => void;
}) => {
	const denied = useRef<HTMLInputElement>(null);
	const neutral = useRef<HTMLInputElement>(null);
	const allowed = useRef<HTMLInputElement>(null);

	const innerOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (e.target === denied.current) {
			onChange?.(TriCheckboxValue.denied);
			neutral.current!.checked = !e.target.checked;
			allowed.current!.checked = false;
			return;
		}

		if (e.target === allowed.current) {
			onChange?.(TriCheckboxValue.allowed);
			neutral.current!.checked = !e.target.checked;
			denied.current!.checked = false;
			return;
		}

		onChange?.(TriCheckboxValue.neutral);
		neutral.current!.checked = true;
		denied.current!.checked = false;
		allowed.current!.checked = false;
	};

	return (
		<fieldset>
			<input
				className={cn(TriCheckboxClasses, "checked:bg-destructive")}
				ref={denied}
				type="checkbox"
				defaultChecked={defaultValue === TriCheckboxValue.denied}
				onChange={innerOnChange}
			/>
			<input
				className={cn(TriCheckboxClasses, "checked:bg-muted-foreground")}
				ref={neutral}
				type="checkbox"
				defaultChecked={defaultValue === TriCheckboxValue.neutral}
				onChange={innerOnChange}
			/>
			<input
				className={cn(TriCheckboxClasses, "checked:bg-accent")}
				ref={allowed}
				defaultChecked={defaultValue === TriCheckboxValue.allowed}
				type="checkbox"
				onChange={innerOnChange}
			/>
		</fieldset>
	);
};

const TriCheckboxClasses =
	"cursor-pointer size-6 border appearance-none checked:bg-accent-foreground";
