# API Reference

## Frontend API (`/utils/api.ts`)

### Content Fetching (Read-Only)

#### `api.getStories()`
Fetches all stories with user data.

```typescript
const stories = await api.getStories();
// Returns: Story[]
```

**Response Structure:**
```typescript
{
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  createdAt: string;
  viewCount: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  }
}[]
```

---

#### `api.getFeed()`
Fetches feed items (threads and quizzes) with company data.

```typescript
const feedItems = await api.getFeed();
// Returns: FeedItem[]
```

**Response Structure:**
```typescript
{
  id: string;
  type: 'thread' | 'quiz';
  data: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    likeCount: number;
    commentCount: number;
    company: {
      id: string;
      name: string;
      logo: string;
    };
  };
  createdAt: string;
}[]
```

---

#### `api.getThread(id: string)`
Fetches thread details with merged comments (server + local).

```typescript
const thread = await api.getThread('thread-1');
// Returns: Thread with Comments
```

**Response Structure:**
```typescript
{
  id: string;
  companyId: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
  likeCount: number;
  commentCount: number; // Combined count
  company: Company;
  comments: Comment[]; // Merged: server + local
}
```

**Comment Structure:**
```typescript
{
  id: string; // "local-comment-..." for local
  threadId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string; // ISO 8601
}
```

---

#### `api.getAclonas()`
Fetches educational content (aclonas) with company data.

```typescript
const aclonas = await api.getAclonas();
// Returns: Aclona[]
```

**Response Structure:**
```typescript
{
  id: string;
  companyId: string;
  title: string;
  description: string;
  contentType: 'video' | 'audio' | 'interactive';
  mediaUrl?: string;
  duration?: number; // seconds
  createdAt: string;
  company: Company;
}[]
```

---

#### `api.seedDatabase()`
Initializes database with sample data.

```typescript
await api.seedDatabase();
// Returns: { success: boolean; message: string }
```

**Usage:** Automatically called on first load if database is empty.

---

### User Interactions (localStorage)

#### `api.addComment(threadId, userName, content, userAvatar?)`
Adds a comment to a thread (stored in localStorage).

```typescript
const comment = await api.addComment(
  'thread-1',
  'Demo User',
  'This is my comment',
  'https://...'
);
// Returns: Promise<LocalComment>
```

**Parameters:**
- `threadId` (string, required) - Thread ID
- `userName` (string, required) - Commenter name
- `content` (string, required) - Comment text
- `userAvatar` (string, optional) - Avatar URL

**Returns:**
```typescript
{
  id: 'local-comment-1234567890-abc123';
  threadId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}
```

---

#### `api.likeThread(threadId: string)`
Increments like count for a thread (stored in localStorage).

```typescript
const result = await api.likeThread('thread-1');
// Returns: Promise<{ likeCount: number }>
```

**Storage:** `localStorage['jobeee_likes:{threadId}']`

---

#### `api.getLocalLikes(threadId: string)`
Gets local like count for a thread.

```typescript
const localLikes = api.getLocalLikes('thread-1');
// Returns: number
```

**Usage:**
```typescript
const totalLikes = serverLikes + api.getLocalLikes(threadId);
```

---

## localStorage Utilities (`/utils/localStorage.ts`)

### `localComments.getThreadComments(threadId: string)`
Retrieves all local comments for a thread.

```typescript
import { localComments } from './utils/localStorage';

const comments = localComments.getThreadComments('thread-1');
// Returns: LocalComment[]
```

---

### `localComments.addComment(threadId, userName, content, userAvatar?)`
Adds a comment to localStorage.

```typescript
const newComment = localComments.addComment(
  'thread-1',
  'John Doe',
  'Great thread!',
  'https://...'
);
// Returns: LocalComment
```

---

### `localComments.deleteComment(threadId: string, commentId: string)`
Deletes a specific comment.

```typescript
localComments.deleteComment('thread-1', 'local-comment-123');
// Returns: void
```

---

### `localComments.clearThreadComments(threadId: string)`
Clears all comments for a thread.

```typescript
localComments.clearThreadComments('thread-1');
// Returns: void
```

---

### `localComments.clearAllComments()`
Clears all comments from all threads.

```typescript
localComments.clearAllComments();
// Returns: void
```

---

### `localComments.getCommentCount(threadId, serverCount?)`
Gets total comment count (server + local).

```typescript
const total = localComments.getCommentCount('thread-1', 5);
// Returns: number (e.g., 8 = 5 server + 3 local)
```

---

## Server Endpoints (Supabase Edge Functions)

**Base URL:** `https://{projectId}.supabase.co/functions/v1/make-server-ff00f4a9`

### Active Endpoints

#### `GET /stories`
Returns all stories with user data.

**Headers:**
```
Authorization: Bearer {publicAnonKey}
```

**Response:** `Story[]`

---

#### `GET /feed`
Returns feed items (threads and quizzes).

**Headers:**
```
Authorization: Bearer {publicAnonKey}
```

**Response:** `FeedItem[]`

---

#### `GET /threads/:id`
Returns thread details with server comments only.

**Headers:**
```
Authorization: Bearer {publicAnonKey}
```

**Response:** `Thread`

**Note:** Frontend merges with local comments.

---

#### `GET /aclonas`
Returns educational content.

**Headers:**
```
Authorization: Bearer {publicAnonKey}
```

**Response:** `Aclona[]`

---

#### `POST /seed`
Initializes database with sample data.

**Headers:**
```
Authorization: Bearer {publicAnonKey}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully"
}
```

---

### Disabled Endpoints

#### `POST /threads/:id/comments` ❌
**Status:** 403 Forbidden

**Response:**
```json
{
  "error": "Comments are stored locally only. Use localStorage API on frontend."
}
```

---

#### `POST /threads/:id/like` ❌
**Status:** 403 Forbidden

**Response:**
```json
{
  "error": "Likes are stored locally only. Use localStorage API on frontend."
}
```

---

## localStorage Keys

### Comment Storage
**Key Pattern:** `jobeee_comments:{threadId}`

**Value:** JSON string of comment array

**Example:**
```javascript
localStorage.getItem('jobeee_comments:thread-1')
// Returns: '[{"id":"local-comment-...","threadId":"thread-1",...}]'
```

---

### Like Storage
**Key Pattern:** `jobeee_likes:{threadId}`

**Value:** String number

**Example:**
```javascript
localStorage.getItem('jobeee_likes:thread-1')
// Returns: "3"
```

---

## TypeScript Types

### LocalComment
```typescript
interface LocalComment {
  id: string;
  threadId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}
```

### FeedItem
```typescript
interface FeedItem {
  id: string;
  type: 'thread' | 'quiz';
  data: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl?: string;
    likeCount: number;
    commentCount: number;
    company: Company;
  };
  createdAt: string;
}
```

### Thread
```typescript
interface Thread {
  id: string;
  companyId: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}
```

---

## Error Handling

All API functions catch errors and return/throw appropriately:

```typescript
try {
  const data = await api.getStories();
} catch (error) {
  console.error('Error fetching stories:', error);
  // error.message contains details
}
```

Common errors:
- **Network errors:** `Failed to fetch`
- **API errors:** `API error: 404` (with message)
- **localStorage errors:** `Failed to parse` or `QuotaExceededError`

---

## Usage Examples

### Load Feed with Combined Likes
```typescript
const feedItems = await api.getFeed();

feedItems.forEach(item => {
  const serverLikes = item.data.likeCount;
  const localLikes = api.getLocalLikes(item.id);
  const totalLikes = serverLikes + localLikes;
  
  console.log(`${item.data.title}: ${totalLikes} likes`);
});
```

---

### Add Comment and Refresh
```typescript
// Add comment
await api.addComment('thread-1', 'User', 'Nice thread!');

// Reload thread to see new comment
const thread = await api.getThread('thread-1');
console.log(`Total comments: ${thread.commentCount}`);
```

---

### Check if Comment is Local
```typescript
const thread = await api.getThread('thread-1');

thread.comments.forEach(comment => {
  const isLocal = comment.id.startsWith('local-comment-');
  console.log(`${comment.userName}: ${isLocal ? 'Local' : 'Server'}`);
});
```

---

### Clear User Data
```typescript
import { localComments } from './utils/localStorage';

// Clear all comments
localComments.clearAllComments();

// Clear all likes
Object.keys(localStorage)
  .filter(k => k.startsWith('jobeee_likes:'))
  .forEach(k => localStorage.removeItem(k));
```

---

## Best Practices

1. **Always merge comments:**
   ```typescript
   const thread = await api.getThread(id); // Already merged
   ```

2. **Show combined counts:**
   ```typescript
   const total = serverCount + api.getLocalLikes(id);
   ```

3. **Handle localStorage errors:**
   ```typescript
   try {
     localComments.addComment(...);
   } catch (error) {
     if (error.name === 'QuotaExceededError') {
       alert('Storage full!');
     }
   }
   ```

4. **Indicate local data:**
   ```typescript
   const isLocal = comment.id.startsWith('local-comment-');
   ```

---

**Last Updated:** 2025-11-05  
**API Version:** 1.0.0
