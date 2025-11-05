import {
  Home,
  MessageSquare,
  FileText,
  Menu,
  RefreshCw,
  MapPin,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { SheetTitle } from "./ui/sheet";
import { useTheme } from "./ui/use-theme";
import { useState } from "react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [openGroups, setOpenGroups] = useState<string[]>([
    "main",
    "network",
  ]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const navigationGroups = [
    {
      id: "main",
      label: "Main",
      items: [
        { icon: Home, label: "Home", active: true },
        { icon: MessageSquare, label: "Messages" },
        { icon: FileText, label: "Documents" },
      ],
    },
    {
      id: "network",
      label: "Network",
      items: [
        { icon: Menu, label: "Feed" },
        { icon: RefreshCw, label: "Activity" },
        { icon: MapPin, label: "Locations" },
      ],
    },
  ];

  return (
    <div
      className={`${isMobile ? "w-full" : isCollapsed ? "w-[54px]" : "w-[184px]"} h-full bg-slate-800 dark:bg-slate-900 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="flex-1 overflow-y-auto">
        {!isMobile && (
          <div className="p-2 flex items-center justify-between">
            {!isCollapsed && (
              <span className="text-sm text-slate-400 dark:text-slate-500">Menu</span>
            )}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                onClick={onToggleCollapse}
                className="P-3 text-white hover:bg-slate-700 dark:hover:bg-slate-800"
              >
                <ChevronLeft
                  className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                />
              </Button>
            )}
          </div>
        )}

        {isMobile && (
          <div className="p-2">
            <SheetTitle className="text-sm text-slate-400 dark:text-slate-500">Menu</SheetTitle>
          </div>
        )}

        <nav className="px-2 space-y-2">
          {navigationGroups.map((group) => (
            <Collapsible
              key={group.id}
              open={openGroups.includes(group.id)}
              onOpenChange={() => toggleGroup(group.id)}
            >
              {!isCollapsed && (
                <CollapsibleTrigger className="w-full px-3 py-2 text-sm text-slate-400 dark:text-slate-500 hover:text-white text-left">
                  {group.label}
                </CollapsibleTrigger>
              )}
              <CollapsibleContent className="space-y-1">
                {group.items.map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className={`w-full justify-start ${item.active ? "bg-slate-700 dark:bg-slate-800 text-white" : "text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 hover:text-white"} ${isCollapsed && !isMobile ? "px-3" : ""}`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${isCollapsed && !isMobile ? "" : "mr-3"}`}
                    />
                    {(!isCollapsed || isMobile) && (
                      <span>{item.label}</span>
                    )}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </div>

      <div className="p-2 border-t border-slate-700 dark:border-slate-800">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={`w-full justify-start text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 hover:text-white ${isCollapsed && !isMobile ? "px-3" : ""}`}
        >
          {theme === "light" ? (
            <Moon
              className={`h-5 w-5 ${isCollapsed && !isMobile ? "" : "mr-3"}`}
            />
          ) : (
            <Sun
              className={`h-5 w-5 ${isCollapsed && !isMobile ? "" : "mr-3"}`}
            />
          )}
          {(!isCollapsed || isMobile) && (
            <span>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}