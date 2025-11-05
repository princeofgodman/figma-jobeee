# Quick Start Guide

## 🚀 What Changed?

Your app now uses **hybrid storage**:
- 📖 **Content** (stories, threads, quizzes) → Supabase (read-only)
- 💬 **Comments & Likes** → localStorage (your browser)

## 🎯 Key Benefits

✅ **No database pollution** - Test users can't add junk data  
✅ **Full interactivity** - Comments and likes still work  
✅ **Fast & private** - Your data stays in your browser  
✅ **Easy reset** - Clear localStorage to start fresh  

## 🧪 Try It Now

1. **Click any thread** in the feed
2. **Type a comment** in the discussion panel
3. **Hit send** - Your comment appears with a "Local" badge
4. **Refresh the page** - Your comment is still there!

## 🎨 Visual Indicators

### Local Comments
```
┌────────────────────────────────────┐
│  Demo User              [Local]    │ ← Blue badge
│  This is my comment                │
└────────────────────────────────────┘
     ↑ Blue background
```

### Server Comments
```
┌────────────────────────────────────┐
│  John Doe                          │ ← No badge
│  Original seed comment             │
└────────────────────────────────────┘
     ↑ Normal background
```

### Storage Notice
```
💾 Comments are stored locally in your browser
```

## 📊 How It Works

### When You Load the App
1. Fetches content from Supabase ✅
2. Reads your local comments from localStorage 💾
3. Combines them for display 🔄

### When You Add a Comment
1. Saves to localStorage instantly 💾
2. Shows success toast: "💬 Comment saved locally!"
3. Updates the UI immediately ⚡

## 🛠️ Developer Tools

### Check localStorage
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Look for keys starting with `jobeee_`

### View Your Comments
```javascript
// In browser console
localStorage.getItem('jobeee_comments:thread-1')
```

### Clear All Local Data
```javascript
// In browser console
localStorage.clear()
```

## 📱 Features by Screen Size

### Desktop
```
[Sidebar] [Feed with Stories] [Discussion Panel]
```
- Sidebar collapsed by default
- Feed scales down when discussion panel expands
- Resizable panels

### Mobile
```
[Header with Menu]
[Tabbed: Feed | Discussion]
```
- Hamburger menu for sidebar
- Tab switching for feed/discussion

## 🎛️ Adaptive Scaling

As you resize the right panel:
- **≤35% wide** → Feed at 100% scale (full size)
- **36-40% wide** → Feed at 90% scale (slightly smaller)
- **>40% wide** → Feed at 75% scale (compact)

Affects: images, padding, spacing, icons

## 📚 Documentation

- **STORAGE.md** - Architecture details
- **ARCHITECTURE.md** - System diagrams
- **DATABASE.md** - Database schema
- **TEST_STORAGE.md** - Testing guide
- **CHANGELOG_STORAGE.md** - Complete changes

## ❓ FAQ

**Q: Where are my comments stored?**  
A: In your browser's localStorage under `jobeee_comments:{threadId}`

**Q: Can others see my comments?**  
A: No, localStorage is local to your browser only

**Q: What happens if I clear my browser data?**  
A: Your comments will be deleted, but original content remains

**Q: Can I add content to Supabase?**  
A: No, write operations are disabled (returns 403)

**Q: How do I reset everything?**  
A: Clear localStorage in DevTools or run `localStorage.clear()`

**Q: Are there storage limits?**  
A: Yes, localStorage has ~5-10MB limit per origin

**Q: Can I export my comments?**  
A: Not yet, but you can manually copy from DevTools

## 🐛 Troubleshooting

### Comments Don't Persist
- Check if localStorage is enabled
- Check if in private/incognito mode
- Check browser console for errors

### Seed Comments Don't Show
- Check network tab for API calls
- Verify Supabase connection
- Try running `/seed` endpoint

### UI Looks Broken
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check console for errors

## 🎉 Success Checklist

After setup, verify:
- [ ] Feed loads stories and threads
- [ ] Clicking thread opens discussion
- [ ] Can add comment
- [ ] Comment has "Local" badge
- [ ] Comment persists after refresh
- [ ] Storage notice shows below input
- [ ] Toast notification works
- [ ] Sidebar collapsed by default
- [ ] Scaling works when resizing panels

## 🚦 What's Next?

Try these scenarios:
1. Add comments to multiple threads
2. Refresh and verify persistence
3. Clear localStorage and see reset
4. Test on mobile view
5. Toggle light/dark theme
6. Resize panels to see scaling

## 💡 Tips

- **Sidebar**: Click arrow to expand/collapse
- **Threads**: Click any card to open discussion
- **Comments**: Type and hit enter or click send
- **Theme**: Toggle sun/moon icon in sidebar
- **Scale**: Drag right panel edge to resize
- **Mobile**: Use tabs to switch feed/discussion

---

**Ready to Start?** Open the app and click any thread! 🎯

**Need Help?** Check the documentation files listed above.

**Found a Bug?** Check console logs and localStorage state.

---

**Version**: 1.0.0 | **Date**: 2025-11-05 | **Status**: ✅ Ready
