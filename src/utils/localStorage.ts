// Local storage utility for comments
// Comments are stored locally and not synced to Supabase

interface LocalComment {
  id: string;
  threadId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

const STORAGE_PREFIX = 'jobeee_';
const COMMENT_KEY = (threadId: string) => `${STORAGE_PREFIX}comments:${threadId}`;

export const localComments = {
  // Get comments for a specific thread
  getThreadComments: (threadId: string): LocalComment[] => {
    try {
      const key = COMMENT_KEY(threadId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading comments from localStorage:', error);
      return [];
    }
  },

  // Add a new comment to a thread
  addComment: (
    threadId: string,
    userName: string,
    content: string,
    userAvatar?: string
  ): LocalComment => {
    try {
      const comments = localComments.getThreadComments(threadId);
      const newComment: LocalComment = {
        id: `local-comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        threadId,
        userName,
        userAvatar,
        content,
        createdAt: new Date().toISOString(),
      };

      comments.push(newComment);
      localStorage.setItem(COMMENT_KEY(threadId), JSON.stringify(comments));
      return newComment;
    } catch (error) {
      console.error('Error adding comment to localStorage:', error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: (threadId: string, commentId: string): void => {
    try {
      const comments = localComments.getThreadComments(threadId);
      const filtered = comments.filter(c => c.id !== commentId);
      localStorage.setItem(COMMENT_KEY(threadId), JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting comment from localStorage:', error);
      throw error;
    }
  },

  // Clear all comments for a thread
  clearThreadComments: (threadId: string): void => {
    try {
      localStorage.removeItem(COMMENT_KEY(threadId));
    } catch (error) {
      console.error('Error clearing comments from localStorage:', error);
    }
  },

  // Clear all comments (useful for reset)
  clearAllComments: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(`${STORAGE_PREFIX}comments:`)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all comments from localStorage:', error);
    }
  },

  // Get total comment count for a thread (including server + local)
  getCommentCount: (threadId: string, serverCount: number = 0): number => {
    const localCount = localComments.getThreadComments(threadId).length;
    return serverCount + localCount;
  },
};
