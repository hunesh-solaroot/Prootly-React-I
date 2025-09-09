import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function Members() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
      </div>

      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Member Directory</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Comprehensive member management and directory. Features coming soon include member profiles, 
            access controls, role assignments, and membership analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
