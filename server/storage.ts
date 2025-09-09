import { type User, type InsertUser, type Employee, type InsertEmployee, type Client, type InsertClient, type Project, type InsertProject, type Comment, type InsertComment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Employee methods
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  searchEmployees(query: string): Promise<Employee[]>;

  // Client methods
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
  searchClients(query: string): Promise<Client[]>;

  // Project methods
  getProjects(): Promise<Project[]>;
  getProjectsByStatus(status: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // Comment methods
  getComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private employees: Map<string, Employee>;
  private clients: Map<string, Client>;
  private projects: Map<string, Project>;
  private comments: Map<string, Comment>;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.clients = new Map();
    this.projects = new Map();
    this.comments = new Map();

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample employees
    const sampleEmployees: Employee[] = [
      {
        id: randomUUID(),
        name: "John Smith",
        email: "john.smith@prootly.com",
        role: "Project Manager",
        status: "active",
        profileImage: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Sarah Johnson",
        email: "sarah.johnson@prootly.com",
        role: "Solar Engineer",
        status: "active",
        profileImage: null,
        createdAt: new Date(),
      },
    ];

    // Sample clients
    const sampleClients: Client[] = [
      {
        id: randomUUID(),
        companyName: "Green Energy Solutions",
        contactPerson: "Michael Brown",
        email: "michael@greenenergy.com",
        phone: "+1-555-0123",
        status: "active",
        notes: "Leading renewable energy company",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        companyName: "Solar Dynamics",
        contactPerson: "Lisa Davis",
        email: "lisa@solardynamics.com",
        phone: "+1-555-0456",
        status: "active",
        notes: "Residential solar installations",
        createdAt: new Date(),
      },
    ];

    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: randomUUID(),
        name: "Residential Solar Installation",
        status: "completed",
        clientId: sampleClients[0].id,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Commercial Solar Array",
        status: "new",
        clientId: sampleClients[1].id,
        createdAt: new Date(),
      },
    ];

    // Sample comments
    const sampleComments: Comment[] = [
      {
        id: randomUUID(),
        author: "SON LIGHT CONSTRUCTION",
        company: "Mercedes Melendez",
        text: "Hello. Any update on these revisions? It's been a few...",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        author: "JOHNSUN ENERGY",
        company: "Project Manager",
        text: "Project timeline updated. Ready for next phase review.",
        createdAt: new Date(),
      },
    ];

    // Store samples
    sampleEmployees.forEach(emp => this.employees.set(emp.id, emp));
    sampleClients.forEach(client => this.clients.set(client.id, client));
    sampleProjects.forEach(project => this.projects.set(project.id, project));
    sampleComments.forEach(comment => this.comments.set(comment.id, comment));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = { 
      ...insertEmployee, 
      id, 
      createdAt: new Date(),
      status: insertEmployee.status || "active",
      profileImage: insertEmployee.profileImage || null
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...updates };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.employees.values()).filter(
      employee => 
        employee.name.toLowerCase().includes(lowerQuery) ||
        employee.email.toLowerCase().includes(lowerQuery)
    );
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = { 
      ...insertClient, 
      id, 
      createdAt: new Date(),
      status: insertClient.status || "active",
      phone: insertClient.phone || null,
      notes: insertClient.notes || null
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...updates };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  async searchClients(query: string): Promise<Client[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.clients.values()).filter(
      client => 
        client.companyName.toLowerCase().includes(lowerQuery) ||
        client.contactPerson.toLowerCase().includes(lowerQuery) ||
        client.email.toLowerCase().includes(lowerQuery)
    );
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.status === status
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      clientId: insertProject.clientId || null
    };
    this.projects.set(id, project);
    return project;
  }

  // Comment methods
  async getComments(): Promise<Comment[]> {
    return Array.from(this.comments.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = { 
      ...insertComment, 
      id, 
      createdAt: new Date(),
      company: insertComment.company || null
    };
    this.comments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
