import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise'; // Using 'mysql2/promise' for async/await support

// --- DATABASE CONNECTION ---
// The connection details are read from environment variables for security.
// The mysql2 library uses a connection URL format similar to pg.
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

/**
 * Handles GET requests to /api/orders.
 * It queries the MySQL database for recent orders and returns them.
 */
export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // --- SQL QUERY (This query is standard and works for MySQL) ---
    // It joins the 'orders' table with the 'companies' table to get all necessary fields.
    const query = `
      SELECT
        o.id,
        c.company_name,
        o.order_status,
        o.candidate_count,
        o.priority,
        o.cost,
        o.currency,
        o.due_date
      FROM
        orders AS o
      JOIN
        companies AS c ON o.company_id = c.id
      ORDER BY
        o.created_at DESC
      LIMIT 50;
    `;

    const [rows] = await connection.query(query);
    
    // Return the fetched data as a JSON response with a 200 OK status.
    return NextResponse.json(rows);

  } catch (error) {
    console.error('Failed to fetch orders from MySQL database:', error);
    // If an error occurs, return a JSON response with a 500 Internal Server Error status.
    return NextResponse.json(
      { error: "Internal Server Error", message: "Could not fetch orders." },
      { status: 500 }
    );
  } finally {
    // Ensure the database connection is always released back to the pool
    if (connection) {
      connection.release();
    }
  }
}


