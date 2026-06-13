import { API_BASE_URL } from './config';

export interface Comment {
  id: string;
  blogPostId: string;
  userId?: string;
  name: string;
  email: string;
  message: string;
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  blogPostId: string;
  message: string;
  name?: string;
  email?: string;
}

export const getCommentsByBlogPost = async (blogPostId: string): Promise<{
  success: boolean;
  comments: Comment[];
  count: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/post/${blogPostId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        comments: [],
        count: 0,
      };
    }

    return data;
  } catch {
    return {
      success: false,
      comments: [],
      count: 0,
    };
  }
};

export const createComment = async (commentData: CreateCommentData): Promise<{
  success: boolean;
  comment?: Comment;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create comment',
      };
    }

    return data;
  } catch {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};
