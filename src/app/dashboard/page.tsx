"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { postRepository } from '@/lib/api/postRepository';

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchPosts = async () => {
      const data = await postRepository.getPosts() as any[];
      setPosts(data);
    };
    fetchPosts();
  }, [token, router]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const newPost = await postRepository.createPost(token, title, content);
    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!token) return;
    const newComment = await postRepository.createComment(token, postId, comment);
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p)));
    setComment('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-black dark:text-white">Hoş geldin, {user.username}!</h1>
      <button
        onClick={logout}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Çıkış Yap
      </button>

      <form onSubmit={handlePostSubmit} className="mt-6">
        <input
          type="text"
          placeholder="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 p-2 w-full rounded text-black dark:text-white bg-white dark:bg-gray-700"
        />
        <textarea
          placeholder="İçerik"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mb-4 p-2 w-full rounded text-black dark:text-white bg-white dark:bg-gray-700"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Gönder
        </button>
      </form>

      <div className="mt-6">
        {posts.map((post) => (
          <div key={post.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h2 className="text-xl font-bold text-black dark:text-white">{post.title}</h2>
            <p className="text-black dark:text-white">{post.content}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(post.id);
              }}
              className="mt-2"
            >
              <input
                type="text"
                placeholder="Yorum yaz"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 w-full rounded text-black dark:text-white bg-white dark:bg-gray-700"
              />
              <button type="submit" className="mt-2 p-2 bg-green-500 text-white rounded">
                Yorum Yap
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}