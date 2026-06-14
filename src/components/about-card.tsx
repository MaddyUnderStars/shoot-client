import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Anchor } from "./anchor";
import { BowArrow } from "lucide-react";

export const AboutCard = () => {
	return (
		<Card className="w-sm bg-transparent border-none shadow-none">
			<CardHeader>
				<CardTitle className="text-3xl flex gap-4">
					<div className="size-12">
						<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-full items-center justify-center rounded-lg">
							<BowArrow className="size-8" />
						</div>
					</div>
					Shoot
				</CardTitle>
				<CardDescription className="text-lg">
					Chat with your friends on the Fediverse in a familiar, instant messenger
					experience.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button asChild>
					<Anchor href="https://github.com/maddyunderstars/shoot" target="_blank">
						Learn more here
					</Anchor>
				</Button>
			</CardContent>
		</Card>
	);
};
