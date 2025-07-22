import { useModal } from "@ebay/nice-modal-react";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

export const ModalContainer = ({
	children,
	...props
}: React.ComponentProps<typeof Card>) => {
	const modal = useModal();

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: TODO
		<div
			role="dialog"
			onClick={modal.remove}
			className="flex justify-center items-center absolute top-0 left-0 z-10 w-screen h-screen bg-black/50">
			<Card onClick={(e) => e.stopPropagation()} className={cn("relative max-w-sm flex-1", props.className)}>
				{children}
			</Card>
		</div>
	);
};
