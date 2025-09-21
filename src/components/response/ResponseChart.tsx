import React, { useEffect, useState, useRef } from "react";
import { Maximize2, Download, X, ZoomIn, ZoomOut } from "lucide-react";

interface ResponseChartProps {
	url: string;
}

const resolveUrl = (rawUrl: string) => {
	if (!rawUrl) return rawUrl;
	if (rawUrl.startsWith("http") || rawUrl.startsWith("data:image")) {
		if (rawUrl.startsWith("https://localhost")) {
			return rawUrl.replace("https://localhost", "http://localhost");
		}
		return rawUrl;
	}

	let backendBase =
		(typeof process !== "undefined" &&
			process.env.NEXT_PUBLIC_FLASK_BACKEND_URL) ||
		"";
	if (backendBase.startsWith("https://localhost")) {
		backendBase = backendBase.replace("https://localhost", "http://localhost");
	}

	const base =
		backendBase ||
		(typeof window !== "undefined" ? window.location.origin : "");
	if (!base) return rawUrl;
	return `${base.replace(/\/$/, "")}/${rawUrl.replace(/^\//, "")}`;
};

const ResponseChart: React.FC<ResponseChartProps> = ({ url }) => {
	const [src, setSrc] = useState<string>(() => resolveUrl(url));
	const [triedFallback, setTriedFallback] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [zoom, setZoom] = useState(1);
	const imgRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		setSrc(resolveUrl(url));
		setTriedFallback(false);
	}, [url]);

	const handleError = () => {
		if (triedFallback) return;
		const backendBase =
			(typeof process !== "undefined" &&
				process.env.NEXT_PUBLIC_FLASK_BACKEND_URL) ||
			"";
		if (url && (url.startsWith("http") || url.startsWith("data:image"))) {
			console.warn(
				"[ResponseChart] image load failed for absolute URL, not retrying with backend base:",
				url
			);
			setTriedFallback(true);
			return;
		}
		if (!backendBase) return;
		const alt = `${backendBase.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
		if (alt === src) {
			setTriedFallback(true);
			return;
		}
		console.warn("[ResponseChart] image load failed, retrying with", alt);
		setSrc(alt);
		setTriedFallback(true);
	};

	const handleExport = () => {
		if (!src) return;

		const link = document.createElement("a");
		link.href = src;
		link.setAttribute("download", "chart.png"); // ensures download
		link.setAttribute("target", "_blank"); // fallback safety
		document.body.appendChild(link); // required for Firefox / Safari
		link.click();
		document.body.removeChild(link);
	};


	const handleZoom = (delta: number) => {
		setZoom((prev) => Math.max(0.5, Math.min(prev + delta, 5)));
	};

	return (
		<>
			{/* Chart container */}
			<div className="relative w-full flex items-center justify-center h-64 md:h-72 border rounded-xl border-gray-200 bg-white group overflow-hidden">
				<img
					ref={imgRef}
					src={src}
					alt="Response Chart"
					className="w-full h-full object-contain transition-transform duration-200"
					onError={handleError}
				/>

				{/* Toolbar (visible on hover) */}
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
					<button
						onClick={handleExport}
						className="p-2 bg-white border rounded-full shadow hover:bg-gray-100"
					>
						<Download className="h-4 w-4 text-gray-700" />
					</button>
					<button
						onClick={() => setIsFullscreen(true)}
						className="p-2 bg-white border rounded-full shadow hover:bg-gray-100"
					>
						<Maximize2 className="h-4 w-4 text-gray-700" />
					</button>
				</div>
			</div>

			{/* Fullscreen modal */}
			{isFullscreen && (
				<div className="fixed inset-0 z-50 bg-white bg-opacity-90 flex items-center justify-center">
					{/* Close button */}
					<button
						onClick={() => {
							setIsFullscreen(false);
							setZoom(1);
						}}
						className="absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-200"
					>
						<X className="h-5 w-5 text-gray-700" />
					</button>

					{/* Controls */}
					<div className="absolute bottom-6 flex space-x-3">
						<button
							onClick={() => handleZoom(0.2)}
							className="p-3 bg-white rounded-full shadow hover:bg-gray-200"
						>
							<ZoomIn className="h-5 w-5 text-gray-700" />
						</button>
						<button
							onClick={() => handleZoom(-0.2)}
							className="p-3 bg-white rounded-full shadow hover:bg-gray-200"
						>
							<ZoomOut className="h-5 w-5 text-gray-700" />
						</button>
						<button
							onClick={handleExport}
							className="p-3 bg-white rounded-full shadow hover:bg-gray-200"
						>
							<Download className="h-5 w-5 text-gray-700" />
						</button>
					</div>

					{/* Fullscreen image */}
					<div className="max-w-fullmax-h-full overflow-auto flex items-center rounded-2xl border border-gray-200 justify-center">
						<img
							src={src}
							alt="Fullscreen Chart"
							style={{ transform: `scale(${zoom})` }}
							className="transition-transform duration-200"
							onWheel={(e) => handleZoom(e.deltaY < 0 ? 0.1 : -0.1)}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default ResponseChart;
