import { type Portfolio, type InsertPortfolio, type Alert, type InsertAlert } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Portfolio operations
  getPortfolios(): Promise<Portfolio[]>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, portfolio: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  deletePortfolio(id: string): Promise<boolean>;

  // Alert operations
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  dismissAlert(id: string): Promise<boolean>;
  clearDismissedAlerts(): Promise<void>;
}

export class MemStorage implements IStorage {
  private portfolios: Map<string, Portfolio>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.portfolios = new Map();
    this.alerts = new Map();
  }

  // Portfolio methods
  async getPortfolios(): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values());
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    return this.portfolios.get(id);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = { ...insertPortfolio, id };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const existing = this.portfolios.get(id);
    if (!existing) return undefined;
    
    const updated: Portfolio = { ...existing, ...updates };
    this.portfolios.set(id, updated);
    return updated;
  }

  async deletePortfolio(id: string): Promise<boolean> {
    return this.portfolios.delete(id);
  }

  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.dismissed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
      dismissed: false,
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async dismissAlert(id: string): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    
    alert.dismissed = true;
    this.alerts.set(id, alert);
    return true;
  }

  async clearDismissedAlerts(): Promise<void> {
    const idsToDelete: string[] = [];
    this.alerts.forEach((alert, id) => {
      if (alert.dismissed) {
        idsToDelete.push(id);
      }
    });
    idsToDelete.forEach(id => this.alerts.delete(id));
  }
}

export const storage = new MemStorage();
