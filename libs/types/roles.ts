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
