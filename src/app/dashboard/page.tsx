"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';
import { postRepository, commentRepository } from '@/lib/api';
import { Post, Comment } from '@/types';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postRepository.getPosts() as Post[];
        setPosts(data);
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    };
    fetchPosts();
  }, [router, logout]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = await postRepository.createPost(title, content) as Post;
    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
  };

  const handleCommentSubmit = async (postId: string) => {
    const newComment = await commentRepository.createComment(postId, comment) as Comment;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] as Comment[] } : p)));
    setComment('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      {/* <h1 className="text-2xl font-bold text-black dark:text-white">Hoş geldin, {user.username}!</h1> */}
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
        {JSON.stringify(posts)}
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