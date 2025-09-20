
// Orders Interface
/**
 * Defines the structure for a single order object, based on the database schema.
 * This includes fields from the 'orders' table and related tables (e.g., 'companies').
 */
export type OrderStatus = "in_progress" | "completed" | "pending" | "cancelled";
export  type OrderPriority = "high" | "medium" | "low" | "urgent";
export interface SubOrder {
  id: number;
  order_id: number;
  subject_name: string;
  sub_order_status: string;
  priority: OrderPriority;
  due_date: string;
  notes: string | null;
}
export interface Order {
  id: string;                 // from orders.id
  company_name: string;       // from a JOIN with companies.company_name
  order_status: "pending" | "in_progress" | "completed" | "cancelled";
  candidate_count: number;    // from orders.candidate_count
  priority: "low" | "medium" | "high" | "urgent";
  cost: number;               // from orders.cost
  currency: string;           // from orders.currency
  due_date: string;
  suborders: SubOrder[];
  order_package_id: string;
}