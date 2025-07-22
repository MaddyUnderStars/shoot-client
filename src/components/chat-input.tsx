import { Upload, XIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useChannel } from "@/hooks/use-channel";
import { cn } from "@/lib/utils";
import { FilePreview } from "./file-preview";
import { Input } from "./ui/input";

export const ChatInput = () => {
	const channel = useChannel();
	const [attached, setAttached] = useState<File[]>([]);

	if (!channel) return null;

	const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);

		const content = formData.get("content")?.toString();
		const files = [...attached];

		await channel.sendMessage({ content, files });

		form.reset();
	};

	return (
		<form
			className="p-3"
			onSubmit={sendMessage}
			onReset={() => setAttached([])}
		>
			{attached.length ? (
				<div className="relative p-3 dark:bg-input/30 border flex gap-2 flex-wrap overflow-scroll max-h-65 rounded-t-md border-b-0">
					<button
						type="button"
						className="absolute top-0 right-0 p-2"
						title="Cancel upload"
						onClick={() => setAttached([])}
					>
						<XIcon size={16} />
					</button>

					{attached.map((file) => (
						<FilePreview
							file={file}
							key={`${file.name}${file.type}${file.size}`}
						/>
					))}
				</div>
			) : null}

			<div className="flex">
				<Input
					type="text"
					name="content"
					placeholder="Send a message..."
					className={cn(
						"rounded-r-none border-r-0",
						attached.length ? "rounded-t-none" : "",
					)}
					autoComplete="off"
				/>

				<label
					htmlFor="files"
					title="Upload files"
					className={cn(
						"rounded-md rounded-l-none selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm flex items-center justify-center",
						attached.length ? "rounded-t-none rounded-bl-none" : "",
					)}
				>
					<Upload size={14} />
				</label>

				<input
					id="files"
					name="files"
					type="file"
					multiple
					hidden
					onChange={(e) => setAttached([...(e.target.files ?? [])])}
				/>
			</div>
		</form>
	);
};
