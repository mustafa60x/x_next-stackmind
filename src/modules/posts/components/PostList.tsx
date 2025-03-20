"use client";

import { Post } from "@/types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: Post[];
  onCommentSubmit?: (postId: string, comment: string) => Promise<void>;
}

export const PostList = ({ posts, onCommentSubmit }: PostListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Henüz hiç gönderi yok
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onCommentSubmit={onCommentSubmit} />
      ))}
    </div>
  );
};
