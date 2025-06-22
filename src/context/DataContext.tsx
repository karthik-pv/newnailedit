import React, { createContext, useState, ReactNode } from "react";

// Define types for our data
export interface Customer {
  id: string;
  name: string;
  type: "Residential" | "Commercial";
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  billingAddress?: string;
  notes?: string;
  status: "active" | "inactive" | "lead";
  lastContact: string;
}

export interface Quote {
  id: string;
  customerName: string;
  project: string;
  amount: string;
  status: "draft" | "pending" | "approved" | "rejected";
  time: string;
}

export interface ScheduledJob {
  id: string;
  customerName: string;
  jobType: string;
  date: Date;
  status: "scheduled" | "in-progress" | "completed";
}

// Define the shape of our context data
interface DataContextProps {
  customers: Customer[];
  quotes: Quote[];
  scheduledJobs: ScheduledJob[];
  addCustomer: (
    customer: Omit<Customer, "id" | "status" | "lastContact">
  ) => void;
  addQuote: (quote: Omit<Quote, "id" | "time">) => void;
  scheduleJob: (job: Omit<ScheduledJob, "id">) => void;
}

// Create the context
export const DataContext = createContext<DataContextProps | undefined>(
  undefined
);

// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([
    // Initial hardcoded data, can be moved or fetched from an API
    {
      id: "1",
      name: "John Smith",
      type: "Residential",
      email: "john.smith@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Anytown USA",
      status: "active",
      lastContact: "2 days ago",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      type: "Commercial",
      email: "sarah.j@example.com",
      phone: "234-567-8901",
      address: "456 Business Blvd, Anytown USA",
      status: "active",
      lastContact: "1 week ago",
    },
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: "Q-2024-001",
      customerName: "John Smith",
      project: "Backyard Fence Installation",
      amount: "$2,450",
      status: "pending",
      time: "2 hours ago",
    },
    {
      id: "Q-2024-002",
      customerName: "Sarah Johnson",
      project: "Commercial Fence Repair",
      amount: "$850",
      status: "approved",
      time: "5 hours ago",
    },
  ]);

  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>([]);

  const addCustomer = (
    customerData: Omit<Customer, "id" | "status" | "lastContact">
  ) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST-${Date.now()}`,
      status: "active",
      lastContact: new Date().toLocaleDateString(),
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const addQuote = (quoteData: Omit<Quote, "id" | "time">) => {
    const newQuote: Quote = {
      ...quoteData,
      id: `Q-${Date.now()}`,
      time: "Just now",
    };
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const scheduleJob = (jobData: Omit<ScheduledJob, "id">) => {
    const newJob: ScheduledJob = {
      ...jobData,
      id: `JOB-${Date.now()}`,
    };
    setScheduledJobs((prev) => [...prev, newJob]);
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        quotes,
        scheduledJobs,
        addCustomer,
        addQuote,
        scheduleJob,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
