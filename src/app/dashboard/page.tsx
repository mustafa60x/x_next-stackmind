"use client";

import { usePost } from '@/modules/posts/hooks/usePost';
import { DashboardHeader } from '@/modules/layout/components/DashboardHeader';
import { PageContainer } from '@/modules/layout/components/PageContainer';
import { CreatePostForm } from '@/modules/posts/components/CreatePostForm';
import { PostList } from '@/modules/posts/components/PostList';
import { LoadingSpinner } from '@/modules/common/components/LoadingSpinner';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { posts, isLoading, fetchPosts, createPost, createComment } = usePost();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostSubmit = async (title: string, content: string) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Lütfen başlık ve içerik alanlarını doldurun');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPost(title, content);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Gönderi oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (postId: string, content: string) => {
    if (!content.trim()) {
      toast.error('Lütfen bir yorum yazın');
      return;
    }

    try {
      setIsSubmitting(true);
      await createComment(postId, content);
      await fetchPosts(); // Refresh posts to get new comments
      toast.success('Yorum başarıyla eklendi');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Yorum eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white dark:bg-gray-900">
      <DashboardHeader postCount={posts.length} />
      
      <PageContainer>
        <CreatePostForm 
          onSubmit={handlePostSubmit}
          isSubmitting={isSubmitting}
        />

        <PostList 
          posts={posts}
          onCommentSubmit={handleCommentSubmit}
        />
      </PageContainer>
    </div>
  );
}