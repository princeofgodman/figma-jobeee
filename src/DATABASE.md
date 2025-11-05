# Database Structure

## Overview
This application uses a **hybrid storage approach**:
- **Supabase KV Store**: Read-only content (stories, threads, quizzes, aclonas, companies, users)
- **localStorage**: User-generated data (comments, likes)

This ensures the Supabase database cannot be polluted with user data while still providing full interactivity.

## Entities

### Users
Пользователи платформы, которые создают stories и комментируют сценарии.

**Storage:** `user:{userId}`

**Fields:**
- `id` - Unique identifier
- `name` - User's display name
- `avatar` - Profile picture URL
- `bio` - Short biography
- `createdAt` - Creation timestamp

### Companies
Компании, создающие обучающие сценарии.

**Storage:** `company:{companyId}`

**Fields:**
- `id` - Unique identifier
- `name` - Company name
- `logo` - Company logo URL
- `description` - Company description
- `industry` - Industry type
- `createdAt` - Creation timestamp

### Stories
Короткие видео от пользователей (отображаются как кружочки над лентой).

**Storage:** `story:{storyId}`

**Fields:**
- `id` - Unique identifier
- `userId` - Author user ID
- `videoUrl` - Video file URL
- `thumbnailUrl` - Thumbnail image URL
- `caption` - Story caption
- `createdAt` - Creation timestamp
- `viewCount` - Number of views

### Threads
Обучающие сценарии от компаний (например, "бариста в час пик").

**Storage:** `thread:{threadId}`

**Fields:**
- `id` - Unique identifier
- `companyId` - Company that created the thread
- `title` - Thread title
- `description` - Short description
- `scenario` - Full scenario text
- `difficulty` - 'easy' | 'medium' | 'hard'
- `tags` - Array of tags
- `imageUrl` - Thread image URL
- `createdAt` - Creation timestamp
- `likeCount` - Number of likes
- `commentCount` - Number of comments

### Quizzes
Квизы от компаний для проверки знаний.

**Storage:** `quiz:{quizId}`

**Fields:**
- `id` - Unique identifier
- `companyId` - Company that created the quiz
- `title` - Quiz title
- `description` - Quiz description
- `questions` - Array of questions with options and correct answers
- `tags` - Array of tags
- `imageUrl` - Quiz image URL
- `createdAt` - Creation timestamp
- `likeCount` - Number of likes
- `completionCount` - Number of completions

### Aclonas
Дополнительный образовательный контент (подкасты, видео, интерактивные модули).

**Storage:** `aclona:{aclonasId}`

**Fields:**
- `id` - Unique identifier
- `companyId` - Company that created the content
- `title` - Content title
- `description` - Content description
- `contentType` - 'video' | 'audio' | 'interactive'
- `mediaUrl` - Media file URL
- `duration` - Duration in seconds
- `createdAt` - Creation timestamp

### Comments
Комментарии пользователей к тредам.

**Storage:** 
- **Supabase**: `comment:{commentId}` (seed data only, read-only)
- **localStorage**: `jobeee_comments:{threadId}` (user-generated comments)

**Fields:**
- `id` - Unique identifier
- `threadId` - Thread being commented on
- `userName` - User's display name
- `userAvatar` - User's avatar URL (optional)
- `content` - Comment text
- `createdAt` - Creation timestamp

**Note:** New comments are stored in localStorage only. When displaying comments, the app combines seed comments from Supabase with local comments from localStorage.

## Indexes

For efficient querying, the following index keys are used:

- `index:stories` - Array of all story IDs
- `index:threads` - Array of all thread IDs
- `index:quizzes` - Array of all quiz IDs
- `index:aclonas` - Array of all aclonas IDs
- `index:comments:thread:{threadId}` - Array of comment IDs for a specific thread

## API Endpoints

### Seed Data
`POST /make-server-ff00f4a9/seed`
- Initializes database with sample data

### Stories
`GET /make-server-ff00f4a9/stories`
- Returns all stories with user data

### Feed
`GET /make-server-ff00f4a9/feed`
- Returns all feed items (threads and quizzes) with company data
- Sorted by creation date (newest first)

### Thread Details
`GET /make-server-ff00f4a9/threads/:id`
- Returns thread with company data and all comments

### Add Comment
`POST /make-server-ff00f4a9/threads/:id/comments`
- **DISABLED** - Returns 403 error
- Comments are now stored in localStorage only via frontend API

### Aclonas
`GET /make-server-ff00f4a9/aclonas`
- Returns all aclonas with company data

### Like Thread
`POST /make-server-ff00f4a9/threads/:id/like`
- **DISABLED** - Returns 403 error
- Likes are now stored in localStorage only (`jobeee_likes:{threadId}`)

## Initial Setup

The application automatically seeds the database on first load if no data exists. You can also manually trigger seeding by calling the `/seed` endpoint.

Sample data includes:
- 3 companies (Starbucks Academy, TechCorp Learning, Retail Excellence)
- 5 users
- 5 stories
- 3 threads with different scenarios
- 2 quizzes
- 2 aclonas
- 5 comments on threads (read-only seed data)

## localStorage Schema

User-generated data is stored in localStorage with the following keys:

### Comments
- **Key**: `jobeee_comments:{threadId}`
- **Value**: JSON array of comment objects
- **Structure**: 
  ```json
  [{
    "id": "local-comment-1234567890-abc123",
    "threadId": "thread-1",
    "userName": "Demo User",
    "userAvatar": "https://...",
    "content": "This is a comment",
    "createdAt": "2025-11-05T12:00:00.000Z"
  }]
  ```

### Likes
- **Key**: `jobeee_likes:{threadId}`
- **Value**: String number (e.g., "5")
- **Description**: Count of local likes for the thread

### Utility Functions

The `/utils/localStorage.ts` module provides helper functions:
- `localComments.getThreadComments(threadId)` - Get all comments for a thread
- `localComments.addComment(threadId, userName, content, userAvatar)` - Add a new comment
- `localComments.deleteComment(threadId, commentId)` - Remove a comment
- `localComments.clearThreadComments(threadId)` - Clear all comments for a thread
- `localComments.clearAllComments()` - Clear all stored comments
