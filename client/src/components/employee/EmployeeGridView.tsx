import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Briefcase, Building, Star, Calendar, Edit, Trash2 } from "lucide-react";

export default function EmployeeGridView({ employees, handleEdit, handleDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee) => (
        <Card key={employee.id} className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="p-6 bg-slate-50 text-center relative">
            {employee.dp_url ? (
              <img src={employee.dp_url} alt={employee.full_name} className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-white object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-green-500 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-white">
                {employee.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            )}
            <h3 className="font-bold text-lg text-slate-800">{employee.full_name}</h3>
            <p className="text-sm text-slate-500">{employee.job_title || 'N/A'}</p>
            <Badge variant={employee.is_active ? "default" : "secondary"} className={`mt-2 ${employee.is_active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
              {employee.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="p-6 space-y-3 text-sm flex-grow">
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-slate-400" /><span className="truncate">{employee.email}</span></div>
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-slate-400" /><span>{employee.mobile || 'N/A'}</span></div>
            <div className="flex items-center gap-3"><Briefcase className="w-4 h-4 text-slate-400" /><span>{employee.emp_code}</span></div>
            <div className="flex items-center gap-3"><Building className="w-4 h-4 text-slate-400" /><span>{employee.department || 'N/A'}</span></div>
            <div className="flex items-center gap-3"><Star className="w-4 h-4 text-slate-400" /><span>{employee.group_name || 'N/A'}</span></div>
            <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-slate-400" /><span>Joined: {new Date(employee.date_joined).toLocaleDateString()}</span></div>
          </div>
          <div className="p-4 bg-slate-50/50 flex justify-end gap-2">
             <Button size="sm" variant="outline" onClick={() => handleEdit(employee)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
             <Button size="sm" variant="outline" onClick={() => handleDelete(employee)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}