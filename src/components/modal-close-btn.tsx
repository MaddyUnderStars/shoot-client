import { useModal } from "@ebay/nice-modal-react";
import { XIcon } from "lucide-react";

export const ModalCloseButton = () => {
	const modal = useModal();

	return (
		<button
			className="pointer-events-auto"
			type="button"
			title="Close"
			onClick={modal.remove}
			onKeyDown={modal.remove}
		>
			<XIcon />
		</button>
	);
};
