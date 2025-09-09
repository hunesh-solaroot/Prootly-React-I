import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema, insertClientSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter required" });
      }
      const employees = await storage.searchEmployees(query);
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Failed to search employees" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const result = insertEmployeeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid employee data" });
      }
      const employee = await storage.createEmployee(result.data);
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = insertEmployeeSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid employee data" });
      }
      const employee = await storage.updateEmployee(id, result.data);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEmployee(id);
      if (!deleted) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter required" });
      }
      const clients = await storage.searchClients(query);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to search clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const result = insertClientSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid client data" });
      }
      const client = await storage.createClient(result.data);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = insertClientSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid client data" });
      }
      const client = await storage.updateClient(id, result.data);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/stats", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const total = projects.length;
      const completed = projects.filter(p => p.status === "completed").length;
      const hold = projects.filter(p => p.status === "hold").length;
      const newProjects = projects.filter(p => p.status === "new").length;
      const revision = projects.filter(p => p.status === "revision").length;

      res.json({
        total,
        completed: {
          count: completed,
          percentage: total > 0 ? ((completed / total) * 100).toFixed(2) + "%" : "0%"
        },
        hold: {
          count: hold,
          percentage: total > 0 ? ((hold / total) * 100).toFixed(2) + "%" : "0%"
        },
        new: {
          count: newProjects,
          percentage: total > 0 ? ((newProjects / total) * 100).toFixed(2) + "%" : "0%"
        },
        revision: {
          count: revision,
          percentage: total > 0 ? ((revision / total) * 100).toFixed(2) + "%" : "0%"
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project statistics" });
    }
  });

  // New Projects Data API (mock endpoint)
  app.get("/api/new-projects-data", async (req, res) => {
    try {
      // Mock data matching the screenshots provided
      const mockProjects = [
        {
          id: "1",
          customer: {
            name: "Adam Golightly",
            address: "262 W Roosevelt Ave, Phoenix, AZ",
            initials: "AG",
            color: "#10B981" // green
          },
          projectDetails: "PV+Battery",
          keyDates: {
            created: "14 Nov 25 | 04:38 AM",
            received: "31 Dec 20 | 11:24 PM"
          },
          status: "IN PROGRESS",
          assignedTo: null,
          countdown: "02:00:00",
          autoComplete: "Auto-Complete",
          priority: "HIGH"
        },
        {
          id: "2",
          customer: {
            name: "00000000000",
            address: "SQXE+7 Rutherford, CA, USA",
            initials: "AA",
            color: "#F59E0B" // amber
          },
          projectDetails: "PV",
          keyDates: {
            created: "09 Jul 25 | 10:35 PM",
            received: "04 Nov 24 | 02:10 PM"
          },
          status: "IN PROGRESS",
          assignedTo: null,
          countdown: "02:00:00",
          autoComplete: "Auto-Complete",
          priority: "HIGH"
        },
        {
          id: "3",
          customer: {
            name: "Richard Prager",
            address: "1200 Chestnut St, San Jose, CA 95125, USA",
            initials: "RP",
            color: "#10B981" // green
          },
          projectDetails: "PV+Battery",
          keyDates: {
            created: "23 Nov 25 | 03:54 AM",
            received: "04 Nov 24 | 05:46 AM"
          },
          status: "IN PROGRESS",
          assignedTo: null,
          countdown: "02:00:00",
          autoComplete: "Auto-Complete",
          priority: "HIGH"
        },
        {
          id: "4",
          customer: {
            name: "Sandra Clark",
            address: "6019 Busch Blvd, Columbus, GA 31907, USA",
            initials: "SC",
            color: "#0EA5E9" // blue
          },
          projectDetails: "PV",
          keyDates: {
            created: "03 Jun 25 | 02:31 AM",
            received: "03 Jun 25 | 02:31 AM"
          },
          status: "IN PROGRESS",
          assignedTo: null,
          countdown: "02:00:00",
          autoComplete: "Auto-Complete",
          priority: "HIGH"
        },
        {
          id: "5",
          customer: {
            name: "11111111",
            address: "Residential, San Francisco, CA",
            initials: "11",
            color: "#06B6D4" // cyan
          },
          projectDetails: "PV",
          keyDates: {
            created: "12 Jul 25 | 07:04 PM",
            received: "12 Jul 25 | 06:38 PM"
          },
          status: "READY FOR DESIGN",
          assignedTo: null,
          countdown: "02:00:00",
          autoComplete: "Auto-Complete",
          priority: "HIGH"
        },
        {
          id: "6",
          customer: {
            name: "66666666",
            address: "Residential, El Segundo, CA, USA",
            initials: "66",
            color: "#64748B" // slate
          },
          projectDetails: "PV",
          keyDates: {
            created: "12 Jul 25 | 02:30 PM",
            received: "12 Jul 25 | 02:49 PM"
          },
          status: "READY FOR DESIGN",
          assignedTo: null,
          countdown: "02:00:00",
          autoComplete: "Auto-Complete",
          priority: "HIGH"
        }
      ];

      res.json({
        status: "success",
        projects: mockProjects
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to fetch new projects data" });
    }
  });

  // Comment routes
  app.get("/api/comments", async (req, res) => {
    try {
      const comments = await storage.getComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const result = insertCommentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid comment data" });
      }
      const comment = await storage.createComment(result.data);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
