"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/motion/Toast";
import Image from "next/image";

export default function ReceiptUploader({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleFile(file: File) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "samtop-pc");

      const res = await fetch("https://api.cloudinary.com/v1_1/drqqa0jp/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      
      setUploadedUrl(data.secure_url);
      onUpload(data.secure_url);
      showToast("Receipt uploaded successfully", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />
      {uploadedUrl ? (
        <div className="flex items-center gap-3 border border-line rounded-lg p-3 bg-mint/5">
          <div className="w-10 h-10 relative bg-white border border-line rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
            {uploadedUrl.endsWith(".pdf") ? (
              <span className="text-[10px] font-bold text-steel">PDF</span>
            ) : (
              <Image src={uploadedUrl} alt="Receipt" fill className="object-cover" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-mint" /> Receipt Attached
            </p>
            <button
              type="button"
              onClick={() => {
                setUploadedUrl(null);
                onUpload("");
              }}
              className="text-[11px] text-signal hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border border-dashed border-line rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-signal hover:bg-signal/5 transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-signal" />
          ) : (
            <Upload size={20} className="text-steel group-hover:text-signal" />
          )}
          <span className="text-xs text-steel font-medium">
            {uploading ? "Uploading receipt..." : "Tap to upload payment receipt"}
          </span>
          <span className="text-[10px] text-steel/70">JPG, PNG, PDF max 5MB</span>
        </button>
      )}
    </div>
  );
}
