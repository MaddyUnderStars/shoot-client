import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export const AboutCard = () => {
	return (
		<Card className="w-sm bg-transparent border-none shadow-none">
			<CardHeader>
				<CardTitle className="text-3xl">Shoot</CardTitle>
				<CardDescription className="text-lg">
					Chat with your friends on the Fediverse in a familiar, instant messenger
					experience.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button asChild>
					<a href="https://github.com/maddyunderstars/shoot" target="_blank">
						Learn more here
					</a>
				</Button>
			</CardContent>
		</Card>
	);
};
