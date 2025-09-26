import { useEffect, useState } from "react";

export const usePermission = (name: PermissionName) => {
	const [granted, setGranted] = useState(false);

	useEffect(() => {
		if (!navigator.permissions) {
			setGranted(false);
			return;
		}

		const query = async () => {
			try {
				const perm = await navigator.permissions.query({ name });
				setGranted(perm.state === "granted");

				perm.onchange = () => {
					setGranted(perm.state === "granted");
				};
			} catch (_) {
				setGranted(false);
			}
		};

		query();
	}, [name]);

	return granted;
};
