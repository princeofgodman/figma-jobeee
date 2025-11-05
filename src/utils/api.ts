import { projectId, publicAnonKey } from './supabase/info';
import { localComments } from './localStorage';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ff00f4a9`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Initialize database with seed data (read-only for content)
  seedDatabase: () => fetchAPI('/seed', { method: 'POST' }),

  // Get all stories (read-only from Supabase)
  getStories: () => fetchAPI('/stories'),

  // Get feed items (read-only from Supabase)
  getFeed: () => fetchAPI('/feed'),

  // Get thread with comments (combines Supabase data + localStorage comments)
  getThread: async (id: string) => {
    const serverData = await fetchAPI(`/threads/${id}`);
    const localThreadComments = localComments.getThreadComments(id);
    
    // Combine server comments with local comments
    const allComments = [
      ...(serverData.comments || []),
      ...localThreadComments,
    ];
    
    // Sort by creation date
    allComments.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    return {
      ...serverData,
      comments: allComments,
      commentCount: allComments.length,
    };
  },

  // Add comment to thread (localStorage only - no server write)
  addComment: (threadId: string, userName: string, content: string, userAvatar?: string) => {
    return Promise.resolve(
      localComments.addComment(threadId, userName, content, userAvatar)
    );
  },

  // Get aclonas (read-only from Supabase)
  getAclonas: () => fetchAPI('/aclonas'),

  // Like tracking is now local only
  likeThread: (threadId: string) => {
    // Store likes in localStorage too
    const key = `jobeee_likes:${threadId}`;
    const current = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, String(current + 1));
    return Promise.resolve({ likeCount: current + 1 });
  },

  // Get local like count for a thread
  getLocalLikes: (threadId: string): number => {
    const key = `jobeee_likes:${threadId}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  },
};
