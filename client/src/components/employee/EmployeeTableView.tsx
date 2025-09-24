import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

// Define the Employee type to be used in props
interface Employee {
  id: number;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  is_active: boolean;
  date_joined: string;
  dp_url: string;
}

// Define the type for the component's props
interface TableViewProps {
  employees: Employee[];
  handleEdit: (employee: Employee) => void;
  handleDelete: (employee: Employee) => void;
}

export default function EmployeeTableView({ employees, handleEdit, handleDelete }: TableViewProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">Employee</th>
            <th scope="col" className="px-6 py-3">Details</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Joined On</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {employee.dp_url ? (
                    <img src={employee.dp_url} alt={employee.full_name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                      {employee.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900">{employee.full_name}</div>
                    <div className="text-slate-500">{employee.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium">{employee.job_title || 'N/A'}</div>
                <div className="text-slate-500">{employee.department || 'N/A'}</div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={employee.is_active ? "default" : "secondary"} className={employee.is_active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}>
                  {employee.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-6 py-4">{new Date(employee.date_joined).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(employee)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(employee)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}