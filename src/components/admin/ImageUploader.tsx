"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, Link, Loader2, X, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  category?: string;
}

export default function ImageUploader({
  currentImage,
  onImageChange,
  category = "general",
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Accepted: JPG, PNG, WebP");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File too large (max 5MB)");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          onImageChange(data.url);
        } else {
          setError(data.error || "Upload failed");
        }
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [category, onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFile]
  );

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleClear = () => {
    onImageChange("");
  };

  return (
    <div className="max-w-md space-y-3">
      {/* Current Image Preview */}
      {currentImage ? (
        <div className="relative w-full h-40 bg-white/[0.02] border border-white/10 rounded-lg overflow-hidden group">
          <Image
            src={currentImage}
            alt="Current image"
            fill
            className="object-contain p-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      ) : (
        <div className="w-full h-40 bg-white/[0.02] border border-white/10 rounded-lg flex items-center justify-center">
          <ImageIcon size={36} className="text-white/10" />
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex rounded-lg border border-white/10 overflow-hidden">
        <button
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-white/10 text-white"
              : "bg-white/[0.02] text-white/40 hover:text-white/60"
          }`}
        >
          <Upload size={13} />
          Upload File
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-white/10 text-white"
              : "bg-white/[0.02] text-white/40 hover:text-white/60"
          }`}
        >
          <Link size={13} />
          Enter URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-[#0071E3] bg-[#0071E3]/5"
                : "border-white/10 hover:border-white/20 bg-white/[0.02]"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-[#0071E3]" />
                <p className="text-sm text-white/50">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={24} className="text-white/30" />
                <p className="text-sm text-white/50">
                  Click to upload or drag and drop
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-white/30">
            Accepted: JPG, PNG, WebP &middot; Max size: 5MB
          </p>
        </>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0071E3] transition-colors"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="px-3 py-2 bg-[#0071E3] hover:bg-[#0077ed] disabled:opacity-30 text-white text-sm font-medium rounded-lg transition-all"
          >
            Set
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
