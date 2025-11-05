# Storage System Testing Guide

## Quick Test Scenarios

### Scenario 1: Add a Comment
1. Open the app
2. Click on any thread card in the feed
3. The right panel opens showing thread details
4. Type a comment in the text area
5. Click Send
6. **Expected**: Comment appears with a blue "Local" badge
7. **Verify**: Comment has a blue background to indicate it's stored locally

### Scenario 2: Persistence Check
1. Add a comment (follow Scenario 1)
2. Refresh the page (F5 or Cmd+R)
3. Click on the same thread
4. **Expected**: Your comment is still there with "Local" badge
5. **Verify**: Original seed comments are still present without badges

### Scenario 3: Multiple Comments
1. Click on a thread
2. Add 2-3 comments
3. **Expected**: All your comments appear with "Local" badges
4. **Verify**: Seed comments and local comments are sorted by timestamp

### Scenario 4: Like a Thread
1. Click on a thread card (note the like count)
2. The right panel shows thread details
3. In a future implementation, clicking thumbs up would increment local likes
4. **Expected**: Like count combines server + local likes

### Scenario 5: Clear Local Data
1. Open browser DevTools (F12)
2. Go to Application → Local Storage → your domain
3. Find keys starting with `jobeee_`
4. Delete them
5. Refresh the page
6. **Expected**: Your comments are gone, seed comments remain

### Scenario 6: Different Threads
1. Click on Thread A, add a comment
2. Click on Thread B, add a comment
3. Switch back to Thread A
4. **Expected**: Each thread has its own comments stored separately

---

## Testing localStorage Utilities

Open browser console and test these commands:

```javascript
// Import the utility (if available in console)
import { localComments } from './utils/localStorage';

// Get comments for a thread
localComments.getThreadComments('thread-1');

// Add a comment programmatically
localComments.addComment('thread-1', 'Test User', 'Test comment', 'https://...');

// Clear all comments
localComments.clearAllComments();
```

---

## Expected Behaviors

### ✅ What Should Work
- Comments persist after page refresh
- Local comments have visual distinction (blue background + "Local" badge)
- Server comments and local comments are combined in display
- Each thread has isolated comment storage
- Like counts combine server + local values
- Comments are sorted chronologically

### ❌ What Should NOT Work
- Writing comments to Supabase database (POST endpoint returns 403)
- Writing likes to Supabase database (POST endpoint returns 403)
- Sharing comments between users (each browser has its own localStorage)
- Comments appearing on other devices (localStorage is device-specific)

---

## Browser Console Checks

### Check localStorage Keys
```javascript
Object.keys(localStorage).filter(k => k.startsWith('jobeee_'))
// Should return: ['jobeee_comments:thread-1', 'jobeee_likes:thread-1', ...]
```

### View Stored Comments
```javascript
JSON.parse(localStorage.getItem('jobeee_comments:thread-1'))
// Should return array of comment objects
```

### View Like Count
```javascript
localStorage.getItem('jobeee_likes:thread-1')
// Should return string number like "3"
```

---

## Debugging

If comments don't persist:
1. Check if localStorage is enabled in browser
2. Check if in private/incognito mode (localStorage cleared on close)
3. Check browser console for errors
4. Verify `jobeee_comments:*` keys exist in localStorage

If seed comments don't show:
1. Check network tab for successful `/threads/:id` API call
2. Verify Supabase connection in console
3. Check if seed data was loaded (run `/seed` endpoint)

---

## Advanced Testing

### Test Comment Count
1. Add 3 local comments to a thread
2. Check that RightPanel shows correct count
3. The count should be: (server seed comments) + (local comments)

### Test Scaling Behavior
1. Open app with right panel at default size
2. Add a comment - verify UI looks good
3. Expand right panel to >40% width
4. Verify feed content scales down appropriately
5. Comments should still be readable

### Test Mobile View
1. Resize browser to mobile width (<768px)
2. Switch to "Discussion" tab
3. Add a comment
4. Switch to "Feed" tab and back
5. **Expected**: Comment persists across tab switches

---

## Reset Instructions

To completely reset local data:

### Option 1: Browser DevTools
1. Open DevTools (F12)
2. Application → Local Storage
3. Right-click → Clear

### Option 2: Console Command
```javascript
localStorage.clear()
```

### Option 3: Programmatic
```javascript
import { localComments } from './utils/localStorage';
localComments.clearAllComments();
```

---

## Success Criteria

✅ Comments are added instantly  
✅ Comments persist after refresh  
✅ Local comments have visual distinction  
✅ Server endpoints reject write operations  
✅ Feed shows combined like counts  
✅ No data pollution in Supabase  
✅ Each thread has isolated storage  
✅ UI clearly indicates local storage usage
