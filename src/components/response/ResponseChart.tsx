import React, { useEffect, useState } from "react";

interface ResponseChartProps {
	url: string;
}

const resolveUrl = (rawUrl: string) => {
	if (!rawUrl) return rawUrl;
	if (rawUrl.startsWith("http") || rawUrl.startsWith("data:image")) return rawUrl;

	// treat as path — prefer NEXT_PUBLIC_FLASK_BACKEND_URL then window.origin
	const backendBase = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FLASK_BACKEND_URL) || '';
	const base = backendBase || (typeof window !== 'undefined' ? window.location.origin : '');
	if (!base) return rawUrl;
	return `${base.replace(/\/$/, '')}/${rawUrl.replace(/^\//, '')}`;
};

const ResponseChart: React.FC<ResponseChartProps> = ({ url }) => {
	const [src, setSrc] = useState<string>(() => resolveUrl(url));
	const [triedFallback, setTriedFallback] = useState(false);

	useEffect(() => {
		setSrc(resolveUrl(url));
		setTriedFallback(false);
	}, [url]);

	const handleError = () => {
		// Don't attempt more than one fallback
		if (triedFallback) return;
		const backendBase = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FLASK_BACKEND_URL) || '';
		// If the provided url is already absolute, don't prefix the backend base again
		if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
			console.warn('[ResponseChart] image load failed for absolute URL, not retrying with backend base:', url);
			setTriedFallback(true);
			return;
		}
		if (!backendBase) return;
		const alt = `${backendBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
		if (alt === src) {
			setTriedFallback(true);
			return;
		}
		console.warn('[ResponseChart] image load failed, retrying with', alt);
		setSrc(alt);
		setTriedFallback(true);
	};

	return (
		<div className="w-full flex items-center justify-center h-64 md:h-72 border rounded-xl border-gray-200 bg-white">
			<img src={src} alt="Response Chart" className="w-full h-full object-contain" onError={handleError} />
		</div>
	);
};

export default ResponseChart;
