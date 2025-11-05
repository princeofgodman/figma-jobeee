# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend App                         │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Feed     │  │  Discussion  │  │   Right Panel    │   │
│  │  (Stories  │  │   (Threads)  │  │   (Comments &    │   │
│  │  & Cards)  │  │              │  │    Aclonas)      │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
│         ↓                ↓                    ↓              │
│    ┌────────────────────────────────────────────┐          │
│    │           API Layer (/utils/api.ts)        │          │
│    └────────────────────────────────────────────┘          │
│              ↓                        ↓                      │
└──────────────────────────────────────────────────────────────┘
               ↓                        ↓
    ┌──────────────────┐    ┌──────────────────┐
    │   Supabase KV    │    │   localStorage   │
    │   (Read-Only)    │    │  (Read-Write)    │
    └──────────────────┘    └──────────────────┘
```

---

## Data Flow

### Reading Content (Page Load)

```
User Opens App
     ↓
Load Stories, Threads, Quizzes from Supabase
     ↓
For Each Thread:
     ├─ Fetch server comments from Supabase
     ├─ Fetch local comments from localStorage
     └─ Merge and sort by timestamp
     ↓
Display Combined Content
```

### Writing Comments

```
User Types Comment
     ↓
User Clicks Send
     ↓
Store in localStorage (jobeee_comments:{threadId})
     ↓
Update UI Immediately
     ↓
Toast: "💬 Comment saved locally!"
```

### Like Interaction

```
User Clicks Like
     ↓
Increment counter in localStorage (jobeee_likes:{threadId})
     ↓
Update UI with combined count:
  (server likes + local likes)
```

---

## Storage Breakdown

### Supabase KV Store (Read-Only)

```
┌────────────────────────────────────────┐
│  Content Type    │  Storage Key       │
├──────────────────┼────────────────────┤
│  Users           │  user:{id}         │
│  Companies       │  company:{id}      │
│  Stories         │  story:{id}        │
│  Threads         │  thread:{id}       │
│  Quizzes         │  quiz:{id}         │
│  Aclonas         │  aclona:{id}       │
│  Seed Comments   │  comment:{id}      │
└────────────────────────────────────────┘
```

**Access**: Read-only from frontend
**Purpose**: Core application content
**Managed by**: Server seed data

### localStorage (Read-Write)

```
┌────────────────────────────────────────┐
│  Data Type       │  Storage Key       │
├──────────────────┼────────────────────┤
│  Comments        │  jobeee_comments:  │
│                  │    {threadId}      │
│  Likes           │  jobeee_likes:     │
│                  │    {threadId}      │
└────────────────────────────────────────┘
```

**Access**: Read-write from frontend
**Purpose**: User-generated interactions
**Managed by**: `/utils/localStorage.ts`

---

## Component Hierarchy

```
App.tsx
├── Sidebar.tsx
│   ├── Navigation Groups
│   └── Theme Toggle
├── Feed Content (Center)
│   ├── Stories (Circular Avatars)
│   └── FeedCard[] (Threads & Quizzes)
│       ├── Company Badge
│       ├── Title & Preview
│       ├── Tags
│       └── Like/Comment Counts ← (Server + Local)
└── RightPanel.tsx
    ├── Discussion Section
    │   ├── Thread Scenario
    │   ├── Comments[] ← (Server + Local)
    │   │   ├── Server Comment
    │   │   └── Local Comment (with badge)
    │   └── Comment Input
    │       └── Storage Info Text
    └── Aclonas Section
        └── Educational Content List
```

---

## Scaling System

### Right Panel Size → Content Scale

```
Right Panel Width    Feed Scale    Adjustments
─────────────────────────────────────────────────
≤ 35%                100%          Full size
36-40%               90%           Slightly smaller
> 40%                75%           Compact mode

Scaled Elements:
• Padding & margins
• Image sizes (stories, cards)
• Icon sizes
• Text spacing
• Gap between elements
```

---

## API Endpoints

### Server (Supabase Edge Functions)

```
GET  /make-server-ff00f4a9/stories        → Stories with users
GET  /make-server-ff00f4a9/feed           → Threads & quizzes
GET  /make-server-ff00f4a9/threads/:id    → Thread + comments
GET  /make-server-ff00f4a9/aclonas        → Educational content
POST /make-server-ff00f4a9/seed           → Initialize data

❌ POST /make-server-ff00f4a9/threads/:id/comments  → 403 Forbidden
❌ POST /make-server-ff00f4a9/threads/:id/like      → 403 Forbidden
```

### Frontend API (`/utils/api.ts`)

```typescript
api.getStories()                          // Fetch from server
api.getFeed()                             // Fetch from server
api.getThread(id)                         // Server + local merge
api.addComment(id, name, content, avatar) // → localStorage
api.likeThread(id)                        // → localStorage
api.getLocalLikes(id)                     // → localStorage
```

---

## State Management

### App.tsx State

```typescript
sidebarCollapsed: boolean     // Sidebar expand/collapse
rightPanelSize: number        // Right panel width %
stories: Story[]              // Story data
feedItems: FeedItem[]         // Thread/quiz data
selectedThread: string | null // Active discussion
loading: boolean              // Loading state
scale: 'small'|'medium'|'large' // Content scale
```

### RightPanel.tsx State

```typescript
threadData: Thread | null     // Active thread
aclonas: Aclona[]            // Educational content
comment: string              // Comment input
loading: boolean             // Loading state
```

---

## Responsive Behavior

### Desktop (≥768px)
```
┌──────┬─────────────────┬─────────────┐
│ Side │  Feed Content   │ Right Panel │
│ bar  │                 │             │
└──────┴─────────────────┴─────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────────┐
│  Header (with hamburger)    │
├─────────────────────────────┤
│                             │
│  Tabbed Content:            │
│  • Feed Tab                 │
│  • Discussion Tab           │
│                             │
└─────────────────────────────┘
```

---

## Theme Support

```
Light Mode:
• bg-slate-50 (feed)
• bg-white (cards)
• text-slate-800

Dark Mode:
• bg-slate-950 (feed)
• bg-slate-800 (cards)
• text-slate-100
```

Toggle: Sidebar → Bottom → Sun/Moon Icon

---

## Performance Considerations

### Optimizations
✅ localStorage reads are synchronous and fast
✅ Comments fetched once per thread
✅ Lazy loading for thread details
✅ Memoized scale calculations
✅ Efficient re-renders with React state

### Potential Bottlenecks
⚠️ Large comment count in localStorage
⚠️ localStorage quota limits (~5-10MB)
⚠️ Re-fetching thread on every comment

---

## Security Considerations

### ✅ Safe
- localStorage is origin-isolated
- No server writes prevent spam
- Read-only content can't be corrupted
- XSS protection via React

### ⚠️ Considerations
- localStorage is not encrypted
- Anyone with device access can read data
- No authentication currently implemented
- Comments not validated on server

---

## Error Handling

```typescript
try {
  // API call or localStorage operation
} catch (error) {
  console.error('Descriptive error message:', error);
  toast.error('User-friendly message');
}
```

Errors are:
1. Logged to console for debugging
2. Shown to user via toast notifications
3. Handled gracefully without breaking UI

---

## Future Architecture Enhancements

1. **Authentication Layer**
   ```
   Frontend → Auth → API → Supabase
                  ↓
            localStorage (user-specific)
   ```

2. **Sync Service** (Optional)
   ```
   localStorage ←→ Sync Service ←→ Cloud Storage
   ```

3. **Caching Layer**
   ```
   API → Cache → Supabase
   ```

4. **Real-time Updates** (Optional)
   ```
   Supabase Realtime → WebSocket → Frontend
   ```

---

## File Structure

```
/
├── App.tsx                    # Main app component
├── components/
│   ├── FeedCard.tsx          # Thread/quiz card
│   ├── RightPanel.tsx        # Discussion panel
│   ├── Sidebar.tsx           # Navigation
│   ├── MobileHeader.tsx      # Mobile nav
│   ├── StorageInfo.tsx       # Storage tooltip
│   └── ui/                   # Shadcn components
├── utils/
│   ├── api.ts                # API layer
│   ├── localStorage.ts       # Local storage utility
│   └── supabase/info.tsx     # Config
├── supabase/functions/server/
│   ├── index.tsx             # Hono web server
│   ├── kv_store.tsx          # KV utilities
│   ├── seed.ts               # Seed data
│   └── types.ts              # TypeScript types
└── styles/
    └── globals.css           # Global styles
```

---

**Last Updated**: 2025-11-05  
**Architecture Version**: 1.0 (Hybrid Storage)
