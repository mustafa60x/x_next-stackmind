"use client";

import { Post, Comment } from "@/types";
import { useState, useCallback } from "react";
import { postRepository, commentRepository } from "@/lib/api";
import toast from "react-hot-toast";

export const useComment = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  

  return {
    post,
    isLoadingComments,
  };
};
