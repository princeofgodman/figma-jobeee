import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { seedData } from "./seed.ts";
import type { User, Company, Story, Thread, Quiz, Aclona, Comment } from "./types.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ff00f4a9/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize database with seed data
app.post("/make-server-ff00f4a9/seed", async (c) => {
  try {
    await seedData();
    return c.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all stories for the feed header
app.get("/make-server-ff00f4a9/stories", async (c) => {
  try {
    const storyIds = await kv.get<string[]>("index:stories") || [];
    const stories = await kv.mget<Story>(storyIds.map(id => `story:${id}`));
    
    // Get user data for each story
    const userIds = [...new Set(stories.map(s => s.userId))];
    const users = await kv.mget<User>(userIds.map(id => `user:${id}`));
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));
    
    const storiesWithUsers = stories.map(story => ({
      ...story,
      user: userMap[story.userId],
    }));
    
    return c.json(storiesWithUsers);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get feed items (threads, quizzes, articles)
app.get("/make-server-ff00f4a9/feed", async (c) => {
  try {
    const threadIds = await kv.get<string[]>("index:threads") || [];
    const quizIds = await kv.get<string[]>("index:quizzes") || [];
    
    const threads = await kv.mget<Thread>(threadIds.map(id => `thread:${id}`));
    const quizzes = await kv.mget<Quiz>(quizIds.map(id => `quiz:${id}`));
    
    // Get company data
    const companyIds = [...new Set([
      ...threads.map(t => t.companyId),
      ...quizzes.map(q => q.companyId),
    ])];
    const companies = await kv.mget<Company>(companyIds.map(id => `company:${id}`));
    const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));
    
    const feedItems = [
      ...threads.map(thread => ({
        id: thread.id,
        type: 'thread' as const,
        data: {
          ...thread,
          company: companyMap[thread.companyId],
        },
        createdAt: thread.createdAt,
      })),
      ...quizzes.map(quiz => ({
        id: quiz.id,
        type: 'quiz' as const,
        data: {
          ...quiz,
          company: companyMap[quiz.companyId],
        },
        createdAt: quiz.createdAt,
      })),
    ];
    
    // Sort by creation date, newest first
    feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json(feedItems);
  } catch (error) {
    console.error("Error fetching feed:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get thread by ID with comments
app.get("/make-server-ff00f4a9/threads/:id", async (c) => {
  try {
    const threadId = c.req.param("id");
    const thread = await kv.get<Thread>(`thread:${threadId}`);
    
    if (!thread) {
      return c.json({ error: "Thread not found" }, 404);
    }
    
    const company = await kv.get<Company>(`company:${thread.companyId}`);
    
    // Get comments
    const commentIds = await kv.get<string[]>(`index:comments:thread:${threadId}`) || [];
    const comments = await kv.mget<Comment>(commentIds.map(id => `comment:${id}`));
    
    // Sort comments by date
    comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return c.json({
      ...thread,
      company,
      comments,
    });
  } catch (error) {
    console.error("Error fetching thread:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Comments are now managed in localStorage on the frontend
// This endpoint is disabled to prevent database writes
app.post("/make-server-ff00f4a9/threads/:id/comments", async (c) => {
  return c.json({ 
    error: "Comments are stored locally only. Use localStorage API on frontend." 
  }, 403);
});

// Get aclonas (right panel content)
app.get("/make-server-ff00f4a9/aclonas", async (c) => {
  try {
    const aclonasIds = await kv.get<string[]>("index:aclonas") || [];
    const aclonas = await kv.mget<Aclona>(aclonasIds.map(id => `aclona:${id}`));
    
    // Get company data
    const companyIds = [...new Set(aclonas.map(a => a.companyId))];
    const companies = await kv.mget<Company>(companyIds.map(id => `company:${id}`));
    const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));
    
    const aclonasWithCompanies = aclonas.map(aclona => ({
      ...aclona,
      company: companyMap[aclona.companyId],
    }));
    
    return c.json(aclonasWithCompanies);
  } catch (error) {
    console.error("Error fetching aclonas:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Likes are now managed in localStorage on the frontend
// This endpoint is disabled to prevent database writes
app.post("/make-server-ff00f4a9/threads/:id/like", async (c) => {
  return c.json({ 
    error: "Likes are stored locally only. Use localStorage API on frontend." 
  }, 403);
});

Deno.serve(app.fetch);