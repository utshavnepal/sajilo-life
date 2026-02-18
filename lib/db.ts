import { Order } from "@/constants/api";
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("orders.db");

// Safe escape function
const escape = (str?: string) => (str ? str.replace(/'/g, "''") : "");

// Initialize the DB table
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY NOT NULL,
      sender_name TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT NOT NULL,
      sync_status TEXT NOT NULL
    );
  `);
  console.log("Orders table ready ✅");
};

// Test DB connection
export const testDB = () => {
  try {
    const result = db.getAllSync(
      "SELECT name FROM sqlite_master WHERE type='table';",
    );
    console.log("DB Connected Tables:", result);
  } catch (e) {
    console.log("DB Connection Failed ❌", e);
  }
};

// Insert an order
export const insertOrder = (order: Order) => {
  try {
    db.execSync(`
      INSERT INTO orders (id, sender_name, recipient_name, address, status, sync_status)
      VALUES (
        '${escape(order.id)}',
        '${escape(order.senderName)}',
        '${escape(order.recipientName)}',
        '${escape(order.address)}',
        '${escape(order.status)}',
        '${escape(order.syncStatus)}'
      );
    `);
    console.log("Order inserted ✅", order.id);
  } catch (e) {
    console.log("Failed to insert order ❌", e);
  }
};

// Get all orders
export const getAllOrders = (): Order[] => {
  try {
    const rows = db.getAllSync("SELECT * FROM orders;") as {
      id: string;
      sender_name: string;
      recipient_name: string;
      address: string;
      status: string;
      sync_status: string;
    }[];

    return rows.map((row) => ({
      id: row.id,
      senderName: row.sender_name,
      recipientName: row.recipient_name,
      address: row.address,
      status: row.status as Order["status"],
      syncStatus: row.sync_status as Order["syncStatus"], // map DB column to TS field
    }));
  } catch (e) {
    console.log("Failed to fetch orders ❌", e);
    return [];
  }
};

// Delete all orders
export const deleteAllOrders = (): void => {
  try {
    db.execSync(`
      DELETE FROM orders;
    `);
    console.log("All orders deleted ✅");
  } catch (e) {
    console.log("Failed to delete all orders ❌", e);
  }
};
