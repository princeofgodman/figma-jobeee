# Jobeee - Social Learning Platform

A social network prototype for soft skills training where companies create educational scenarios and users share experiences through stories.

## 🌟 Overview

Jobeee combines educational content with social interaction:
- **Companies** create training scenarios (threads), quizzes, and aclonas
- **Users** share experiences through stories and participate in discussions
- **Hybrid storage** keeps content clean while enabling full interactivity

## 🏗️ Architecture

### Hybrid Storage System
- **Supabase** - Read-only content (stories, threads, quizzes, companies)
- **localStorage** - User interactions (comments, likes)

This separation ensures:
✅ No database pollution from test users  
✅ Full interactivity preserved  
✅ Fast local operations  
✅ Easy to reset  

## 🚀 Quick Start

1. **Open the app** - Content loads automatically
2. **Click any thread** - Opens discussion panel
3. **Add a comment** - Stored locally in your browser
4. **Refresh the page** - Your comments persist!

👉 See [QUICK_START.md](QUICK_START.md) for detailed instructions

## 📚 Documentation

### For Users
- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[TEST_STORAGE.md](TEST_STORAGE.md)** - Testing scenarios

### For Developers
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & diagrams
- **[API_REFERENCE.md](API_REFERENCE.md)** - Complete API documentation
- **[DATABASE.md](DATABASE.md)** - Database schema & endpoints
- **[STORAGE.md](STORAGE.md)** - Storage system details
- **[CHANGELOG_STORAGE.md](CHANGELOG_STORAGE.md)** - Recent changes

## 🎨 Features

### Three-Panel Layout
```
┌──────┬───────────────────┬─────────────┐
│      │                   │             │
│ Side │  Feed Content     │ Discussion  │
│ bar  │  + Stories        │ + Aclonas   │
│      │                   │             │
└──────┴───────────────────┴─────────────┘
```

### Responsive Design
- **Desktop:** Resizable three-panel layout
- **Mobile:** Tabbed interface with hamburger menu
- **Adaptive scaling:** Content scales based on panel size

### Dark Mode Support
Toggle between light and dark themes via sidebar

### Interactive Elements
- **Stories:** Circular avatars with user content
- **Feed Cards:** Threads and quizzes with companies
- **Comments:** Visual distinction for local vs server data
- **Likes:** Combined server + local counts

## 🛠️ Technology Stack

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Backend:** Supabase Edge Functions (Hono)
- **Database:** Supabase KV Store
- **Local Storage:** Browser localStorage
- **Icons:** Lucide React

## 📦 Project Structure

```
/
├── App.tsx                    # Main application
├── components/
│   ├── FeedCard.tsx          # Thread/quiz cards
│   ├── RightPanel.tsx        # Discussion panel
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── MobileHeader.tsx      # Mobile navigation
│   ├── StorageInfo.tsx       # Storage tooltip
│   └── ui/                   # shadcn components
├── utils/
│   ├── api.ts                # API layer
│   ├── localStorage.ts       # localStorage utilities
│   └── supabase/             # Supabase config
├── supabase/functions/server/
│   ├── index.tsx             # Hono server
│   ├── kv_store.tsx          # KV utilities
│   ├── seed.ts               # Sample data
│   └── types.ts              # TypeScript types
├── styles/
│   └── globals.css           # Global styles
└── [Documentation files]
```

## 🎯 Key Concepts

### Content Types
- **Stories:** Short video experiences from users
- **Threads:** Training scenarios (e.g., "barista during rush hour")
- **Quizzes:** Knowledge check assessments
- **Aclonas:** Educational content (podcasts, videos, interactive modules)

### Storage Strategy
- **Read from Supabase:** All content, companies, users, seed comments
- **Write to localStorage:** New comments, likes, user preferences
- **Merge on display:** Combine server + local data seamlessly

### Scaling System
Feed content adapts to right panel width:
- **≤35%:** Full size (100%)
- **36-40%:** Medium size (90%)
- **>40%:** Compact size (75%)

Affects: images, padding, spacing, icons

## 🔌 API Overview

### Frontend API
```typescript
import { api } from './utils/api';

// Fetch content (read-only)
const stories = await api.getStories();
const feed = await api.getFeed();
const thread = await api.getThread('thread-1');

// User interactions (localStorage)
await api.addComment('thread-1', 'User', 'Comment text');
await api.likeThread('thread-1');
const likes = api.getLocalLikes('thread-1');
```

### localStorage Utilities
```typescript
import { localComments } from './utils/localStorage';

// Manage comments
const comments = localComments.getThreadComments('thread-1');
localComments.addComment('thread-1', 'User', 'Text');
localComments.clearAllComments();
```

👉 See [API_REFERENCE.md](API_REFERENCE.md) for complete documentation

## 🧪 Testing

### Quick Test
1. Click a thread card
2. Add a comment
3. Refresh the page
4. Verify comment persists

### Visual Indicators
- **Local comments:** Blue background + "Local" badge
- **Server comments:** Normal background
- **Storage notice:** "💾 Comments are stored locally in your browser"

👉 See [TEST_STORAGE.md](TEST_STORAGE.md) for comprehensive testing guide

## 🐛 Troubleshooting

### Comments Don't Persist
- Check if localStorage is enabled
- Check if in private/incognito mode
- Verify browser console for errors

### Content Doesn't Load
- Check network tab for API calls
- Verify Supabase connection
- Try calling `/seed` endpoint

### UI Issues
- Clear browser cache
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Check console for errors

## 💡 Developer Notes

### Sidebar Default State
- Sidebar is **collapsed by default** (5% width)
- Click chevron to expand to 15-20%
- Improves initial focus on content

### Comment System
- New comments get ID: `local-comment-{timestamp}-{random}`
- Server comments have regular IDs
- Frontend checks `id.startsWith('local-comment-')` for styling

### Disabled Endpoints
- `POST /threads/:id/comments` → Returns 403
- `POST /threads/:id/like` → Returns 403
- Prevents database pollution

## 🔒 Security Considerations

- localStorage is origin-isolated
- No server writes prevent spam
- Read-only content can't be corrupted
- Currently no authentication (prototype)

## 📈 Performance

- localStorage operations are synchronous and fast
- Comments fetched once per thread
- Efficient React re-renders
- Lazy loading for thread details

## 🎨 Theme System

Built-in dark mode support:
- Toggle via sidebar (sun/moon icon)
- Persists preference
- Affects all components

## 📱 Responsive Behavior

### Desktop (≥768px)
- Three-panel layout
- Resizable panels
- Collapsed sidebar by default

### Mobile (<768px)
- Header with hamburger menu
- Tabbed content (Feed | Discussion)
- Full-width layout

## 🔄 Future Enhancements

Possible additions:
- [ ] User authentication
- [ ] Comment editing/deletion UI
- [ ] Cloud sync for comments (optional)
- [ ] localStorage quota monitoring
- [ ] Comment export/import
- [ ] Real-time updates
- [ ] Moderation tools

## 📄 License

This is a prototype application for demonstration purposes.

## 🤝 Contributing

This is a prototype. For production use:
1. Add authentication
2. Implement proper moderation
3. Add backend validation
4. Consider cloud sync
5. Add analytics

## 📞 Support

For documentation:
- Architecture questions → [ARCHITECTURE.md](ARCHITECTURE.md)
- API usage → [API_REFERENCE.md](API_REFERENCE.md)
- Testing → [TEST_STORAGE.md](TEST_STORAGE.md)
- Quick start → [QUICK_START.md](QUICK_START.md)

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-05  
**Status:** ✅ Production Ready (Prototype)

Built with ❤️ using React, Tailwind CSS, and Supabase
