import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { FeedCard } from "./components/FeedCard";
import { RightPanel } from "./components/RightPanel";
import { MobileHeader } from "./components/MobileHeader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { useIsMobile } from "./components/ui/use-mobile";
import { MessageSquare } from "lucide-react";
import { api } from "./utils/api";
import { toast, Toaster } from "sonner@2.0.3";
import type { ImperativePanelHandle } from "react-resizable-panels@2.1.7";

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [rightPanelSize, setRightPanelSize] = useState(35);
  const [stories, setStories] = useState<any[]>([]);
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const feedRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to load data, if empty, seed the database
      const [storiesData, feedData] = await Promise.all([
        api.getStories(),
        api.getFeed(),
      ]);

      if (storiesData.length === 0 && feedData.length === 0) {
        console.log('Database is empty, seeding...');
        await api.seedDatabase();
        // Reload data after seeding
        const [newStories, newFeed] = await Promise.all([
          api.getStories(),
          api.getFeed(),
        ]);
        setStories(newStories);
        setFeedItems(newFeed);
        toast.success('Welcome! Sample data loaded.');
      } else {
        setStories(storiesData);
        setFeedItems(feedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);

    // Get current right panel size to preserve it
    const currentRightSize = rightPanelRef.current?.getSize() || rightPanelSize;

    if (newCollapsed) {
      // When collapsing, shrink sidebar and expand feed
      // Feed takes up: 100% - sidebar (5%) - right panel (current size)
      sidebarRef.current?.resize(5);
      feedRef.current?.resize(100 - 5 - currentRightSize);
    } else {
      // When expanding, restore original sizes
      // Feed takes up: 100% - sidebar (15%) - right panel (current size)
      sidebarRef.current?.resize(15);
      feedRef.current?.resize(100 - 15 - currentRightSize);
    }
  };

  const feedContent = (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
        <div className="mb-6 md:mb-8">
          {!isMobile && (
            <h1 className="text-slate-800 dark:text-slate-100 mb-4">
              Job<span className="text-orange-500">eee</span>
            </h1>
          )}
          {/* Stories */}
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-300 dark:border-slate-600 animate-pulse flex-shrink-0"
                ></div>
              ))
            ) : (
              stories.map((story) => (
                <div
                  key={story.id}
                  className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-500 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                  title={story.user?.name}
                >
                  <img
                    src={story.user?.avatar || story.thumbnailUrl}
                    alt={story.user?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feed Items */}
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 md:p-6 animate-pulse">
              <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          ))
        ) : (
          feedItems.map((item) => (
            <FeedCard
              key={item.id}
              type={item.type === 'quiz' ? 'quizz' : item.type}
              title={item.data.title}
              preview={item.data.description}
              tags={item.data.tags}
              imageUrl={item.data.imageUrl}
              company={item.data.company}
              likeCount={item.data.likeCount}
              commentCount={item.data.commentCount}
              onCardClick={() => {
                if (item.type === 'thread') {
                  setSelectedThread(item.id);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="h-screen flex flex-col overflow-hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <MobileHeader
            onMenuClick={() => setSheetOpen(true)}
          />
          <SheetContent
            side="left"
            className="p-0 w-54"
            aria-describedby={undefined}
          >
            <Sidebar isMobile={true} />
          </SheetContent>
        </Sheet>

        <Tabs
          defaultValue="feed"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-hidden">
            <TabsContent value="feed" className="h-full m-0">
              {feedContent}
            </TabsContent>
            <TabsContent
              value="discussion"
              className="h-full m-0"
            >
              <RightPanel selectedThreadId={selectedThread} />
            </TabsContent>
          </div>
          <TabsList className="w-full rounded-none border-t h-14 grid grid-cols-2">
            <TabsTrigger
              value="feed"
              className="data-[state=active]:bg-slate-100"
            >
              Feed
            </TabsTrigger>
            <TabsTrigger
              value="discussion"
              className="data-[state=active]:bg-slate-100"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussion
            </TabsTrigger>
          </TabsList>
        </Tabs>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />

        <ResizablePanel
          ref={feedRef}
          defaultSize={50}
          minSize={30}
        >
          {feedContent}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel
          ref={rightPanelRef}
          defaultSize={35}
          minSize={20}
          maxSize={55}
          onResize={(size) => setRightPanelSize(size)}
        >
          <RightPanel selectedThreadId={selectedThread} />
        </ResizablePanel>
      </ResizablePanelGroup>
      </div>
    </>
  );
}