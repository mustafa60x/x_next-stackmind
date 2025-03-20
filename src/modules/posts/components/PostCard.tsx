'use client';

import { Post } from '@/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { CommentSection } from './CommentSection';
import { UserAvatar } from '@/modules/user/components/UserAvatar';

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  onCommentSubmit?: (postId: string, comment: string) => Promise<void>;
}

export const PostCard = ({ post, showFullContent = false, onCommentSubmit }: PostCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <UserAvatar username={post.user?.username} size="md" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {post.created_at && format(new Date(post.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
            </p>
          </div>
        </div>

        <Link 
          href={`/posts/${post.id}`}
          className="block hover:text-blue-500 transition-colors"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
        </Link>

        <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${!showFullContent && 'line-clamp-3'}`}>
          {post.content}
        </p>

        <CommentSection 
          comments={post.comments} 
          postId={post.id} 
          onCommentSubmit={onCommentSubmit}
          expanded={showFullContent}
        />
      </div>
    </div>
  );
};
