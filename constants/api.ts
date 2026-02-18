export interface Order {
  id: string;
  senderName: string;
  recipientName: string;
  address: string;
  status: "pending" | "in_transit" | "delivered" | "offline";
  syncStatus: "local" | "synced";
}

export const orderDetails: Order[] = [
  {
    id: "1",
    senderName: "Warehouse A",
    recipientName: "John Doe",
    address: "Kathmandu",
    status: "in_transit",
    syncStatus: "synced",
  },
  {
    id: "35628",
    senderName: "Warehouse A",
    recipientName: "utshav nepal",
    address: "Kathmandu",

    status: "pending",
    syncStatus: "synced",
  },

  {
    id: "2",
    senderName: "Warehouse B",
    recipientName: "Jane Smith",
    address: "Pokhara",

    status: "delivered",
    syncStatus: "synced",
  },
];
