import SparkMD5 from "spark-md5";

// mostly adapted from spark-md5 readme
export const getFileMd5 = (file: File) => {
	const spark = new SparkMD5.ArrayBuffer();
	const reader = new FileReader();

	const chunkSize = 1024 * 1024 * 2; // 2mb
	const chunks = Math.ceil(file.size / chunkSize);
	let currentChunk = 0;

	const loadNext = () => {
		const start = currentChunk * chunkSize;
		const end =
			start + chunkSize >= file.size ? file.size : start + chunkSize;

		reader.readAsArrayBuffer(file.slice(start, end));
	};

	return new Promise<string>((resolve, reject) => {
		reader.onload = (e) => {
			if (!e.target?.result || typeof e.target.result === "string")
				return reject(new Error("md5 result missing or wrong type?"));

			spark.append(e.target.result);
			currentChunk++;

			if (currentChunk < chunks) return loadNext();

			resolve(btoa(spark.end(true)));
		};

		reader.onerror = (e) => reject(e);

		loadNext();
	});
};

export const getFileDimensions = (
	file: File,
): Promise<{ width?: number; height?: number }> =>
	new Promise((resolve) => {
		if (file.type.startsWith("image")) {
			const img = new Image();
			img.onload = () => {
				const ret = { width: img.width, height: img.height };
				URL.revokeObjectURL(img.src);
				resolve(ret);
			};
			img.src = URL.createObjectURL(file);
		} else if (file.type.startsWith("video")) {
			const video = document.createElement("video");
			video.addEventListener("loadedmetadata", () => {
				const ret = {
					width: video.videoWidth,
					height: video.videoHeight,
				};
				URL.revokeObjectURL(video.src);
				resolve(ret);
			});
			video.src = URL.createObjectURL(file);
		} else {
			resolve({});
		}
	});
