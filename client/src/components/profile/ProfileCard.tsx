import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Edit, User } from "lucide-react";
import { EmployeeProfile } from "../../../../shared/types";
import GradeBadge from "./GradeBadge";

interface ProfileCardProps {
  profile: EmployeeProfile;
  onEditClick: () => void;
  onImageClick: () => void;
  animatedScore: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onEditClick, 
  onImageClick, 
  animatedScore 
}) => {
  return (
    <Card className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4 relative">
          <div 
            className="relative cursor-pointer group"
            onClick={onImageClick}
            data-testid="profile-image-trigger"
          >
            <Avatar className="w-28 h-28 border-4 border-white dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <AvatarImage src={profile.profilePicture || ""} />
              <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-300 flex items-center justify-center">
              <Camera className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="profile-name">
            {profile.fullName}
          </h2>
          <p className="text-blue-600 dark:text-blue-400 font-semibold" data-testid="profile-designation">
            {profile.designation}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium" data-testid="profile-department">
            {profile.department}
          </p>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEditClick}
            className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            data-testid="edit-profile-button"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Performance Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <User className="h-5 w-5 text-blue-500 animate-pulse" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Performance Score</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4">
              <span 
                className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-all duration-300"
                data-testid="performance-score"
              >
                {animatedScore}/100
              </span>
              <GradeBadge score={profile.performanceScore} />
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                style={{ width: `${animatedScore}%` }}
                data-testid="performance-progress"
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="projects-count">
              {profile.projectsCompleted}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projects</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="team-size">
              {profile.teamSize}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Team Size</p>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-200 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 transition-all duration-200"
                  data-testid={`skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;