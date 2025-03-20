import { Suspense } from 'react';
import { Post } from '@/types';
import { PostCard } from '@/modules/posts/components/PostCard';
import { postRepository } from '@/lib/api';
import PostsLoading from './loading';

async function getPosts() {
  // 1.5 saniye yapay gecikme
  await new Promise(resolve => setTimeout(resolve, 1500));
  return await postRepository.getPosts();
}

async function PostsList() {
  const posts = await getPosts() as Post[];

  return (
    <div className="space-y-6">
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <Suspense fallback={<PostsLoading />}>
        <PostsList />
      </Suspense>
    </div>
  );
}
