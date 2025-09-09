import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Building2,
  Palette,
  UsersRound,
  Warehouse,
  UserCheck,
  Settings,
  User,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight } from "lucide-react";

const navigationItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/employees", label: "Employees", icon: Users },
  { path: "/clients", label: "Clients", icon: Building2 },
  {
    path: "/design",
    label: "Design",
    icon: Palette,
    hasDropdown: true,
    dropdownItems: [
      { path: "/design/new-projects", label: "New Projects" },
      { path: "/design/design-review", label: "Design Review" },
      { path: "/design/in-revision", label: "In Revision" },
      { path: "/design/hold-projects", label: "Hold Projects" },
      { path: "/design/in-designing", label: "In Designing" },
      { path: "/design/completed", label: "Completed" },
      { path: "/design/canceled", label: "Canceled" },
    ],
  },
  { path: "/teams", label: "Teams", icon: UsersRound },
  {
    path: "/garage",
    label: "Garage",
    icon: Warehouse,
    hasDropdown: true,
    dropdownItems: [
      { path: "/garage/electrical", label: "Electrical" },
      { path: "/garage/structural", label: "Structural" },
      { path: "/garage/requirements", label: "Requirements" },
    ],
  },
  { path: "/members", label: "Members", icon: UserCheck },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (path: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };
  return (
    <div
      className={`${isHovered ? "w-56" : "w-16"} bg-white dark:bg-[#2a2a2a] shadow-sm border-r border-slate-200 dark:border-[#3b3b3b] flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Logo */}
      <div className="flex items-center p-3 pt-4  border-slate-200 dark:border-gray-700">
        <div className="flex items-center gap-1 min-w-0">
          <div className="w-11 h-11  rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-11 h-11 text-white"
              fill="currentColor"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.9 66.9C41.4 262.1 101.3 389.8 237.3 389.8c27.5 0 52.1-3.8 74.3-10.7 29.5 3.8 58.8 7.3 88.8 8.3-202.2-25.2-288.4-192-288.4-192 102.6 144.3 261.4 134.6 261.4 134.6 2.7-136.7-55.3-198.6-162.5-222.6C137.6 88.6 78.4 77 21.9 45.2v21.7z"
                fill="#3AAA35"
              />
              <path
                d="M17.2 182.5c-17.2 59.6-17.4 122.2 6.5 183.4 42.1 107.8 145.6 169.5 266.8 140.3 22.6-5.5 44.1-13.4 64.2-23.3h-39.6c-13.6 3.6-27.9 6.3-43.1 7.7-89.2 8.5-170.9-36.4-211.6-116.2-27.3-52.9-39.6-108.9-47.1-165.5H17.2zM448.7 326.7c-3.2-4.1-6.8-6.6-10.6-7.9 0.5-11.1 0.4-22.2-0.5-33.1-9.1-113.5-72.6-169.1-187.5-194.9-53.3-11.8-109.8-20.5-162.8-37.3C156.7 17.1 248.2-6.4 338.6 17c124.6 32.5 186.1 163.4 142.9 288.5-7 20.2-16.4 38.7-27.6 56.2-15.5-1.4-30.7-3.7-45.2-6.8z"
                fill="#D7DF23"
              />
            </svg>
          </div>
          <span
            className={`text-3xl font-bold text-slate-800 p-2 dark:text-slate-200 transition-all duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100 ml-2" : "opacity-0 w-0 ml-0"
            }`}
          >
            PROOTLY
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 pt-6 space-y-1">
        {navigationItems.map((item) => {
          const isActive =
            location === item.path ||
            (item.hasDropdown &&
              item.dropdownItems?.some((subItem) => location === subItem.path));
          const Icon = item.icon;
          const isDropdownOpen = openDropdowns.includes(item.path);

          // Agar dropdown nahi hai to simple nav item render karo
          if (!item.hasDropdown) {
            const navItem = (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-3 pl-6 rounded-lg font-medium transition-all duration-200 cursor-pointer min-w-0 ${
                    isActive
                      ? "text-[#00a15d] bg-[rgba(0,161,93,0.1)] shadow-lg"
                      : "text-slate-600 dark:text-slate-400 hover:text-[#00a15d] dark:hover:text-gray-50 hover:bg-[rgba(0,161,93,0.1)] dark:hover:bg-[rgba(0,161,93,0.1)]"
                  } ${!isHovered ? "justify-center" : ""}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`transition-all duration-300 whitespace-nowrap ${
                      isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );

            if (!isHovered) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-gray-900 text-white"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return navItem;
          }

          // Dropdown wale items ke liye
          if (!isHovered) {
            // Collapsed state mein dropdown
            return (
              <DropdownMenu key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <div
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer min-w-0 justify-center ${
                          isActive
                            ? "text-[#00a15d] bg-[rgba(0,161,93,0.1)] shadow-lg"
                            : "text-slate-600 dark:text-slate-400 hover:text-[#00a15d] dark:hover:text-gray-50 hover:bg-[rgba(0,161,93,0.1)] dark:hover:bg-[rgba(0,161,93,0.1)]"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </div>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-gray-900 text-white"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent side="right" className="ml-2">
                  {item.dropdownItems?.map((subItem) => (
                    <DropdownMenuItem key={subItem.path} asChild>
                      <Link href={subItem.path}>
                        <span className="w-full">{subItem.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          // Expanded state mein dropdown
          return (
            <div key={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-3 pl-6 rounded-lg font-medium transition-all duration-200 cursor-pointer min-w-0 ${
                  isActive
                    ? "text-[#00a15d] bg-[rgba(0,161,93,0.1)] shadow-lg"
                    : "text-slate-600 dark:text-slate-400 hover:text-[#00a15d] dark:hover:text-gray-50 hover:bg-[rgba(0,161,93,0.1)] dark:hover:bg-[rgba(0,161,93,0.1)]"
                }`}
                onClick={() => toggleDropdown(item.path)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isDropdownOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>

              {/* Dropdown Items */}
              {isDropdownOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.dropdownItems?.map((subItem) => (
                    <Link key={subItem.path} href={subItem.path}>
                      <div
                        className={`flex items-center gap-3 px-3 py-2 pl-8 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                          location === subItem.path
                            ? "text-[#00a15d] bg-[rgba(0,161,93,0.1)]"
                            : "text-slate-500 dark:text-slate-400 hover:text-[#00a15d] hover:bg-[rgba(0,161,93,0.1)]"
                        }`}
                      >
                        {subItem.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
