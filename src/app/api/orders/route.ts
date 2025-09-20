import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// --- DATABASE CONNECTION ---
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

/**
 * Handles GET requests to /api/orders.
 * It queries the MySQL database for recent orders, fetches their associated suborders
 * including the subject name, and returns them as a nested JSON object.
 */
export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // --- STEP 1: FETCH MAIN ORDERS ---
    const ordersQuery = `
      SELECT
        o.id,
        c.company_name,
        o.order_status,
        o.candidate_count,
        o.priority,
        o.cost,
        o.currency,
        o.due_date,
        o.order_package_id
      FROM
        orders AS o
      JOIN
        companies AS c ON o.company_id = c.id
      ORDER BY
        o.created_at DESC
      LIMIT 500;
    `;
    const [orders]: [any[], any] = await connection.query(ordersQuery);
    
    if (orders.length === 0) {
      return NextResponse.json([]);
    }

    // --- STEP 2: FETCH SUBORDERS FOR THE ORDERS ---
    const orderIds = orders.map(order => order.id);

    // MODIFIED: This query now joins with the 'subjects' table to get the subject name.
    // It uses 'LEFT JOIN' to ensure sub-orders are still returned even if they don't have a linked subject.
    // It renames 'subjects.name' to 'subject_name' to match the frontend component's expectation.
    const subordersQuery = `
      SELECT
        so.id,
        so.order_id,
        s.name AS subject_name, -- Fetched from subjects table and aliased
        so.sub_order_status,
        so.priority,
        so.due_date,
        so.notes
      FROM
        sub_orders AS so
      LEFT JOIN
        subjects AS s ON so.subject_id = s.id
      WHERE
        so.order_id IN (?);
    `;
    const [suborders]: [any[], any] = await connection.query(subordersQuery, [orderIds]);

    // --- STEP 3: MAP SUBORDERS TO THEIR PARENT ORDER ---
    const subordersMap = new Map<number, any[]>();
    for (const suborder of suborders) {
      if (!subordersMap.has(suborder.order_id)) {
        subordersMap.set(suborder.order_id, []);
      }
      subordersMap.get(suborder.order_id)!.push(suborder);
    }

    // --- STEP 4: COMBINE ORDERS AND SUBORDERS ---
    const ordersWithSuborders = orders.map(order => ({
      ...order,
      suborders: subordersMap.get(order.id) || [],
    }));
    
    return NextResponse.json(ordersWithSuborders);

  } catch (error) {
    console.error('Failed to fetch orders from MySQL database:', error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Could not fetch orders." },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

