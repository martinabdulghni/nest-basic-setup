// Stauts logic increases by 20 for each status.

export enum OrderStatus {
  Open = 20,
  Pending = 40,
  Cancelled = 60,
  Completed = 80,
}
export enum PaymentStatus {
  Pending = 40,
  failed = 60,
  success = 80,
  refunding = 90,
  refunded = 91,
}
export enum DeliveryStatus {}
