import { Card, CardContent } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function Garage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Garage</h1>
      </div>

      <Card className="bg-white shadow-sm border dark:bg-[#202020] dark:border-[#202020] border-slate-200">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Warehouse className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Garage & Storage</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Equipment and inventory management for renewable energy projects. Features coming soon include 
            equipment tracking, maintenance schedules, and storage location management.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
