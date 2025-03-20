'use client';

import { useParams } from 'next/navigation';
import { usePost } from '@/modules/posts/hooks/usePost';
import { useComment } from '@/modules/posts/hooks/useComment';
import { PostCard } from '@/modules/posts/components/PostCard';
import { PageContainer } from '@/modules/layout/components/PageContainer';
import { LoadingSpinner } from '@/modules/common/components/LoadingSpinner';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PostDetail() {
  const { id } = useParams();
  const { post, isLoading, fetchPost, createComment } = usePost();

  useEffect(() => {
    fetchPost(id as string);
  }, [id]);

  if (isLoading || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Gönderi Bulunamadı</h1>
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 transition-colors">
            Geri Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PageContainer>
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 transition-colors flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Geri Dön</span>
          </Link>
        </div>

        <PostCard 
          post={post}
          showFullContent
          onCommentSubmit={async (_, comment) => {
            await createComment(post.id, comment);
          }}
        />
      </PageContainer>
    </div>
  );
}
