"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TaskPhotoUpload({
  taskId,
}: {
  taskId: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("task-photos")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("task-photos")
      .getPublicUrl(fileName);

    await supabase
      .from("tasks")
      .update({
        photo_url: publicUrl,
      })
      .eq("id", taskId);

    alert("Photo uploaded");

    setUploading(false);

    window.location.reload();
  }

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="text-sm text-white"
      />

      {uploading && (
        <p className="text-gray-400 mt-2">
          Uploading...
        </p>
      )}
    </div>
  );
}