import { useState, useEffect, useRef } from "react";
import { Search, User, Building2, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Employee, Client, Project } from "@shared/schema";
import { Link } from "wouter";

interface SearchResult {
  type: 'employee' | 'client' | 'project';
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

interface GlobalSearchProps {
  className?: string;
}

export default function GlobalSearch({ className }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
    enabled: debouncedQuery.length > 0,
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: debouncedQuery.length > 0,
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: debouncedQuery.length > 0,
  });

  const searchResults: SearchResult[] = [];

  if (debouncedQuery.length > 0) {
    const lowerQuery = debouncedQuery.toLowerCase();

    // Search employees
    employees?.forEach(emp => {
      if (emp.name.toLowerCase().includes(lowerQuery) || 
          emp.email.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          type: 'employee',
          id: emp.id,
          title: emp.name,
          subtitle: emp.email,
          path: '/employees'
        });
      }
    });

    // Search clients
    clients?.forEach(client => {
      if (client.companyName.toLowerCase().includes(lowerQuery) || 
          client.contactPerson.toLowerCase().includes(lowerQuery) ||
          client.email.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          type: 'client',
          id: client.id,
          title: client.companyName,
          subtitle: client.contactPerson,
          path: '/clients'
        });
      }
    });

    // Search projects
    projects?.forEach(project => {
      if (project.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          type: 'project',
          id: project.id,
          title: project.name,
          subtitle: `Status: ${project.status}`,
          path: '/'
        });
      }
    });
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'employee':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'client':
        return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'project':
        return <FolderOpen className="w-4 h-4 text-green-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleResultClick = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search employees, clients, projects..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 py-7 w-[640px]  bg-gray-200 dark:bg-[#161717] rounded-full text-slate-900 dark:text-slate-100"
        />
      <Search className="absolute py-2px left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length > 0 || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.slice(0, 8).map((result, index) => (
                <Link key={`${result.type}-${result.id}`} href={result.path}>
                  <a
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                    onClick={handleResultClick}
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                      {result.type}
                    </span>
                  </a>
                </Link>
              ))}
              {searchResults.length > 8 && (
                <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-gray-700">
                  Showing first 8 of {searchResults.length} results
                </div>
              )}
            </div>
          ) : debouncedQuery.length > 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{debouncedQuery}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}