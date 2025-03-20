"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Textarea } from "@/modules/common/components/ui";

interface CreatePostFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreatePostForm = ({
  onSubmit,
  isSubmitting = false,
}: CreatePostFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Lütfen başlık ve içerik alanlarını doldurun");
      return;
    }

    try {
      await onSubmit(title, content);
      setTitle("");
      setContent("");
    } catch {
      // Error is handled by the parent component
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Yeni Gönderi Oluştur
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Başlık"
          type="text"
          placeholder="Gönderi başlığını girin"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          fullWidth
        />

        <Textarea
          label="İçerik"
          placeholder="Gönderi içeriğini girin"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          rows={4}
          fullWidth
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          fullWidth
          className="sm:w-auto"
        >
          Gönder
        </Button>
      </form>
    </div>
  );
};
