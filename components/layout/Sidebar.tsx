"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Home,
  Timer,
  CheckSquare,
  BarChart3,
  Trophy,
  History,
  Settings,
  Wind,
  Gamepad2,
  Smile,
  Volume2,
  Music,
  Coffee,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
  Loader2,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    section: "main",
  },
  {
    id: "timer",
    label: "Timer",
    icon: <Timer className="w-5 h-5" />,
    section: "main",
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: <CheckSquare className="w-5 h-5" />,
    section: "main",
  },
  {
    id: "statistics",
    label: "Statistics",
    icon: <BarChart3 className="w-5 h-5" />,
    section: "main",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: <Trophy className="w-5 h-5" />,
    section: "main",
  },
  {
    id: "history",
    label: "History",
    icon: <History className="w-5 h-5" />,
    section: "main",
  },
  { id: "divider-1", label: "", icon: null, section: "divider" },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: <Smile className="w-5 h-5" />,
    section: "entertainment",
  },
  {
    id: "breathing",
    label: "Breathing Exercise",
    icon: <Wind className="w-5 h-5" />,
    section: "entertainment",
  },
  {
    id: "games",
    label: "Mini Games",
    icon: <Gamepad2 className="w-5 h-5" />,
    section: "entertainment",
  },
  {
    id: "jokes",
    label: "Jokes & Quotes",
    icon: <Smile className="w-5 h-5" />,
    section: "entertainment",
  },
  {
    id: "sounds",
    label: "Relaxing Sounds",
    icon: <Volume2 className="w-5 h-5" />,
    section: "entertainment",
  },
  {
    id: "music",
    label: "Focus Music",
    icon: <Music className="w-5 h-5" />,
    section: "entertainment",
  },
  { id: "divider-2", label: "", icon: null, section: "divider" },
  {
    id: "break-suggestions",
    label: "Break Suggestions",
    icon: <Coffee className="w-5 h-5" />,
    section: "break",
  },
  { id: "divider-3", label: "", icon: null, section: "divider" },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    section: "settings",
  },
];

export function Sidebar() {
  const { sidebarOpen, setSettingsOpen, setSidebarOpen } = useUIStore();
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session);
  const isSessionLoading = status === "loading";

  const sanitizedName = session?.user?.name?.trim() ?? "";
  const displayName =
    sanitizedName || (isAuthenticated ? "Focus champion" : "Guest explorer");
  const userInitial = sanitizedName
    ? sanitizedName.charAt(0).toUpperCase()
    : "🍅";
  const userEmail = session?.user?.email ?? "Sign in to sync progress";
  const profileImage = session?.user?.image ?? "";
  const AuthIcon = isAuthenticated ? LogOut : LogIn;
  const authLabel = isAuthenticated ? "Logout" : "Login";
  const authTitle = isAuthenticated ? "Sign out" : "Sign in";

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      setIsLoggingOut(true);
      try {
        await signOut({ callbackUrl: "/dashboard" });
      } catch {
        setIsLoggingOut(false);
      }
      return;
    }
    router.push("/login");
  };

  // Set sidebar open on desktop by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
        setIsCollapsed(false); // Reset collapsed state on mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  const handleItemClick = (itemId: string) => {
    if (itemId.startsWith("divider")) return;

    setActiveSection(itemId);

    if (itemId === "settings") {
      setSettingsOpen(true);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      return;
    }

    // Scroll to section
    const element = document.getElementById(itemId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Close sidebar on mobile after click
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Logout progress overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-gray-950/70 backdrop-blur-sm"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-sm font-medium text-white">Đang đăng xuất...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        variant="ghost"
        className={cn(
          "fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200/80 bg-white/90 p-0 text-gray-800 shadow-lg backdrop-blur-md hover:bg-gray-100 dark:border-gray-700/80 dark:bg-gray-900/90 dark:text-white dark:hover:bg-gray-800 lg:hidden",
          sidebarOpen && "hidden"
        )}
        size="sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed left-0 top-0 z-50 flex h-screen max-w-[calc(100vw-2rem)] flex-col border-r border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900",
              "lg:translate-x-0",
              isCollapsed ? "w-20" : "w-72"
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between border-b border-gray-200 dark:border-gray-800 flex-shrink-0",
                isCollapsed ? "p-4" : "p-6"
              )}
            >
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍅</span>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Pomodoro Focus
                  </h2>
                </div>
              )}
              {isCollapsed && (
                <div className="flex justify-center w-full">
                  <span className="text-2xl">🍅</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {!isCollapsed && (
                  <Button
                    onClick={() => setIsCollapsed(true)}
                    variant="ghost"
                    size="sm"
                    className="lg:flex hidden"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => setSidebarOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => {
                if (item.section === "divider") {
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "h-px bg-gray-200 dark:bg-gray-800 my-4",
                        isCollapsed && "mx-2"
                      )}
                    />
                  );
                }

                const isActive = activeSection === item.id;
                const isMainSection = item.section === "main";

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-all",
                      isCollapsed
                        ? "justify-center px-2 py-3"
                        : "gap-3 px-4 py-3 text-left",
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                      isMainSection && "font-medium"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400",
                        isCollapsed ? "flex-shrink-0" : ""
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            {!isCollapsed && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-4">
                {isSessionLoading ? (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt={displayName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                        {userInitial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                )}
                {isSessionLoading ? (
                  <div className="h-9 w-full rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ) : (
                  <Button
                    onClick={handleAuthAction}
                    variant="ghost"
                    size="sm"
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-60"
                    title={authTitle}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang đăng xuất...
                      </>
                    ) : (
                      <>
                        <AuthIcon className="w-4 h-4 mr-2" />
                        {authLabel}
                      </>
                    )}
                  </Button>
                )}
                <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Version 1.0.0
                </div>
              </div>
            )}

            {/* Collapse/Expand Button */}
            {isCollapsed && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0 space-y-2">
                <Button
                  onClick={() => setIsCollapsed(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleAuthAction}
                  variant="ghost"
                  size="sm"
                  disabled={isLoggingOut || isSessionLoading}
                  className="w-full justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-60"
                  title={isLoggingOut ? "Đang đăng xuất..." : authTitle}
                >
                  {isLoggingOut || isSessionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AuthIcon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

