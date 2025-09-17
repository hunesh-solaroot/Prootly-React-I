import { 
  type User, 
  type InsertUser, 
  type Employee, 
  type InsertEmployee, 
  type Client, 
  type InsertClient, 
  type Project, 
  type InsertProject, 
  type Comment, 
  type InsertComment,
  users,
  employees,
  clients,
  projects,
  comments
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc } from "drizzle-orm";
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

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize sample data on first run if needed
    this.initializeSampleDataIfEmpty();
  }

  private async initializeSampleDataIfEmpty() {
    try {
      const existingEmployees = await db.select().from(employees).limit(1);
      if (existingEmployees.length === 0) {
        await this.insertSampleData();
      }
    } catch (error) {
      // Tables might not exist yet, that's okay
      console.log("Database tables not yet created, sample data will be added after migration");
    }
  }

  private async insertSampleData() {
    try {
      // Sample employees
      const sampleEmployees = await db.insert(employees).values([
        {
          name: "John Smith",
          email: "john.smith@prootly.com",
          role: "Project Manager",
          status: "active",
          profileImage: null,
        },
        {
          name: "Sarah Johnson",
          email: "sarah.johnson@prootly.com",
          role: "Solar Engineer",
          status: "active",
          profileImage: null,
        },
      ]).returning();

      // Sample clients
      const sampleClients = await db.insert(clients).values([
        {
          companyName: "Green Energy Solutions",
          contactPerson: "Michael Brown",
          email: "michael@greenenergy.com",
          phone: "+1-555-0123",
          status: "active",
          notes: "Leading renewable energy company",
        },
        {
          companyName: "Solar Dynamics",
          contactPerson: "Lisa Davis",
          email: "lisa@solardynamics.com",
          phone: "+1-555-0456",
          status: "active",
          notes: "Residential solar installations",
        },
      ]).returning();

      // Sample projects
      await db.insert(projects).values([
        {
          name: "Residential Solar Installation",
          status: "completed",
          clientId: sampleClients[0].id,
        },
        {
          name: "Commercial Solar Array",
          status: "new",
          clientId: sampleClients[1].id,
        },
      ]);

      // Sample comments
      await db.insert(comments).values([
        {
          author: "SON LIGHT CONSTRUCTION",
          company: "Mercedes Melendez",
          text: "Hello. Any update on these revisions? It's been a few...",
        },
        {
          author: "JOHNSUN ENERGY",
          company: "Project Manager",
          text: "Project timeline updated. Ready for next phase review.",
        },
      ]);

      console.log("Sample data inserted successfully");
    } catch (error) {
      console.log("Sample data insertion failed:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db
      .insert(employees)
      .values(insertEmployee)
      .returning();
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const [employee] = await db
      .update(employees)
      .set(updates)
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    return await db.select()
      .from(employees)
      .where(
        or(
          ilike(employees.name, `%${query}%`),
          ilike(employees.email, `%${query}%`)
        )
      );
  }

  // Client methods
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async updateClient(id: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();
    return client || undefined;
  }

  async deleteClient(id: string): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchClients(query: string): Promise<Client[]> {
    return await db.select()
      .from(clients)
      .where(
        or(
          ilike(clients.companyName, `%${query}%`),
          ilike(clients.contactPerson, `%${query}%`),
          ilike(clients.email, `%${query}%`)
        )
      );
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.status, status));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  // Comment methods
  async getComments(): Promise<Comment[]> {
    return await db.select().from(comments).orderBy(desc(comments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }
}

export const storage = new DatabaseStorage();
