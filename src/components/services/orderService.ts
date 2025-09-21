import { Order } from  "@/components/orders/types";

/**
 * Fetches the list of recent orders from your backend API.
 * This function will call the /api/orders endpoint you create,
 * which should query your database and return the data.
 *
 * @returns {Promise<Order[]>} A promise that resolves to an array of orders.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export async function getOrders(): Promise<Order[]> {
  try {
    // This endpoint should be implemented on your backend to connect to your SQL database.
    const response = await fetch('/api/orders');

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data: Order[] = await response.json();
    return data;

  } catch (error) {
    console.error("Failed to fetch orders:", error);
    // Re-throw the error so the component can handle it and show an error message.
    throw error;
  }
}

