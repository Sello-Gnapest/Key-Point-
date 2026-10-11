export type KeyStatus = 'Available' | 'Checked Out' | 'Maintenance' | 'Missing' | 'Archived';

export type KeyType = 
  | 'Front Door'
  | 'Master Key'
  | 'Back Door'
  | 'Security Gate'
  | 'Garage / Remote'
  | 'Mailbox'
  | 'Full Set'
  | 'Storage / Utility';

export type PersonRole = 
  | 'Estate Agent'
  | 'Contractor'
  | 'Tenant'
  | 'Inspector'
  | 'Cleaner'
  | 'Visitor'
  | 'Property Manager'
  | 'Appraiser';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'Apartment' | 'House' | 'Commercial' | 'Villa' | 'Townhouse' | 'Office' | 'Penthouse';
  unitNumber?: string;
  notes?: string;
  isArchived: boolean;
  archivedAt?: string;
  archivedReason?: string;
  createdAt: string;
}

export interface Person {
  id: string;
  name: string;
  company?: string; // Optional as requested
  phone: string;
  email?: string;
  role: PersonRole;
  isArchived: boolean;
  archivedAt?: string;
  createdAt: string;
}

export interface KeyItem {
  id: string;
  tag: string; // Manually captured code e.g. H0015, M016, T09
  propertyId: string;
  keyType: KeyType;
  pegLocation: string; // e.g. "Hook A-14", "Peg 22", "Cabinet 1 / Hook 05"
  copies: number;
  status: KeyStatus;
  // Prominently stores who has the key
  currentBorrowerId?: string;
  currentBorrowerName?: string;
  currentBorrowerCompany?: string;
  currentBorrowerPhone?: string;
  checkedOutAt?: string;
  expectedReturnAt?: string;
  checkoutNotes?: string;
  notes?: string;
  isArchived: boolean;
  archivedAt?: string;
  archivedReason?: string;
  createdAt: string;
}

export interface KeyActivity {
  id: string;
  keyId: string;
  keyTag: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  personId: string;
  personName: string;
  personCompany?: string;
  personPhone?: string;
  action: 'checkout' | 'return' | 'archive' | 'unarchive' | 'created';
  timestamp: string;
  expectedReturnAt?: string;
  actualReturnAt?: string;
  performedBy: string;
  notes?: string;
  isAfterHours?: boolean;
  manualAfterHoursEntry?: boolean; // When estate agent handovers are entered the next day
}

export type InviteAccessLevel = 'agent' | 'guest';

export interface VisitorAccessCode {
  id: string;
  code: string; // e.g. "512-890"
  label: string; // e.g. "Weekend Viewings - Chas Everitt"
  createdAt: string;
  expiresAt: string | null; // null = permanent / keep for long time
  isPermanent: boolean;
  createdBy: string;
  accessCount: number;
  lastUsedAt?: string;
  notes?: string;
  allowedPropertyId?: string; // Optional filter for specific property or all
  role?: InviteAccessLevel; // 'agent' (operational: checkout/return) or 'guest' (read-only)
}

export type UserRole = 'admin' | 'agent' | 'visitor';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  lastActive: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'properties'
  | 'keys'
  | 'people'
  | 'activity'
  | 'reports'
  | 'archived'
  | 'settings';
