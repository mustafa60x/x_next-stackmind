"use client";

import { Post, Comment } from "@/types";
import { useState, useCallback } from "react";
import { commentRepository, postRepository } from "@/lib/api";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores";

export const usePost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = (await postRepository.getPosts()) as Post[];
      setPosts(data);
    } catch {
      toast.error("Gönderiler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (title: string, content: string) => {
    try {
      const newPost = (await postRepository.createPost(title, content)) as Post;
      const postWithUser = { ...newPost, user };
      setPosts((prev) => [postWithUser, ...prev] as Post[]);
      toast.success("Gönderi başarıyla oluşturuldu");
      return newPost;
    } catch (error) {
      toast.error("Gönderi oluşturulurken bir hata oluştu");
      throw error;
    }
  }, []);

  const fetchPost = useCallback(async (postId: string) => {
    try {
      setIsLoading(true);
      const data = (await postRepository.getPost(postId)) as Post;
      setPost(data);
    } catch {
      toast.error("Gönderi yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchComments = useCallback(async (postId: string) => {
    try {
      setIsLoadingComments(true);
      const data = (await postRepository.getPost(postId)) as Post;
      if (post) {
        setPost((prev) => (prev ? { ...prev, comments: data.comments } : data));
      }
    } catch {
      toast.error("Yorumlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoadingComments(false);
    }
  }, []);

  const createComment = useCallback(
    async (postId: string, content: string) => {
      try {
        const newComment = (await commentRepository.createComment(
          postId,
          content
        )) as Comment;

        const commentWithUser = { ...newComment, user };

        // Optimistic update
        setPost((prev: Post | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: [...(prev.comments || []), commentWithUser],
          } as Post;
        });

        toast.success("Yorum başarıyla eklendi");

        // Background refresh
        fetchComments(postId);

        return newComment;
      } catch (error) {
        toast.error("Yorum eklenirken bir hata oluştu");
        fetchComments(postId); // Refresh on error to ensure consistency
        throw error;
      }
    },
    [fetchComments, setPost, user]
  );


  return {
    posts,
    post,
    isLoading,
    isLoadingComments,
    fetchPost,
    fetchPosts,
    createPost,
    fetchComments,
    createComment
  };
};
