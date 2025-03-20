import { Suspense } from 'react';
import { Post } from '@/types';
import { postRepository } from '@/lib/api';
import PostsLoading from './loading';
import dynamic from 'next/dynamic';

const DynamicPostCard = dynamic(
  () => import('@/modules/posts/components/PostCard').then(mod => ({ default: mod.PostCard })),
  {
    loading: () => (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    )
  }
);

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
        <DynamicPostCard key={post.id} post={post} />
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
