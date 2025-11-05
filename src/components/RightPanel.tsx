import { Play, Send, User, HardDrive } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface RightPanelProps {
  selectedThreadId?: string | null;
}

export function RightPanel({ selectedThreadId }: RightPanelProps) {
  const [threadData, setThreadData] = useState<any>(null);
  const [aclonas, setAclonas] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAclonas();
  }, []);

  useEffect(() => {
    if (selectedThreadId) {
      loadThread(selectedThreadId);
    }
  }, [selectedThreadId]);

  const loadThread = async (threadId: string) => {
    try {
      setLoading(true);
      const data = await api.getThread(threadId);
      setThreadData(data);
    } catch (error) {
      console.error('Error loading thread:', error);
      toast.error('Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  const loadAclonas = async () => {
    try {
      const data = await api.getAclonas();
      setAclonas(data);
    } catch (error) {
      console.error('Error loading aclonas:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || !selectedThreadId) return;

    try {
      // Comments are now stored in localStorage only
      // Using a demo user name - in a real app, this would come from auth
      await api.addComment(
        selectedThreadId, 
        'Demo User', 
        comment,
        'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
      );
      setComment('');
      toast.success('💬 Comment saved locally!');
      // Reload thread to show new comment
      loadThread(selectedThreadId);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="h-full bg-white dark:bg-slate-900 p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6">
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 md:p-6">
        <h2 className="text-slate-800 dark:text-slate-100 mb-3 md:mb-4">
          {threadData ? `Discussion: ${threadData.title}` : 'Discussion / Interactive'}
        </h2>
        
        {threadData && (
          <>
            <div className="mb-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">{threadData.scenario}</p>
                {threadData.tags && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {threadData.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {threadData.comments?.map((c: any) => {
                  const isLocalComment = c.id.startsWith('local-comment-');
                  return (
                    <div 
                      key={c.id} 
                      className={`flex gap-3 ${isLocalComment ? 'bg-blue-50 dark:bg-blue-900/10 p-2 rounded-lg border border-blue-200 dark:border-blue-800' : ''}`}
                    >
                      {c.userAvatar ? (
                        <img src={c.userAvatar} alt={c.userName} className="w-8 h-8 rounded-full flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm flex items-center gap-2">
                          <span className="text-slate-700 dark:text-slate-300">{c.userName}</span>
                          {isLocalComment && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                              Local
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{c.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comment input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Leave a comment..." 
                  className="resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button 
                  size="icon" 
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <HardDrive className="h-3 w-3" />
                <span>Comments are stored locally in your browser</span>
              </div>
            </div>
          </>
        )}

        {!threadData && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p className="text-sm">Click on a thread to join the discussion</p>
          </div>
        )}
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 md:p-6">
        <h2 className="text-slate-800 dark:text-slate-100 mb-3 md:mb-4">Aclonas</h2>
        <div className="space-y-3">
          {aclonas.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 md:p-6">
              <div className="flex items-center gap-3">
                <Play className="h-4 w-4 md:h-5 md:w-5 text-slate-400 dark:text-slate-500" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            aclonas.map((aclona) => (
              <div key={aclona.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer transition-colors">
                <div className="flex items-start gap-3">
                  <Play className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-slate-800 dark:text-slate-100 mb-1">{aclona.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{aclona.description}</p>
                    {aclona.duration && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {Math.floor(aclona.duration / 60)} min
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
