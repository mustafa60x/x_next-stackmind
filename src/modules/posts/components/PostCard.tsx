'use client';

import { Post } from '@/types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const DynamicCommentSection = dynamic(
  () => import('./CommentSection').then(mod => ({ default: mod.CommentSection })),
  {
    loading: () => <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  }
);

const DynamicUserAvatar = dynamic(
  () => import('@/modules/user/components/UserAvatar').then(mod => ({ default: mod.UserAvatar })),
  {
    loading: () => <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
  }
);

const formatDate = async (date: Date) => {
  const { format } = await import('date-fns');
  const { tr } = await import('date-fns/locale');
  return format(date, 'dd MMMM yyyy HH:mm', { locale: tr });
};

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  onCommentSubmit?: (postId: string, comment: string) => Promise<void>;
}

export const PostCard = ({ post, showFullContent = false, onCommentSubmit }: PostCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Card ekranda gorunuyor..
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1 // 0 ile 1 arasında bir değer, 0.1 demek %10'ını görürken tetiklenir.
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (post.created_at) {
      formatDate(new Date(post.created_at)).then(date => setFormattedDate(date));
    }
  }, [post.created_at]);

  return (
    <div 
      ref={cardRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <DynamicUserAvatar username={post.user?.username} size="md" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate}
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

        <DynamicCommentSection 
          comments={post.comments} 
          postId={post.id} 
          onCommentSubmit={onCommentSubmit}
          expanded={showFullContent}
        />
      </div>
    </div>
  );
};
