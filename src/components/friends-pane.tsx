import { PanelLeftDashed } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAppStore } from "@/lib/store/AppStore";
import { RelationshipComponent } from "./relationship";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { SidebarTrigger } from "./ui/sidebar";

export const FriendsPane = () => {
	const isMobile = useIsMobile();

	const relationships = getAppStore().relationships;

	return (
		<div>
			<div className="p-4 bg-sidebar w-full border-b h-min">
				<h1>
					{!isMobile ? null : (
						<SidebarTrigger variant="ghost">
							<PanelLeftDashed />
						</SidebarTrigger>
					)}
					Friends
				</h1>
			</div>

			<div className="p-2">
				<form className="p-3">
					<Label htmlFor="add-friend-input">Add friend</Label>
					<div className="flex items-center mt-3 gap-2">
						<Input
							disabled
							className="p-5"
							name="add-friend-input"
							placeholder="user@example.com"
						/>
						<Button disabled type="submit">
							Add
						</Button>
					</div>
				</form>

				<div className="mt-5">
					{relationships.map((x) => (
						<RelationshipComponent rel={x} key={x.user.mention} />
					))}
				</div>
			</div>
		</div>
	);
};
