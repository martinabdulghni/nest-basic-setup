// Stauts logic increases by 20 for each status.

export enum OrderStatus {
  Open = 20,
  Pending = 40,
  Cancelled = 60,
  Completed = 80,
}

export enum UserConnectionStatus {
  Online = 'Online',
  Offline = 'Offline',
  Busy = 'Busy',
  Away = 'Away',
}

export type UserAccountStatusType = {
  isBanned: boolean;
  isModified: boolean;
  isTimedOut: boolean;
  isWarned: boolean;
  modifiedDate: Date | boolean;
};
export enum PaymentStatus {
  Pending = 40,
  failed = 60,
  success = 80,
  refunding = 90,
  refunded = 91,
}
export enum DeliveryStatus {}
