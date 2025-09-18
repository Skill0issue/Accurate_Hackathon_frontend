
// Orders Interface
/**
 * Defines the structure for a single order object, based on the database schema.
 * This includes fields from the 'orders' table and related tables (e.g., 'companies').
 */
export interface Order {
  id: string;                 // from orders.id
  company_name: string;       // from a JOIN with companies.company_name
  order_status: "pending" | "in_progress" | "completed" | "cancelled";
  candidate_count: number;    // from orders.candidate_count
  priority: "low" | "medium" | "high" | "urgent";
  cost: number;               // from orders.cost
  currency: string;           // from orders.currency
  due_date: string;           // from orders.due_date (formatted as an ISO string)
}