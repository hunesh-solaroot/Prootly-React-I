import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function Design() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Design</h1>
      </div>

      <Card className="bg-white shadow-sm border border-slate-200">
        <CardContent className="p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Palette className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Design Module</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            This section will contain design tools and templates for renewable energy projects. 
            Features coming soon include project blueprints, solar array designs, and technical drawings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
