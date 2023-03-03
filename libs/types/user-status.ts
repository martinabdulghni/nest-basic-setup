export enum UserConnectionStatus {
  Online = 'Online',
  Offline = 'Offline',
  Busy = 'Busy',
  Away = 'Away',
  Empty = '',
}
export type UserModifiedStatusType = {
  isModified: boolean;
  isValid: boolean;
};

export type UserAccountStatusType = {
  isBanned: boolean;
  isModified: boolean;
  isTimedOut: boolean;
  isWarned: boolean;
  modifiedDate: Date | boolean;
};

export enum UserRole {
  Super = 'Super',
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  SuperSupport = 'SuperSupport',
  Support = 'Support',
  SuperDeveloper = 'SuperDeveloper',
  SuperEconomic = 'SuperEconomic',
  Economic = 'Economic',
  SuperUser = 'SuperUser',
  User = 'User',
}

export type UserRoleType = {
  Super?: boolean;
  SuperAdmin?: boolean;
  Admin?: boolean;
  SuperSupport?: boolean;
  Support?: boolean;
  SuperDeveloper?: boolean;
  SuperEconomic?: boolean;
  Economic?: boolean;
  SuperUser?: boolean;
  User?: boolean;
};

export type UserPaymentStatus = {
  payments: number;
  lastTransactionDate: Date;
};
