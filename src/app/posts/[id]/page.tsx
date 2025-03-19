'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post, Comment } from '@/types';
import { commentRepository, postRepository } from '@/lib/api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Link from 'next/link';
import clsx from 'clsx';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const data = await postRepository.getPost(id as string) as Post;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Gönderi yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const data = await postRepository.getPost(id as string) as Post;
      if (post) {
        setPost(prev => prev ? { ...prev, comments: data.comments } : data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Yorumlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Lütfen bir yorum yazın');
      return;
    }

    try {
      setIsSubmitting(true);
      const newCommentData = await commentRepository.createComment(id as string, newComment) as Comment;
      
      // Optimistically update the UI
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...(prev.comments || []), newCommentData]
        };
      });
      
      setNewComment('');
      toast.success('Yorum başarıyla eklendi');
      
      // Fetch latest comments in the background
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Yorum eklenirken bir hata oluştu');
      // Refresh comments to ensure consistency
      fetchComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-500 hover:text-blue-600 transition-colors flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.707 3.293a1 1 0 010 1.414L6.414 9H17a1 1 0 110 2H6.414l4.293 4.293a1 1 0 11-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Geri Dön</span>
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {post.user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user?.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.createdAt && format(new Date(post.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Yorumlar ({post.comments?.length || 0})
              </h2>

              <form onSubmit={handleCommentSubmit} className="mb-8">
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
                  className={`mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                </button>
              </form>

              <div className={clsx(
                'space-y-6 relative',
                isLoadingComments && 'opacity-50'
              )}>
                {isLoadingComments && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {post.comments?.map((comment, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                      {comment.user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{comment.user?.username}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {comment.createdAt && format(new Date(comment.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
