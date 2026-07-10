import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

import aideLogo from "@/assets/aide-logo.png";
import iconHome from "@/assets/icon-home.png";
import iconAssessment from "@/assets/icon-assessment.png";
import iconResources from "@/assets/icon-resources.png";
import iconTasks from "@/assets/icon-tasks.png";
import iconAnalytics from "@/assets/icon-analytics.png";
import supportWoman from "@/assets/support-woman.jpg";
import { SupportModal } from "./SupportModal";

interface SidebarProps {
  showTasksAndResources?: boolean;
}

export const Sidebar = ({ showTasksAndResources = false }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: "Home", icon: iconHome, path: "/dashboard" },
    ...(showTasksAndResources
      ? [
          { label: "Assessment", icon: iconAssessment, path: "/assessment" },
          { label: "Resources", icon: iconResources, path: "/resources" },
          { label: "Tasks", icon: iconTasks, path: "/tasks" },
          { label: "Analytics", icon: iconAnalytics, path: "/analytics" },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between fixed left-0 top-0 w-[14vw] min-w-[200px] max-w-[240px] h-screen bg-background text-black z-40 shadow-md flex-shrink-0">
        {/* Top: Logo + Menu */}
        <div className="flex flex-col pt-4 px-4.1 gap-10">
          <Link to="/dashboard">
            <img
              src={aideLogo}
              alt="AIDE Logo"
              className="w-[8vw] min-w-[100px] max-w-[140px] h-auto object-contain cursor-pointer"
            />
          </Link>

          <nav className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 text-[1vw] min-text-sm max-text-lg font-normal font-sans hover:opacity-80 transition-opacity",
                  isActive(item.path) ? "font-bold text-black" : "text-black/70"
                )}
                style={{ fontSize: "clamp(14px, 1.1vw, 18px)" }}
              >
                <img src={item.icon} alt={item.label} className="w-[1.5vw] min-w-[20px] max-w-[26px] h-[1.5vw] min-h-[20px] max-h-[26px]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom: Support Button */}
        <button
          onClick={() => setSupportModalOpen(true)}
          className="flex items-center gap-3 p-3 cursor-pointer hover:opacity-80 transition-opacity mx-4 mb-4 bg-transparent border-none"
        >
          <img
            src={supportWoman}
            alt="Support"
            className="w-[2.5vw] min-w-[36px] max-w-[44px] h-[2.8vw] min-h-[40px] max-h-[50px] rounded-full object-cover"
          />
          <span 
            className="font-normal font-sans text-black"
            style={{ fontSize: "clamp(14px, 1.2vw, 20px)" }}
          >
            Support
          </span>
        </button>

        <SupportModal open={supportModalOpen} onOpenChange={setSupportModalOpen} />
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 w-[16rem] h-screen bg-background text-black z-40 p-6 flex flex-col justify-between">
            <Link to="/dashboard">
              <img
                src={aideLogo}
                alt="AIDE Logo"
                className="w-[10.4rem] h-[8.25rem] object-contain cursor-pointer mb-4"
              />
            </Link>

            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 text-[1.3rem] font-normal font-sans hover:opacity-80 transition-opacity",
                    isActive(item.path) ? "font-bold text-black" : "text-black/70"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <img src={item.icon} alt={item.label} className="w-[1.875rem] h-[1.875rem]" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => {
                setSupportModalOpen(true);
                setIsOpen(false);
              }}
              className="flex items-center gap-4 p-4 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none"
            >
              <img
                src={supportWoman}
                alt="Support"
                className="w-[2.875rem] h-[3.25rem] rounded-full object-cover"
              />
              <span className="text-[1.5rem] font-normal font-sans text-black">
                Support
              </span>
            </button>
          </aside>
        </>
      )}
    </>
  );
};
