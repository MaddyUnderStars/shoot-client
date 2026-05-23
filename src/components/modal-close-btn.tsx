import { useModal } from "@ebay/nice-modal-react";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

export const ModalCloseButton = () => {
	const modal = useModal();

	return (
		<Button
			className="pointer-events-auto"
			variant="outline"
			type="button"
			title="Close"
			onClick={modal.remove}
			onKeyDown={modal.remove}
		>
			<XIcon />
		</Button>
	);
};
