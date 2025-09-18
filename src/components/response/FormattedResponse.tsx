import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import ResponseTable from "./ResponseTable";
import ResponseChart from "./ResponseChart";

interface FormattedResponseProps {
  content: string | any[];
}

const FormattedResponse: React.FC<FormattedResponseProps> = ({ content }) => {
  if (!content) return null;

  if (Array.isArray(content)) {
    return (
      <div className="max-w-none">
        {content.map((part, index) => {
          if (part.type === "markdown") {
            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-100 dark:bg-gray-300 px-1 py-1 rounded text-black font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {part.content}
              </ReactMarkdown>
            );
          } else if (part.type === "table") {
            return <ResponseTable key={index} data={part.data} />;
          } else if (part.type === "chart_image") {
            return <ResponseChart key={index} url={part.url} />;
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-100 dark:bg-gray-300 px-1 py-1 rounded text-black font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children, ...props }) => <ResponseTable data={props as any} />,
          img: ({ ...props }) => {
            const chartUrl = props.src;
            return <ResponseChart url={chartUrl} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default FormattedResponse;
