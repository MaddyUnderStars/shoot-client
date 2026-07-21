import { cn } from "@/lib/utils";
import { CheckIcon, MinusIcon, XIcon } from "lucide-react";
import { useRef, type ChangeEventHandler, type RefObject } from "react";

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
		<fieldset className="h-6 w-18">
			<CustomCheckbox
				ref={denied}
				type="checkbox"
				defaultChecked={defaultValue === TriCheckboxValue.denied}
				onChange={innerOnChange}
			>
				<XIcon
					className={cn(
						TriCheckboxClasses,
						"peer-checked:bg-destructive text-destructive border",
					)}
				/>
			</CustomCheckbox>
			<CustomCheckbox
				ref={neutral}
				type="checkbox"
				defaultChecked={defaultValue === TriCheckboxValue.neutral}
				onChange={innerOnChange}
			>
				<MinusIcon
					className={cn(
						TriCheckboxClasses,
						"peer-checked:bg-muted-foreground text-muted-foreground border-t border-b",
					)}
				/>
			</CustomCheckbox>
			<CustomCheckbox
				ref={allowed}
				defaultChecked={defaultValue === TriCheckboxValue.allowed}
				type="checkbox"
				onChange={innerOnChange}
			>
				<CheckIcon
					className={cn(TriCheckboxClasses, "peer-checked:bg-accent text-accent border")}
				/>
			</CustomCheckbox>
		</fieldset>
	);
};

const CustomCheckbox = ({
	ref,
	children,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & { ref?: RefObject<HTMLInputElement | null> }) => {
	return (
		<span>
			<label>
				<input
					ref={ref}
					{...props}
					className="appearance-none peer relative"
					type="checkbox"
				/>

				{children}
			</label>
		</span>
	);
};

const TriCheckboxClasses = "p-1 size-6 cursor-pointer inline peer-checked:text-white";
