"use client";

import { Post, Comment } from "@/types";
import { useState, useCallback } from "react";
import { postRepository, commentRepository } from "@/lib/api";
import toast from "react-hot-toast";

export const usePost = (postId: string) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = (await postRepository.getPosts()) as Post[];
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Gönderiler yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = useCallback(async (title: string, content: string) => {
    try {
      const newPost = (await postRepository.createPost(title, content)) as Post;
      setPosts((prev) => [newPost, ...prev]);
      toast.success("Gönderi başarıyla oluşturuldu");
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Gönderi oluşturulurken bir hata oluştu");
      throw error;
    }
  }, []);

  const fetchPost = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = (await postRepository.getPost(postId)) as Post;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Gönderi yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const data = (await postRepository.getPost(postId)) as Post;
      if (post) {
        setPost((prev) => (prev ? { ...prev, comments: data.comments } : data));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Yorumlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId, post]);

  const createComment = useCallback(
    async (content: string) => {
      try {
        const newComment = (await commentRepository.createComment(
          postId,
          content
        )) as Comment;

        // Optimistic update
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: [...(prev.comments || []), newComment],
          };
        });

        toast.success("Yorum başarıyla eklendi");

        // Background refresh
        fetchComments();

        return newComment;
      } catch (error) {
        console.error("Error creating comment:", error);
        toast.error("Yorum eklenirken bir hata oluştu");
        fetchComments(); // Refresh on error to ensure consistency
        throw error;
      }
    },
    [postId, fetchComments]
  );

  return {
    posts,
    post,
    isLoading,
    isLoadingComments,
    fetchPost,
    fetchComments,
    createComment,
    fetchPosts,
    createPost,
  };
};
