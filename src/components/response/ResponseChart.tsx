import React from "react";

interface ResponseChartProps {
    url: string;
}

const ResponseChart: React.FC<ResponseChartProps> = ({ url }) => {
    return (
        <div className="flex-1 flex items-center justify-center h-48 border rounded-xl border-gray-200 bg-white">
            <img src={url} alt="Response Chart" className="w-full h-full object-contain" />
        </div>
    );
};

export default ResponseChart;
