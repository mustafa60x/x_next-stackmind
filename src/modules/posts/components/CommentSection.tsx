"use client";

import { Comment } from "@/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useState } from "react";
import { UserAvatar } from "@/modules/user/components/UserAvatar";
import clsx from "clsx";
import Link from "next/link";

interface CommentSectionProps {
  comments?: Comment[];
  postId: string;
  onCommentSubmit?: (postId: string, comment: string) => Promise<void>;
  expanded?: boolean;
  isLoading?: boolean;
}

export const CommentSection = ({
  comments,
  postId,
  onCommentSubmit,
  expanded = false,
  isLoading = false,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCommentSubmit || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await onCommentSubmit(postId, newComment);
      setNewComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Yorumlar ({comments?.length || 0})
      </h4>

      {expanded && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            placeholder="Yorum yaz..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "..." : "Yorum Yap"}
          </button>
        </form>
      )}

      <div className={clsx("space-y-4 relative", isLoading && "opacity-50")}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {comments?.slice(0, expanded ? undefined : 3).map((comment, index) => (
          <div key={comment.id || index} className="flex space-x-3">
            <UserAvatar username={comment.user?.username} size="sm" />
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.user?.username}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {comment.created_at &&
                  format(new Date(comment.created_at), "dd MMMM yyyy HH:mm", {
                    locale: tr,
                  })}
              </p>
            </div>
          </div>
        ))}

        {!expanded && comments && comments.length > 3 && (
          <Link
            href={`/posts/${postId}`}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Tüm yorumları gör ({comments.length})
          </Link>
        )}
      </div>
    </div>
  );
};
