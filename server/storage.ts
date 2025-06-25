import { users, verificationRecords, type User, type InsertUser, type VerificationRecord, type InsertVerification } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createVerificationRecord(record: InsertVerification): Promise<VerificationRecord>;
  getVerificationRecord(id: number): Promise<VerificationRecord | undefined>;
  updateVerificationRecord(id: number, updates: Partial<VerificationRecord>): Promise<VerificationRecord | undefined>;
  getAllVerificationRecords(): Promise<VerificationRecord[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private verifications: Map<number, VerificationRecord>;
  private currentUserId: number;
  private currentVerificationId: number;

  constructor() {
    this.users = new Map();
    this.verifications = new Map();
    this.currentUserId = 1;
    this.currentVerificationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createVerificationRecord(record: InsertVerification): Promise<VerificationRecord> {
    const id = this.currentVerificationId++;
    const verification: VerificationRecord = {
      ...record,
      id,
      extractedName: record.extractedName || null,
      extractedAge: record.extractedAge || null,
      extractedDob: record.extractedDob || null,
      faceMatchScore: record.faceMatchScore || null,
      ageVerified: record.ageVerified || false,
      identityVerified: record.identityVerified || false,
      status: record.status || 'pending',
      createdAt: new Date(),
      completedAt: null,
    };
    this.verifications.set(id, verification);
    return verification;
  }

  async getVerificationRecord(id: number): Promise<VerificationRecord | undefined> {
    return this.verifications.get(id);
  }

  async updateVerificationRecord(id: number, updates: Partial<VerificationRecord>): Promise<VerificationRecord | undefined> {
    const existing = this.verifications.get(id);
    if (!existing) return undefined;
    
    const updated: VerificationRecord = { ...existing, ...updates };
    this.verifications.set(id, updated);
    return updated;
  }

  async getAllVerificationRecords(): Promise<VerificationRecord[]> {
    return Array.from(this.verifications.values());
  }
}

export const storage = new MemStorage();
