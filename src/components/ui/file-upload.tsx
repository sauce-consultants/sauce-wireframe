"use client";

import { useState, useRef, type DragEvent } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (files: File[]) => void;
  className?: string;
}

function FileUpload({
  label,
  accept,
  multiple = false,
  maxSizeMB = 10,
  helperText,
  error,
  disabled = false,
  onChange,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFileError(null);
    const valid: File[] = [];
    for (const file of Array.from(incoming)) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setFileError(`"${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        continue;
      }
      valid.push(file);
    }
    const next = multiple ? [...files, ...valid] : valid.slice(0, 1);
    setFiles(next);
    onChange?.(next);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onChange?.(next);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <div
        onDragEnter={(e) => { handleDrag(e); setDragging(true); }}
        onDragOver={(e) => { handleDrag(e); setDragging(true); }}
        onDragLeave={(e) => { handleDrag(e); setDragging(false); }}
        onDrop={(e) => {
          handleDrag(e);
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center
          border-4 border-dashed p-8 text-center cursor-pointer
          transition-colors
          ${dragging ? "border-accent bg-accent/5" : "border-black"}
          ${disabled ? "opacity-50 pointer-events-none" : "hover:bg-gray-light/50"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
        <Upload size={32} className="text-text-muted mb-3" />
        <p className="text-sm font-semibold">
          Drag files here or click to browse
        </p>
        <p className="text-xs text-text-muted mt-1">
          {accept ? `Accepted: ${accept}` : "All file types"} &middot; Max {maxSizeMB}MB
        </p>
      </div>

      {(error || fileError) && (
        <p className="text-sm text-danger mt-1.5">{error || fileError}</p>
      )}
      {helperText && !error && !fileError && (
        <p className="text-sm text-text-muted mt-1.5">{helperText}</p>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col gap-2 mt-3">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 border-4 border-black p-3"
            >
              <FileText size={20} className="text-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{f.name}</p>
                <p className="text-xs font-mono text-text-muted">
                  {(f.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="text-text-muted hover:text-danger"
                aria-label={`Remove ${f.name}`}
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { FileUpload, type FileUploadProps };
