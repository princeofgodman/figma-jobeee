import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface StorageInfoProps {
  className?: string;
}

export function StorageInfo({ className = '' }: StorageInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={`inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors ${className}`}>
            <Info className="h-3.5 w-3.5" />
            <span>Storage Info</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2 text-xs">
            <p className="font-medium">Hybrid Storage System</p>
            <div className="space-y-1">
              <p>
                <strong>From Server:</strong> Stories, threads, quizzes (read-only)
              </p>
              <p>
                <strong>Stored Locally:</strong> Your comments and likes
              </p>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              Local data is private and stays in your browser
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
