"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';
import { postRepository, commentRepository } from '@/lib/api';
import { Post, Comment } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await postRepository.getPosts() as Post[];
      setPosts(data);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error('Gönderiler yüklenirken bir hata oluştu');
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Lütfen başlık ve içerik alanlarını doldurun');
      return;
    }

    try {
      setIsSubmitting(true);
      const newPost = await postRepository.createPost(title, content) as Post;
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
      toast.success('Gönderi başarıyla oluşturuldu');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Gönderi oluşturulurken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) {
      toast.error('Lütfen bir yorum yazın');
      return;
    }

    try {
      setIsSubmitting(true);
      const newComment = await commentRepository.createComment(postId, commentText) as Comment;
      setPosts(posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      }));
      setCommentInputs({ ...commentInputs, [postId]: '' });
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Gönderi: {posts.length}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Create Post Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Yeni Gönderi Oluştur</h3>
          <form onSubmit={handlePostSubmit}>
            <input
              type="text"
              placeholder="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="İçerik"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">Henüz hiç gönderi yok</p>
            </div>
          ) : (
            posts.map((post: Post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {post.user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{post.user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.createdAt && format(new Date(post.createdAt), 'dd MMMM yyyy HH:mm', { locale: tr })}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

                  {/* Comments Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Yorumlar ({post.comments?.length || 0})</h4>
                    <div className="space-y-4 mb-4">
                      {post?.comments?.map((comment: Comment, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                            {comment.user?.username?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
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
                    <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Yorum yaz..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? '...' : 'Gönder'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}