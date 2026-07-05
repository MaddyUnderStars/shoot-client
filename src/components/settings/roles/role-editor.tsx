import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TriCheckbox, TriCheckboxValue } from "@/components/ui/tricheckbox";
import type { Guild } from "@/lib/client/entity/guild";
import { Role } from "@/lib/client/entity/role";
import { getHttpClient } from "@/lib/http/client";
import { Permission } from "@/lib/http/generated/v1";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

export const RoleEditor = ({ role, guild }: { role: Role; guild: Guild }) => {
	const { $fetch } = getHttpClient();

	const [value, setValue] = useState<Role>(role);

	const [error, setError] = useState<string | null>(null);

	const isEveryone = role.id === guild.mention.split("@")[0];

	const deleteRole = async () => {
		setError(null);
		const res = await $fetch.DELETE("/role/{role_id}/", {
			params: {
				path: {
					role_id: value.id,
				},
			},
		});

		if (res.error) {
			setError(res.error.message);
		}
	};

	const saveRole = async () => {
		setError(null);
		const res = await $fetch.PATCH("/role/{role_id}/", {
			params: {
				path: {
					role_id: value.id,
				},
			},
			body: value,
		});

		if (res.error) {
			setError(res.error.message);
		}
	};

	function onChange(this: number, state: TriCheckboxValue) {
		value.allow = value.allow.filter((x) => x !== this);
		value.deny = value.deny.filter((x) => x !== this);

		if (state === TriCheckboxValue.allowed) {
			value.allow.push(this);
		}

		if (state === TriCheckboxValue.denied) {
			value.deny.push(this);
		}

		setValue(role);
	}

	return (
		<div className="max-w-sm flex flex-col items-end gap-2">
			<div className="w-full">
				<Label className="mb-2">Role Name</Label>
				<Input
					disabled={isEveryone}
					defaultValue={value.name}
					onChange={(e) => {
						role.name = e.target.value;
						setValue(role);
					}}
				/>
			</div>

			{!isEveryone ? null : (
				<Alert>
					<TriangleAlert />
					<AlertTitle>This is @everyone</AlertTitle>
					<AlertDescription>
						These permissions are the default given to every member in the guild.
					</AlertDescription>
				</Alert>
			)}

			<table className="w-full">
				<thead>
					<tr>
						<th className="px-6 py-3">Permission</th>
						<th className="py-3">State</th>
					</tr>
				</thead>

				<tbody>
					{CLEAN_PERMISSIONS.map(([perm, text]) => {
						const checked = value.allow.includes(perm)
							? TriCheckboxValue.allowed
							: value.deny.includes(perm)
								? TriCheckboxValue.denied
								: TriCheckboxValue.neutral;

						return (
							<tr key={perm}>
								<td className="px-6 capitalize py-1">{text}</td>
								<td className="py-1 w-20">
									<TriCheckbox
										defaultValue={checked}
										onChange={onChange.bind(perm)}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{!error ? null : <div className="text-destructive">{error}</div>}

			<div className="flex gap-2">
				<Button variant="destructive" onClick={deleteRole} disabled={isEveryone}>
					Delete
				</Button>
				<Button onClick={saveRole}>Save</Button>
			</div>
		</div>
	);
};

// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const CLEAN_PERMISSIONS: [number, string][] = Object.entries(Permission)
	// filter out NONE, OWNER, and only keep the string names
	.filter((x) => x[0] !== "0" && x[0] !== "1" && Number.isNaN(Number.parseInt(x[1].toString())))
	// map them to lowercase and remove the underscores
	.map((x) => [Number.parseInt(x[0]), x[1].toString().replaceAll("_", " ").toLowerCase()]);
