export interface Quote {
  id: string;
  customerName: string;
  projectType: string;
  status: "pending" | "approved" | "rejected" | "completed";
  amount: number;
  date: string;
  description: string;
  location: string;
  materials: string[];
  laborHours: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  projects: number;
  totalSpent: number;
  lastContact: string;
  status: "active" | "inactive" | "prospect";
  notes: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  customer: string;
  date: string;
  time: string;
  type: "consultation" | "installation" | "maintenance" | "estimate";
  status: "scheduled" | "completed" | "cancelled";
  location: string;
  duration: number;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  customer: string;
  type: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  materials: string[];
  crew: string[];
}

// Placeholder data
export const quotes: Quote[] = [
  {
    id: "Q001",
    customerName: "John Smith",
    projectType: "Residential Fence",
    status: "pending",
    amount: 3500,
    date: "2024-01-15",
    description: "150ft wooden privacy fence with gate",
    location: "123 Oak Street, Springfield",
    materials: ["Cedar posts", "Privacy panels", "Gate hardware"],
    laborHours: 24,
  },
  {
    id: "Q002",
    customerName: "Sarah Johnson",
    projectType: "Commercial Fencing",
    status: "approved",
    amount: 8900,
    date: "2024-01-18",
    description: "Chain link fence around parking lot",
    location: "456 Business Ave, Springfield",
    materials: ["Chain link", "Steel posts", "Barbed wire"],
    laborHours: 40,
  },
  {
    id: "Q003",
    customerName: "Mike Davis",
    projectType: "Pool Fence",
    status: "completed",
    amount: 2100,
    date: "2024-01-10",
    description: "Safety fence around swimming pool",
    location: "789 Pool Lane, Springfield",
    materials: ["Aluminum panels", "Self-closing gate", "Safety latches"],
    laborHours: 16,
  },
];

export const customers: Customer[] = [
  {
    id: "C001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Springfield",
    projects: 2,
    totalSpent: 5600,
    lastContact: "2024-01-15",
    status: "active",
    notes: "Prefers wooden fencing, very detail-oriented",
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    email: "sarah.j@business.com",
    phone: "(555) 987-6543",
    address: "456 Business Ave, Springfield",
    projects: 1,
    totalSpent: 8900,
    lastContact: "2024-01-18",
    status: "active",
    notes: "Commercial client, needs invoicing to accounting dept",
  },
  {
    id: "C003",
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "(555) 456-7890",
    address: "789 Pool Lane, Springfield",
    projects: 1,
    totalSpent: 2100,
    lastContact: "2024-01-10",
    status: "active",
    notes: "Quick decision maker, referred by neighbor",
  },
  {
    id: "C004",
    name: "Lisa Wilson",
    email: "lisa.wilson@email.com",
    phone: "(555) 321-0987",
    address: "321 Garden St, Springfield",
    projects: 0,
    totalSpent: 0,
    lastContact: "2024-01-20",
    status: "prospect",
    notes: "Interested in decorative fencing, budget conscious",
  },
];

export const schedule: ScheduleItem[] = [
  {
    id: "S001",
    title: "Initial Consultation - John Smith",
    customer: "John Smith",
    date: "2024-01-25",
    time: "09:00",
    type: "consultation",
    status: "scheduled",
    location: "123 Oak Street, Springfield",
    duration: 60,
    notes: "Discuss privacy fence options and pricing",
  },
  {
    id: "S002",
    title: "Fence Installation - Sarah Johnson",
    customer: "Sarah Johnson",
    date: "2024-01-26",
    time: "08:00",
    type: "installation",
    status: "scheduled",
    location: "456 Business Ave, Springfield",
    duration: 480,
    notes: "Full day installation, bring full crew",
  },
  {
    id: "S003",
    title: "Maintenance Check - Mike Davis",
    customer: "Mike Davis",
    date: "2024-01-24",
    time: "14:00",
    type: "maintenance",
    status: "completed",
    location: "789 Pool Lane, Springfield",
    duration: 30,
    notes: "Annual safety inspection completed",
  },
];

export const projects: Project[] = [
  {
    id: "P001",
    name: "Smith Residential Fence",
    customer: "John Smith",
    type: "Residential",
    status: "in-progress",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    budget: 3500,
    spent: 1200,
    materials: ["Cedar posts", "Privacy panels", "Gate hardware"],
    crew: ["Tom Wilson", "Jake Brown"],
  },
  {
    id: "P002",
    name: "Johnson Commercial Fencing",
    customer: "Sarah Johnson",
    type: "Commercial",
    status: "planning",
    startDate: "2024-01-26",
    endDate: "2024-02-02",
    budget: 8900,
    spent: 0,
    materials: ["Chain link", "Steel posts", "Barbed wire"],
    crew: ["Tom Wilson", "Jake Brown", "Mike Rodriguez"],
  },
];

// Export all data as a single object for easy access
export const allData = {
  quotes,
  customers,
  schedule,
  projects,
  summary: {
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter((q) => q.status === "pending").length,
    approvedQuotes: quotes.filter((q) => q.status === "approved").length,
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === "active").length,
    prospectCustomers: customers.filter((c) => c.status === "prospect").length,
    upcomingAppointments: schedule.filter((s) => s.status === "scheduled")
      .length,
    activeProjects: projects.filter((p) => p.status === "in-progress").length,
    totalRevenue: quotes
      .filter((q) => q.status === "completed")
      .reduce((sum, q) => sum + q.amount, 0),
    pendingRevenue: quotes
      .filter((q) => q.status === "approved")
      .reduce((sum, q) => sum + q.amount, 0),
  },
};
