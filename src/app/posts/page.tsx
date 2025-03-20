import { Post } from '@/types';
import { PostCard } from '@/modules/posts/components/PostCard';
import { postRepository } from '@/lib/api';

async function getPosts() {
  return await postRepository.getPosts();
}

export default async function PostsPage() {
  const posts = await getPosts() as Post[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <div className="space-y-6">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
