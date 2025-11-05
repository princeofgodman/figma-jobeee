# Storage Architecture

## Overview

This application uses a **hybrid storage model** to separate read-only content from user-generated data:

### Supabase (Read-Only Content)
✅ Companies  
✅ Users  
✅ Stories  
✅ Threads (training scenarios)  
✅ Quizzes  
✅ Aclonas (educational content)  
✅ Seed comments (initial demo data)  

**Purpose**: Provides the core content that cannot be modified by users. This ensures data integrity and prevents database pollution.

### localStorage (User-Generated Data)
✅ Comments (new user comments)  
✅ Likes/Reactions  
✅ User preferences  

**Purpose**: Stores interactive user data locally in the browser. This data is private to each user and does not pollute the shared database.

---

## How It Works

### Reading Content
When you load the app:
1. **Content from Supabase**: Stories, threads, quizzes, and companies are fetched from the server
2. **Comments**: The app combines seed comments from Supabase with your local comments from localStorage
3. **Result**: You see a complete view mixing read-only content with your personal interactions

### Writing Data
When you interact:
1. **Adding a comment**: Stored in `localStorage` under `jobeee_comments:{threadId}`
2. **Liking a thread**: Counter stored in `localStorage` under `jobeee_likes:{threadId}`
3. **No server writes**: The Supabase database remains unchanged

---

## Benefits

✨ **No database pollution**: Users cannot add unwanted data to the shared database  
✨ **Full interactivity**: Users can still comment and like content  
✨ **Fast**: Local operations are instant  
✨ **Privacy**: User data stays in their browser  
✨ **Reset friendly**: Clear localStorage to start fresh  

---

## Developer Notes

### API Changes
- `api.addComment()` now writes to localStorage instead of server
- `api.getThread()` merges server comments with local comments
- `api.likeThread()` writes to localStorage only

### Server Endpoints
- `POST /threads/:id/comments` - Returns 403 (disabled)
- `POST /threads/:id/like` - Returns 403 (disabled)

### localStorage Keys
All keys are prefixed with `jobeee_`:
- `jobeee_comments:{threadId}` - Array of comment objects
- `jobeee_likes:{threadId}` - Like count string

### Utility Module
Import `localComments` from `/utils/localStorage.ts` for:
- Getting/adding/deleting comments
- Managing thread comment storage
- Clearing all local data

---

## Testing

To test the hybrid storage:

1. **Add a comment**: It appears immediately (stored locally)
2. **Refresh the page**: Your comment persists (from localStorage)
3. **Seed comments**: Original demo comments still appear (from Supabase)
4. **Clear localStorage**: Your comments disappear, seed comments remain

---

## Future Considerations

If you need to add server-side comment storage:
1. Re-enable the POST endpoints in `/supabase/functions/server/index.tsx`
2. Update `/utils/api.ts` to use server endpoints
3. Add authentication to prevent spam
4. Consider implementing moderation
