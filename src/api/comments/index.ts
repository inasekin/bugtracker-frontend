import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export type CommentDto = {
  id: string,
  issueId: string,
  authorId: string,
  content: string | undefined,
  createdAtTime: string,
  updatedAtTime: string
};

export const defaultCommentDto: CommentDto = {
  id: "",
  issueId: "",
  authorId: "",
  content: "",
  createdAtTime: "",
  updatedAtTime: ""
};

export function useComments(issueId: string, refreshId: string) {

  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    //const refreshId = Date.now();    
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/comments/issue-comments/${issueId}?refreshId=${refreshId}`, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении комментариев');
        }

        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении комментариев');
      } finally {
        setLoading(false);
      }
    };

    console.log("fetchComments: " + `${API_URL}/api/comments?refreshId=${refreshId})`);
    fetchComments();    
  }, [refreshId]);

  return { comments, loading, error };
}

export function useComment(commentId?: string) {
  const [comment, setComment] = useState<CommentDto>(defaultCommentDto);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!commentId) {
      setLoading(false);
      return;
    }

    const fetchComment = async () => {
      try {
        setLoading(true);
        const refreshId = Date.now();
        const response = await fetch(`${API_URL}/api/comments/${commentId}?refreshId=${refreshId}`, {
          method: "GET",
          credentials: "include",
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении проекта');
        }

        const data = await response.json();
        setComment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при получении проекта');
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId]);

  const updateComment = async (updatedComment: CommentDto) => {
    try {
      setLoading(true);
      const refreshId = Date.now(); // Кэширование настолько крутое в прокси, что даже put/post запросы не пропускает
      const response = await fetch(`${API_URL}/api/comments${commentId ? `/${commentId}` : ''}?refreshId=${refreshId}`, {
        method: commentId ? "PUT" : "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: "include",
        body: JSON.stringify(updatedComment),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении проекта');
      }

      if(commentId) 
      {
        // PUT метод не возвращает ничего, поэтому будет ошибка на response.json()
        return { success: true, updatedComment };
      }
      else
      {
        // Если создали новый объект, то вернёт объект с id
        const data = await response.json();
        setComment(data);
        return { success: true, data };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при обновлении комментария';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteCommentById = async (commentIdToDelete: string) => {
    if (!commentIdToDelete) {
      return { success: false, error: 'ID комментария не указан' };
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/comments/${commentIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении комментария');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении комментария';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    comment,
    setComment,
    loading,
    error,
    updateComment,
    deleteCommentById
  };
}
