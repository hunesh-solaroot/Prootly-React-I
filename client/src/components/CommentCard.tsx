import { Comment } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-orange-500 to-red-500",
      "from-blue-500 to-indigo-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-orange-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200">
      <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(comment.author)} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
        {getInitials(comment.author)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-slate-800">{comment.author}</span>
          {comment.company && (
            <span className="text-slate-500">{comment.company}</span>
          )}
        </div>
        <p className="text-slate-600 text-sm mb-2">{comment.text}</p>
        <span className="text-xs text-slate-400">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
