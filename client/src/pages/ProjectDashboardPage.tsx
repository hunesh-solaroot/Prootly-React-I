import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useRoute } from "wouter";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  MessageSquare,
  Paperclip,
  Play,
  Pause,
  CheckSquare,
  MoreHorizontal,
  Send,
  Phone,
  Mail,
  X,
  PanelRightClose,
  PanelRightOpen,
  GripVertical,
  Download,
  Smile , UploadCloud, File as FileIcon, Trash2 , FileCheck , BrainCircuit
} from "lucide-react";
import { mockApiService } from "../services/mockApiService";
import EmojiPicker from "emoji-picker-react";
import AshiyaLogo from "../image/Ashiya-logo-3.png";

// Type definitions for props
type ProfileProps = {
  name: string;
  role: string;
  address: string;
  imageUrl: string;
  projectData?: ProjectData;
};

type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  active?: boolean;
};

type CommentProps = {
  author: string;
  role: string;
  timestamp: string;
  content: string;
  avatar: string;
};

type TimelineItemProps = {
  title: string;
  active?: boolean;
  children?: React.ReactNode;
};

type ProjectData = {
  id: string;
  customer?: {
    name: string;
    type: string;
    address: string;
    color?: string;
    initials?: string;
    state?: string;
  };
  status?: string;
  progress?: number;
  budget?: number;
  timeline?: string;
  moduleCount?: number;
  moduleType?: string;
  efficiency?: string;
  inverterType?: string;
  powerRating?: string;
  warranty?: string;
  assignedEngineer?: string;
  startTime?: string;
  endTime?: string;
  totalHours?: string;
  holdTime?: number;
  qualityAnalyst?: string;
  qualityPhase?: string;
  teamLead?: string;
  installationDate?: string;
  crewSize?: number;
  inspector?: string;
  inspectionStatus?: string;
  nextMilestone?: string;
};

// Main Dashboard Component to be used as a modal/overlay - FIXED VERSION
const ProjectDashboardPage: React.FC = () => {
  const [, params] = useRoute("/project-dashboard/:id");
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!params?.id) {
        setError("No project ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await mockApiService.getNewProjects();
        const project = response.data.find((p) => p.id === params.id);
        if (project) {
          setProjectData(project);
        } else {
          setError("Project not found.");
        }
      } catch (err) {
        setError("Failed to fetch project data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.id]);

  const toggleTimeline = () => {
    setIsTimelineExpanded((prev) => !prev);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading project...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!projectData) {
    return <div className="p-8 text-center text-gray-500">Project not found.</div>;
  }

  return (
    // KEY FIX 1: Add fixed height container
    <div className="bg-gray-200 text-white font-sans w-full h-screen overflow-hidden">
      <div className="relative bg-gray-200 text-white font-sans rounded-lg shadow-xl w-full h-full overflow-hidden flex">
        {/* KEY FIX 2: Add height constraint and min-h-0 to grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 w-full h-full min-h-0">
          <Sidebar projectData={projectData} />
          <div
            className={`transition-all duration-300 min-h-0 ${isTimelineExpanded ? "lg:col-span-6" : "lg:col-span-8"}`}
          >
            <MainContent projectData={projectData} />
          </div>
          <div
            className={`transition-all duration-300 min-h-0 ${isTimelineExpanded ? "lg:col-span-3" : "lg:col-span-1"}`}
          >
            <Timeline
              projectData={projectData}
              isExpanded={isTimelineExpanded}
              onToggle={toggleTimeline}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Left Sidebar Component
const Sidebar: React.FC<{ projectData?: ProjectData }> = ({ projectData }) => {
  return (
    <aside className="lg:col-span-3 bg-gray-800 rounded-lg p-6 flex flex-col overflow-hidden h-full">
      {/* Fixed Profile Section */}
      <div className="flex-shrink-0 mb-6">
        <Profile
          name={projectData?.customer?.name || "Adam Golightly"}
          role={projectData?.customer?.type || "Residential"}
          address={
            projectData?.customer?.address ||
            "1007 Main St, Phoenix, CJ 85033, USA"
          }
          imageUrl=""
          initials={projectData?.customer?.initials || "AG"}
          projectData={projectData}
        />
      </div>

      {/* Scrollable InfoSections */}
      <div
        className="flex-grow overflow-y-auto space-y-6"
        style={{
          scrollbarWidth: "none",
          scrollbarColor: "#4b5563 #1f2937",
        }}
      >
        <InfoSection title="Homeowner Information" initiallyOpen>
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <span className="font-semibold text-gray-200">Type</span>
              <br />
              {projectData?.customer?.type || "Residential"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">State</span>
              <br />
              {projectData?.customer?.state || "CJ"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Status</span>
              <br />
              {projectData?.status || "IN PROGRESS"}
            </p>
          </div>
        </InfoSection>

        <InfoSection title="Project Information">
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <span className="font-semibold text-gray-200">Budget</span>
              <br />
              {projectData?.budget
                ? `${projectData.budget.toLocaleString()}`
                : "Not set"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Progress</span>
              <br />
              {projectData?.progress ? `${projectData.progress}%` : "0%"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Timeline</span>
              <br />
              {projectData?.timeline || "Not set"}
            </p>
          </div>
        </InfoSection>

        <InfoSection title="Module Information">
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <span className="font-semibold text-gray-200">Module Type</span>
              <br />
              {projectData?.moduleType || "Mission Solar 400W"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Count</span>
              <br />
              {projectData?.moduleCount || "8"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Efficiency</span>
              <br />
              {projectData?.efficiency || "20.5%"}
            </p>
          </div>
        </InfoSection>

        <InfoSection title="Inverter Information">
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <span className="font-semibold text-gray-200">Type</span>
              <br />
              {projectData?.inverterType || "Enphase IQ 8+"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Power Rating</span>
              <br />
              {projectData?.powerRating || "8-9 kW"}
            </p>
            <p>
              <span className="font-semibold text-gray-200">Warranty</span>
              <br />
              {projectData?.warranty || "25 years"}
            </p>
          </div>
        </InfoSection>

        <InfoSection title="Extra Information Section 1">
          <p className="text-sm text-gray-400">
            More details to demonstrate scrolling.
          </p>
        </InfoSection>

        <InfoSection title="Extra Information Section 2">
          <p className="text-sm text-gray-400">
            More details to demonstrate scrolling.
          </p>
        </InfoSection>
      </div>
    </aside>
  );
};

// Updated Profile Component - horizontal layout like image 2
const Profile: React.FC<ProfileProps & { initials: string }> = ({
  name,
  role,
  address,
  imageUrl,
  initials,
  projectData,
}) => {
  const convertToCSV = (data: any) => {
    if (!data) return "";
    const headers = Object.keys(data);
    const rows = headers.map(header => {
      if (typeof data[header] === 'object' && data[header] !== null) {
        return JSON.stringify(data[header]);
      }
      return data[header];
    });
    return [headers.join(','), rows.join('\n')].join('\n');
  };

  const downloadCSV = () => {
    if (!projectData) return;
    const csv = convertToCSV(projectData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectData.customer?.name || 'project'}_data.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Red square with initials */}
      <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
        {initials}
      </div>

      {/* Name and details */}
      <div className="flex-1 pt-1">
        <div className="text-xl font-semibold text-white">
          {name}
        </div>
        <p className="text-sm text-gray-400">{role}</p>
        <p className="text-sm text-gray-500">{address}</p>
        <div className="flex space-x-3 mt-4">
          <button className="bg-green-500 hover:bg-green-600 p-3 rounded-full transition-colors">
            <Phone size={18} />
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full transition-colors" onClick={downloadCSV}>
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Collapsible Info Section for Sidebar
const InfoSection: React.FC<{
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  active?: boolean;
}> = ({ title, children, initiallyOpen = false, active = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div
      className={`rounded-lg transition-all duration-300 ${isOpen ? (active ? "bg-green-600" : "bg-green-600") : "bg-gray-900"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center text-left font-semibold p-4 ${isOpen && active ? "text-white" : ""}`}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div
          className={`p-4 border-t ${active ? "border-green-500 bg-gray-800" : "border-gray-600 bg-gray-800"} rounded-b-lg`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Ashiya AI Icon Component
const AshiyaIcon: React.FC<{ size: number }> = ({size }) => (
   <img src={AshiyaLogo} alt="Ashiya AI Logo" width={size} height={size} />
);

// Main Content Area Component - COMPLETELY FIXED VERSION
const MainContent: React.FC<{ projectData?: ProjectData }> = ({
  projectData,
}) => {
  const [comments, setComments] = useState<CommentProps[]>([
    {
      author: "Task Assigner",
      role: "Solaroof",
      timestamp: "August 10, 2025 at 09:00 AM",
      avatar: "T",
      content: "INVERTER: Enphase Energy Inc. IQ 8+ 8-9 PACKING: Enbridge XR10 1 MODULE: Mission Solar 400 8 Main Breaker: See attached plans Busbar: See attached plans Roof: S Tile 2-H-24 Truss. These panels are going on a new construction add-on unit (ADU) and those plans are attached. Please put them south facing on the ADU. Please let me know if you have any questions or need additional information.",
    },
    {
      author: "Jeffrey Rodriguez",
      role: "Homeowner",
      timestamp: "August 10, 2025 at 11:30 AM",
      avatar: "J",
      content: "Thanks for the update! The plans look good. Just confirming, will the crew need access to the main house panel during the installation?",
    },
  ]);

  const addComment = (newComment: CommentProps) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const [activeTab, setActiveTab] = useState("Comments");

  return (
    // KEY FIX 3: Remove lg:col-span-6 since it's now in parent, ensure proper height constraints
    <main className="bg-gray-800 rounded-lg p-6 flex flex-col h-full min-h-0">
      {/* Fixed header */}
      <div className="flex-shrink-0">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* KEY FIX 4: Proper scrollable content area with height constraints */}
      <div className="flex-1 min-h-0 my-6">
        <div 
          className="h-full overflow-y-auto space-y-6 pr-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4b5563 #1f2937",
          }}
        >
          {activeTab === "Comments" && (
            <>
              {comments.map((comment, index) => (
                <Comment
                  key={index}
                  author={comment.author}
                  role={comment.role}
                  timestamp={comment.timestamp}
                  avatar={comment.avatar}
                  content={comment.content}
                />
              ))}
            </>
          )}

          {activeTab === "Attachments" && (
            <Attachments />
          )}

          {activeTab === "Revision" && (
            <div className="p-4 text-gray-400">Revision content goes here.</div>
          )}
          {activeTab === "Hold" && (
            <div className="p-4 text-gray-400">Hold content goes here.</div>
          )}
          {activeTab === "Unhold" && (
            <div className="p-4 text-gray-400">Unhold content goes here.</div>
          )}
          {activeTab === "Checklist" && (
            <Checklist />
          )}
          {activeTab === "Ashiya AI" && (
            <AshiyaAI projectData={projectData} />
          )}
        </div>
      </div>
      
      {/* Fixed footer - only show for Comments tab */}
      {activeTab === "Comments" && (
        <div className="flex-shrink-0 mt-auto">
          <MessageInput projectData={projectData} addComment={addComment} />
        </div>
      )}
    </main>
  );
};

// Tabs Component for Main Content
const Tabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "Comments", icon: MessageSquare },
    { name: "Attachments", icon: Paperclip },
    { name: "Revision", icon: Edit2, count: 0 },
    { name: "Hold", icon: Pause, count: 0 },
    { name: "Unhold", icon: Play, count: 0 },
    { name: "Checklist", icon: CheckSquare },
    { name: 'Ashiya AI', icon: AshiyaIcon, size: 50 }
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-700 pb-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.name
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <tab.icon size={tab.size || 20} />
          <span>{tab.name}</span>
          {tab.count !== undefined && (
            <span className="text-xs bg-gray-600 rounded-full px-2 py-0.5">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Comment Component - FIXED VERSION
const Comment: React.FC<CommentProps> = ({
  author,
  role,
  timestamp,
  content,
  avatar,
}) => {
  return (
    <div className="flex gap-4 flex-shrink-0">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl ${avatar === "T" ? "bg-purple-600" : "bg-blue-600"}`}
      >
        {avatar}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{author}</span>
          <span className="text-xs text-gray-500">({role})</span>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg mt-2 max-h-48 overflow-y-auto" 
             style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 #1f2937" }}>
          <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">{content}</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">{timestamp}</p>
      </div>
    </div>
  );
};

// Message Input Component
const MessageInput: React.FC<{ projectData?: ProjectData; addComment: (newComment: CommentProps) => void }> = ({ projectData, addComment }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newComment: CommentProps = {
        author: "Current User", // Placeholder, ideally from user context
        role: "User", // Placeholder
        timestamp: new Date().toLocaleString(), // Current timestamp
        content: message.trim(),
        avatar: "CU", // Placeholder
      };
      addComment(newComment);
      setMessage(""); // Clear the input after sending
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("Selected file:", file.name);
      // Here you would typically upload the file
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Close picker after selecting emoji
  };

  const handleMailButtonClick = () => {
    console.log("Mail button clicked. Opening mail client.");
    const recipient = "example@example.com"; // Placeholder
    const subject = `Regarding Project: ${projectData?.customer?.name || "Unknown Project"}`;
    const body = `Hello, 

Regarding project ${projectData?.id || ""}, 

`;
    window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="flex-shrink-0">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <textarea
          className="w-full bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none resize-none"
          rows={3}
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            {/* File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} />
            </button>

            {/* Emoji Picker Button */}
            <div className="relative">
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <Smile size={20} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 z-10"> {/* Added z-10 for stacking context */}
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>

            {/* Mail Button */}
            <button className="text-gray-400 hover:text-white" onClick={handleMailButtonClick}>
              <Mail size={20} />
            </button>
          </div>
          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
            onClick={handleSendMessage}
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Attachments Component
const Attachments: React.FC = () => {
    return (
        <div className="space-y-6"> {/* Reduced from space-y-8 to space-y-6 */}
            <FileUploadSection title="Proposal Design Files" description="No design files available." />
            <FileUploadSection title="Site Survey Attachments" description="No site survey attachments available." />
            <FileUploadSection title="Delivered Project Attachments" description="delivered files not available." />
        </div>
    );
};

const FileUploadSection: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
            e.dataTransfer.clearData();
        }
    }, [setFiles, setIsDragging]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const removeFile = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold text-xl">
                <UploadCloud size={20} />
            </div>
            <div className="flex-grow">
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{title}</span>
                    <span className="text-xs text-gray-500">({files.length > 0 ? `${files.length} file(s)` : 'No files available'})</span>
                </div>
                <div className="bg-gray-900 rounded-lg mt-2 p-4">
                    <div 
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-green-500 bg-gray-700/50' : 'border-gray-600'}`}
                    >
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            id={`file-upload-${title.replace(/\s+/g, '-')}`}
                        />
                        <label htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`} className="cursor-pointer">
                            <p className="text-sm text-gray-300">{description}</p>
                            <p className="text-xs text-gray-500 mt-1">Drag & drop files here or click to browse</p>
                        </label>
                    </div>
                    
                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                        <FileIcon size={16} className="text-gray-400" />
                                        <span className="text-sm">{file.name}</span>
                                    </div>
                                    <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Checklist Component
const Checklist: React.FC = () => {
    const ahjItems = [
        { label: 'PE Stamp Type', value: 'None' },
        { label: 'Online/Offline Mode', value: 'Offline' },
        { label: 'Requirements', value: 'None' },
        { label: 'Updates', value: 'None' },
    ];

    const utilityItems = [
        { label: 'Online/Offline Mode', value: 'UnKnown' },
        { label: '10 Feet Callout', value: 'NO' },
        { label: 'PV Meter', value: 'NO' },
        { label: 'UM and ACD Callout Value', value: 'None' },
        { label: 'Interconnection', value: 'None' },
        { label: 'Requirements', value: 'NA' },
        { label: 'Updates', value: 'NA' },
    ];

    return (
        <>
            <ChecklistSection title="AHJ" items={ahjItems} />
            <ChecklistSection title="Utility" items={utilityItems} />
        </>
    );
};

const ChecklistSection: React.FC<{ title: string; items: { label: string; value: string }[] }> = ({ title, items }) => {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                <CheckSquare size={20} />
            </div>
            <div className="flex-grow">
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{title}</span>
                    <span className="text-xs text-gray-500">({items.length} items)</span>
                </div>
                <div className="bg-gray-900 rounded-lg mt-2 p-4 max-h-96 overflow-y-auto" 
                     style={{
                         scrollbarWidth: "none",
                         scrollbarColor: "#4b5563 #1f2937",
                     }}>
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <ChecklistItem key={index} label={item.label} value={item.value} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// UPDATED ChecklistItem component with a custom toggle switch
const ChecklistItem: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="flex justify-between items-center pb-2 border-b border-gray-700 last:border-b-0">
            <p>
                {label}: <span className="font-bold text-white">{value}</span>
            </p>
            <button
                onClick={() => setIsChecked(!isChecked)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 ${
                    isChecked ? 'bg-green-500' : 'bg-gray-600'
                }`}
                aria-pressed={isChecked}
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                        isChecked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};

// Ashiya AI Component - Connected to Backend
const AshiyaAI: React.FC<{ projectData?: ProjectData }> = ({ projectData }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ type: 'user' | 'ai'; text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projectContext, setProjectContext] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [input]);

    // Set project context when projectData changes
    React.useEffect(() => {
        if (projectData?.customer?.name) {
            setProjectContext(projectData.customer.name);
            // Optionally auto-set context in backend
            fetch('http://localhost:5000/set_project_context', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: projectData.id,
                    customer_name: projectData.customer.name
                })
            }).catch(console.error);
        }
    }, [projectData]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        // Add timeout for faster error handling
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            setMessages(prev => [...prev, { 
                type: 'ai', 
                text: 'Request timed out. The AI might be processing a large query. Please try a shorter question.' 
            }]);
        }, 30000); // 30 second timeout

        try {
            const controller = new AbortController();
            const timeoutSignal = setTimeout(() => controller.abort(), 25000); // 25 second abort

            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    stream: false
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutSignal);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev, { type: 'ai', text: data.response || 'No response received' }]);
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                console.log('Request aborted due to timeout');
                setMessages(prev => [...prev, { 
                    type: 'ai', 
                    text: 'Request took too long. Try asking a more specific question about the current project.' 
                }]);
            } else {
                console.error('Error sending message:', error);
                setMessages(prev => [...prev, { 
                    type: 'ai', 
                    text: 'Sorry, I encountered an error. Please make sure the Ashiya server is running on port 5000.' 
                }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f7fbe1] rounded-lg text-gray-800">
            {/* Fixed Welcome Message Header */}
            <div className="flex-shrink-0 p-4 pb-2">
                <h2 className="text-xl font-bold text-[#38b349]">
                    Hi, I'm Ashiya, your Solar PV Permit Review Assistant!
                </h2>
                {projectContext ? (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-[#38b349] font-semibold text-xs">
                            🎯 Project Context Set: {projectContext}
                        </p>
                        <p className="text-[#7b8b48] text-xs mt-1">
                            I'm ready to answer questions about this specific project!
                        </p>
                    </div>
                ) : (
                    <p className="text-[#7b8b48] mt-2 text-xs">
                        💡 <strong>Tip:</strong> Click on a customer name in the projects table to set project context, or ask me general solar questions.
                    </p>
                )}
            </div>

            {/* Scrollable content area with proper height constraints */}
            <div className="flex-1 flex flex-col min-h-0 px-4">
                <div 
                    className="flex-1 overflow-y-auto space-y-3 min-h-0 py-2"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#38b349 #e5e7eb"
                    }}
                >
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-2xl max-w-sm text-sm ${msg.type === 'user' ? 'bg-[#259726] text-white rounded-br-none' : 'bg-white text-[#259726] rounded-bl-none shadow'}`}>
                            <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-[#259726] rounded-2xl rounded-bl-none shadow p-2">
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#259726]"></div>
                                <span className="text-sm">Ashiya is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Fixed Input Section */}
            <div className="flex-shrink-0 p-3 border-t border-[#d6e029]">
                <div className="bg-white rounded-2xl p-3 mb-2 shadow-inner">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about projects, customers, or solar topics..."
                        className="w-full bg-transparent text-[#38b349] placeholder-[#a7b86b] focus:outline-none resize-none overflow-y-auto max-h-20 text-sm"
                        disabled={isLoading}
                        rows={1}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        <button 
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-[#38b349] hover:bg-gray-100 shadow disabled:opacity-50 text-xs"
                            onClick={() => setInput("Run QA check on current project")}
                            disabled={isLoading}
                        >
                            <FileCheck size={12} />
                            <span className="font-medium">QA Check</span>
                        </button>
                        <button 
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-[#38b349] hover:bg-gray-100 shadow disabled:opacity-50 text-xs"
                            onClick={() => setInput("Switch to advanced assistant mode")}
                            disabled={isLoading}
                        >
                            <BrainCircuit size={12} />
                            <span className="font-medium">Assistant</span>
                        </button>
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#38b349] hover:bg-[#259726] shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Right Timeline Component
const Timeline: React.FC<{
  projectData?: ProjectData;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ projectData, isExpanded, onToggle }) => {
  // This array is for the collapsed view
  const milestones = [
    { name: "Quality Analyst", short: "M1", active: false },
    { name: "Production Engineer", short: "M2", active: true },
    { name: "Permitting", short: "M3", active: false },
    { name: "Installation", short: "M4", active: false },
    { name: "Inspection", short: "M5", active: false },
    { name: "Completion", short: "M6", active: false },
  ];

  return (
    <aside className="lg:col-span-3 bg-gray-800 rounded-lg p-6 flex flex-col overflow-hidden h-full">
      {/* Fixed Timeline Header with Toggle Button */}
      <div className="flex-shrink-0 mb-6 flex items-center justify-between">
        {isExpanded && <h3 className="text-xl font-bold">Project Timeline</h3>}
        <button
          onClick={onToggle}
          className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white mr-5 transition-colors ml-auto"
          aria-label="Toggle timeline"
        >
          {isExpanded ? (
            <PanelRightClose size={20} />
          ) : (
            <PanelRightOpen size={20} />
          )}
        </button>
      </div>

      {/* Conditionally rendered scrollable content */}
      <div
        className="flex-grow overflow-y-auto space-y-4"
        style={{
          scrollbarWidth: "none",
          scrollbarColor: "#4b5563 #1f2937",
        }}
      >
        {isExpanded ? (
          // Expanded View: Your original detailed list
          <>
            <TimelineItem title="Quality Analyst">
              <p className="text-sm text-gray-400">
                {projectData?.qualityAnalyst || "No analyst assigned yet."}
              </p>
            </TimelineItem>
            <TimelineItem title="Production Engineer" active>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {projectData?.assignedEngineer?.charAt(0) || "R"}
                  </div>
                  <span>{projectData?.assignedEngineer || "Ranu ."}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-gray-200">Start Time</p>
                    <p className="text-gray-400">
                      {projectData?.startTime || "--"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">End Time</p>
                    <p className="text-gray-400">
                      {projectData?.endTime || "--"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-200">
                    Internal Hold Time ({projectData?.holdTime || 0})
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-200">Total Hours</p>
                  <p className="text-gray-400">
                    {projectData?.totalHours || "--"}
                  </p>
                </div>
              </div>
            </TimelineItem>
            <TimelineItem title="Permitting">
              <p className="text-sm text-gray-400">
                {projectData?.inspectionStatus || "Awaiting city approval."}
              </p>
            </TimelineItem>
            <TimelineItem title="Installation">
              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  <span className="font-semibold text-gray-200">Date</span>
                  <br />
                  {projectData?.installationDate || "Scheduled for next month"}
                </p>
                {projectData?.crewSize && (
                  <p>
                    <span className="font-semibold text-gray-200">
                      Crew Size
                    </span>
                    <br />
                    {projectData.crewSize} members
                  </p>
                )}
                {projectData?.inspector && (
                  <p>
                    <span className="font-semibold text-gray-200">
                      Inspector
                    </span>
                    <br />
                    {projectData.inspector}
                  </p>
                )}
              </div>
            </TimelineItem>
          </>
        ) : (
          // Collapsed View: The compact milestone list
          <div className="flex flex-col items-center space-y-4">
            {milestones.map((m) => (
              <div
                key={m.short}
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${m.active ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"}`}
              >
                {m.short}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

// Collapsible Timeline Item Component
const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  active = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(active);

  return (
    <div
      className={`rounded-lg transition-all duration-300 ${isOpen ? (active ? "bg-green-600" : "bg-green-600") : "bg-gray-900"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center text-left font-semibold p-4 ${isOpen && active ? "text-white" : ""}`}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div
          className={`p-4 border-t ${active ? "border-green-500 bg-gray-800" : "border-gray-600 bg-gray-800"} rounded-b-lg`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ProjectDashboardPage;