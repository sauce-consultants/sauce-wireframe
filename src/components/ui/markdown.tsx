import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className = "" }: MarkdownProps) {
  return (
    <div className={`prose-wireframe text-sm ${className}`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
