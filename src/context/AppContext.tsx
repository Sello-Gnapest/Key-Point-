import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  Person,
  KeyItem,
  KeyActivity,
  VisitorAccessCode,
  TeamMember,
  NavigationTab,
  UserRole,
  InviteAccessLevel,
} from '../types';
import {
  initialProperties,
  initialPeople,
  initialKeys,
  initialActivities,
  initialVisitorCodes,
  initialTeamMembers,
} from '../data/initialData';

interface AppContextType {
  // Navigation & Theme
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  theme: 'dark' | 'light' | 'auto';
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Current User / RBAC & Authentication
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'lastActive'>) => { success: boolean; error?: string };
  updateTeamRole: (id: string, role: UserRole) => { success: boolean; error?: string };
  deleteTeamMember: (id: string) => void;
  isAdmin: boolean;
  adminCount: number;
  maxAdmins: number;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;

  // Properties
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'isArchived' | 'createdAt'>) => Property;
  archiveProperty: (id: string, reason?: string) => void;
  restoreProperty: (id: string) => void;
  deleteProperty: (id: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;

  // Keys
  keys: KeyItem[];
  addKey: (key: Omit<KeyItem, 'id' | 'status' | 'isArchived' | 'createdAt'>) => KeyItem;
  archiveKey: (id: string, reason?: string) => void;
  restoreKey: (id: string) => void;
  deleteKey: (id: string) => void;
  checkoutKey: (params: {
    keyId: string;
    personId: string;
    expectedReturnAt?: string;
    notes?: string;
    isAfterHours?: boolean;
    customTimestamp?: string;
  }) => void;
  returnKey: (params: {
    keyId: string;
    notes?: string;
    condition?: string;
    customTimestamp?: string;
  }) => void;
  selectedKeyId: string | null;
  setSelectedKeyId: (id: string | null) => void;

  // People
  people: Person[];
  addPerson: (person: Omit<Person, 'id' | 'isArchived' | 'createdAt'>) => Person;
  archivePerson: (id: string) => void;
  restorePerson: (id: string) => void;
  deletePerson: (id: string) => void;
  selectedPersonId: string | null;
  setSelectedPersonId: (id: string | null) => void;

  // Activities & After-Hours Entries
  activities: KeyActivity[];
  logAfterHoursEntry: (entry: {
    keyId: string;
    personId: string;
    action: 'checkout' | 'return';
    timestamp: string;
    notes: string;
    expectedReturnAt?: string;
  }) => void;

  // Visitor & Invite Access Codes
  visitorCodes: VisitorAccessCode[];
  createVisitorCode: (params: {
    label: string;
    isPermanent: boolean;
    expiresInDays?: number;
    notes?: string;
    allowedPropertyId?: string;
    role?: InviteAccessLevel;
  }) => VisitorAccessCode;
  deleteVisitorCode: (id: string) => void;
  activeVisitorSession: VisitorAccessCode | null;
  setActiveVisitorSession: (code: VisitorAccessCode | null) => void;
  verifyVisitorCode: (codeString: string) => VisitorAccessCode | null;
  loginWithInviteCode: (codeOrUrl: string) => { success: boolean; error?: string; pass?: VisitorAccessCode };
  exitVisitorSession: () => void;
  isGuestReadOnly: boolean;

  // Modals helpers
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isAddKeyModalOpen: boolean;
  setIsAddKeyModalOpen: (open: boolean) => void;
  isAddPropertyModalOpen: boolean;
  setIsAddPropertyModalOpen: (open: boolean) => void;
  isAddPersonModalOpen: boolean;
  setIsAddPersonModalOpen: (open: boolean) => void;
  preselectedKeyForCheckout: KeyItem | null;
  setPreselectedKeyForCheckout: (key: KeyItem | null) => void;

  // Reset demo data
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  // Modals
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [preselectedKeyForCheckout, setPreselectedKeyForCheckout] = useState<KeyItem | null>(null);

  // Theme
  const [theme, setThemeState] = useState<'dark' | 'light' | 'auto'>(() => {
    return (localStorage.getItem('keypoint_theme') as 'dark' | 'light' | 'auto') || 'dark';
  });

  const setTheme = (newTheme: 'dark' | 'light' | 'auto') => {
    setThemeState(newTheme);
    localStorage.setItem('keypoint_theme', newTheme);
    applyThemeClass(newTheme);
  };

  const applyThemeClass = (t: 'dark' | 'light' | 'auto') => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (t === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  };

  useEffect(() => {
    applyThemeClass(theme);

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyThemeClass('auto');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Clean up legacy v1 storage if present
  useEffect(() => {
    try {
      if (localStorage.getItem('keypoint_properties') && !localStorage.getItem('keypoint_v2_migrated')) {
        localStorage.removeItem('keypoint_properties');
        localStorage.removeItem('keypoint_people');
        localStorage.removeItem('keypoint_keys');
        localStorage.removeItem('keypoint_activities');
        localStorage.removeItem('keypoint_visitor_codes');
        localStorage.removeItem('keypoint_team');
        localStorage.removeItem('keypoint_current_user');
        localStorage.setItem('keypoint_v2_migrated', 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Team & Current User (Enforcing 2 Main Admins: sello@gnapest.com and admin@keypoint.com)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('keypoint_v3_team');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.some((m: TeamMember) => m.email === 'sello@gnapest.com') &&
          parsed.some((m: TeamMember) => m.email === 'admin@keypoint.com')
        ) {
          return parsed;
        }
      } catch {}
    }
    return initialTeamMembers;
  });

  const [currentUser, setCurrentUser] = useState<TeamMember>(() => {
    const saved = localStorage.getItem('keypoint_v3_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'sello@gnapest.com' || parsed.email === 'admin@keypoint.com') {
          return parsed;
        }
      } catch {}
    }
    return initialTeamMembers[0]; // Default: Sello Ncwani (sello@gnapest.com)
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('keypoint_v3_auth');
    return saved === 'true';
  });

  const isAdmin = currentUser.role === 'admin';
  const MAX_ADMINS = 2;
  const adminCount = teamMembers.filter((m) => m.role === 'admin').length;

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = teamMembers.find((m) => m.email.toLowerCase() === cleanEmail);

    if (!matched) {
      return {
        success: false,
        error: `No account found for "${email}". Please verify your email or contact the administrator.`,
      };
    }

    const expectedPass = matched.password || 'admin123';
    if (password && password !== expectedPass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your password and try again.',
      };
    }

    setCurrentUser(matched);
    setIsAuthenticated(true);
    localStorage.setItem('keypoint_v3_auth', 'true');
    localStorage.setItem('keypoint_v3_current_user', JSON.stringify(matched));
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('keypoint_v3_auth', 'false');
  };

  // Persistence: Properties (10 test properties)
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('keypoint_v2_properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  // Persistence: People (test people)
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem('keypoint_v2_people');
    return saved ? JSON.parse(saved) : initialPeople;
  });

  // Persistence: Keys (test keys)
  const [keys, setKeys] = useState<KeyItem[]>(() => {
    const saved = localStorage.getItem('keypoint_v2_keys');
    return saved ? JSON.parse(saved) : initialKeys;
  });

  // Persistence: Activities (test activities)
  const [activities, setActivities] = useState<KeyActivity[]>(() => {
    const saved = localStorage.getItem('keypoint_v2_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  // Persistence: Visitor Codes
  const [visitorCodes, setVisitorCodes] = useState<VisitorAccessCode[]>(() => {
    const saved = localStorage.getItem('keypoint_v2_visitor_codes');
    return saved ? JSON.parse(saved) : initialVisitorCodes;
  });

  const [activeVisitorSession, setActiveVisitorSession] = useState<VisitorAccessCode | null>(() => {
    const saved = localStorage.getItem('keypoint_v2_active_visitor');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to LocalStorage (v2 keys)
  useEffect(() => {
    localStorage.setItem('keypoint_v2_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('keypoint_v2_people', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('keypoint_v2_keys', JSON.stringify(keys));
  }, [keys]);

  useEffect(() => {
    localStorage.setItem('keypoint_v2_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('keypoint_v2_visitor_codes', JSON.stringify(visitorCodes));
  }, [visitorCodes]);

  useEffect(() => {
    localStorage.setItem('keypoint_v3_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('keypoint_v3_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Guest Read-Only Pass enforcement: guests only see keys
  useEffect(() => {
    if (activeVisitorSession?.role === 'guest' || (!isAdmin && currentUser.role === 'visitor')) {
      if (currentTab !== 'keys') {
        setCurrentTab('keys');
      }
    }
  }, [activeVisitorSession, currentUser, currentTab, isAdmin]);

  // Reset to initial demo data
  const resetToDemoData = () => {
    setProperties(initialProperties);
    setPeople(initialPeople);
    setKeys(initialKeys);
    setActivities(initialActivities);
    setVisitorCodes(initialVisitorCodes);
    setTeamMembers(initialTeamMembers);
    setCurrentUser(initialTeamMembers[0]);
    localStorage.clear();
  };

  // Property handlers
  const addProperty = (propData: Omit<Property, 'id' | 'isArchived' | 'createdAt'>): Property => {
    const newProp: Property = {
      ...propData,
      id: `prop-${Date.now()}`,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    setProperties((prev) => [newProp, ...prev]);
    return newProp;
  };

  const archiveProperty = (id: string, reason?: string) => {
    const now = new Date().toISOString();
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isArchived: true,
              archivedAt: now,
              archivedReason: reason || 'Property sold or leased out',
            }
          : p
      )
    );

    // Also note in activity history that this property was archived, but DO NOT erase history
    const target = properties.find((p) => p.id === id);
    if (target) {
      const archiveAct: KeyActivity = {
        id: `act-${Date.now()}`,
        keyId: 'system',
        keyTag: 'PORTFOLIO',
        propertyId: target.id,
        propertyName: target.name,
        propertyAddress: target.address,
        personId: currentUser.id,
        personName: currentUser.name,
        action: 'archive',
        timestamp: now,
        performedBy: currentUser.name,
        notes: `Property archived: ${reason || 'Sold / Rented out'}. Historical key handovers retained intact.`,
      };
      setActivities((prev) => [archiveAct, ...prev]);
    }
  };

  const restoreProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isArchived: false,
              archivedAt: undefined,
              archivedReason: undefined,
            }
          : p
      )
    );
  };

  const deleteProperty = (id: string) => {
    // Permanent deletion for admin only if no keys are currently in use
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // Key handlers
  const addKey = (keyData: Omit<KeyItem, 'id' | 'status' | 'isArchived' | 'createdAt'>): KeyItem => {
    const newKey: KeyItem = {
      ...keyData,
      id: `key-${Date.now()}`,
      status: 'Available',
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    setKeys((prev) => [newKey, ...prev]);

    // Record creation activity
    const prop = properties.find((p) => p.id === newKey.propertyId);
    const creationAct: KeyActivity = {
      id: `act-${Date.now()}`,
      keyId: newKey.id,
      keyTag: newKey.tag,
      propertyId: newKey.propertyId,
      propertyName: prop?.name || 'Unknown Property',
      propertyAddress: prop?.address || '',
      personId: currentUser.id,
      personName: currentUser.name,
      action: 'created',
      timestamp: new Date().toISOString(),
      performedBy: currentUser.name,
      notes: `New key tagged: ${newKey.tag} (${newKey.keyType}) allocated to ${newKey.pegLocation}.`,
    };
    setActivities((prev) => [creationAct, ...prev]);
    return newKey;
  };

  const archiveKey = (id: string, reason?: string) => {
    const now = new Date().toISOString();
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              status: 'Archived',
              isArchived: true,
              archivedAt: now,
              archivedReason: reason || 'Key deactivated/lock changed',
            }
          : k
      )
    );

    const targetKey = keys.find((k) => k.id === id);
    const prop = targetKey ? properties.find((p) => p.id === targetKey.propertyId) : null;
    if (targetKey && prop) {
      const archiveAct: KeyActivity = {
        id: `act-${Date.now()}`,
        keyId: targetKey.id,
        keyTag: targetKey.tag,
        propertyId: prop.id,
        propertyName: prop.name,
        propertyAddress: prop.address,
        personId: currentUser.id,
        personName: currentUser.name,
        action: 'archive',
        timestamp: now,
        performedBy: currentUser.name,
        notes: `Key ${targetKey.tag} archived: ${reason || 'Lock replaced/obsolete'}. Retained in historical logs.`,
      };
      setActivities((prev) => [archiveAct, ...prev]);
    }
  };

  const restoreKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              status: 'Available',
              isArchived: false,
              archivedAt: undefined,
              archivedReason: undefined,
            }
          : k
      )
    );
  };

  const deleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  // Checkout Key
  const checkoutKey = ({
    keyId,
    personId,
    expectedReturnAt,
    notes,
    isAfterHours,
    customTimestamp,
  }: {
    keyId: string;
    personId: string;
    expectedReturnAt?: string;
    notes?: string;
    isAfterHours?: boolean;
    customTimestamp?: string;
  }) => {
    const borrower = people.find((p) => p.id === personId);
    const targetKey = keys.find((k) => k.id === keyId);
    if (!targetKey || !borrower) return;

    const property = properties.find((p) => p.id === targetKey.propertyId);
    const timestamp = customTimestamp || new Date().toISOString();

    // Update key with current borrower details
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyId
          ? {
              ...k,
              status: 'Checked Out',
              currentBorrowerId: borrower.id,
              currentBorrowerName: borrower.name,
              currentBorrowerCompany: borrower.company,
              currentBorrowerPhone: borrower.phone,
              checkedOutAt: timestamp,
              expectedReturnAt: expectedReturnAt,
              checkoutNotes: notes,
            }
          : k
      )
    );

    // Add activity record
    const newActivity: KeyActivity = {
      id: `act-${Date.now()}`,
      keyId: targetKey.id,
      keyTag: targetKey.tag,
      propertyId: property ? property.id : 'unknown',
      propertyName: property ? property.name : 'Unknown Property',
      propertyAddress: property ? property.address : '',
      personId: borrower.id,
      personName: borrower.name,
      personCompany: borrower.company,
      personPhone: borrower.phone,
      action: 'checkout',
      timestamp: timestamp,
      expectedReturnAt: expectedReturnAt,
      performedBy: currentUser.name,
      notes: notes || 'Key checked out for property viewing / service.',
      isAfterHours: isAfterHours || false,
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  // Return Key
  const returnKey = ({
    keyId,
    notes,
    condition,
    customTimestamp,
  }: {
    keyId: string;
    notes?: string;
    condition?: string;
    customTimestamp?: string;
  }) => {
    const targetKey = keys.find((k) => k.id === keyId);
    if (!targetKey) return;

    const property = properties.find((p) => p.id === targetKey.propertyId);
    const returnTime = customTimestamp || new Date().toISOString();
    const borrowerName = targetKey.currentBorrowerName || 'Unknown Borrower';
    const borrowerCompany = targetKey.currentBorrowerCompany;
    const borrowerPhone = targetKey.currentBorrowerPhone;
    const borrowerId = targetKey.currentBorrowerId || 'unknown';

    // Clear borrower details from key and set back to Available
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyId
          ? {
              ...k,
              status: 'Available',
              currentBorrowerId: undefined,
              currentBorrowerName: undefined,
              currentBorrowerCompany: undefined,
              currentBorrowerPhone: undefined,
              checkedOutAt: undefined,
              expectedReturnAt: undefined,
              checkoutNotes: undefined,
            }
          : k
      )
    );

    // Add return activity record
    const newActivity: KeyActivity = {
      id: `act-${Date.now()}`,
      keyId: targetKey.id,
      keyTag: targetKey.tag,
      propertyId: property ? property.id : 'unknown',
      propertyName: property ? property.name : 'Unknown Property',
      propertyAddress: property ? property.address : '',
      personId: borrowerId,
      personName: borrowerName,
      personCompany: borrowerCompany,
      personPhone: borrowerPhone,
      action: 'return',
      timestamp: returnTime,
      actualReturnAt: returnTime,
      performedBy: currentUser.name,
      notes: [notes, condition ? `Condition: ${condition}` : ''].filter(Boolean).join(' • ') || 'Key returned to peg storage.',
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  // People handlers
  const addPerson = (personData: Omit<Person, 'id' | 'isArchived' | 'createdAt'>): Person => {
    const newPerson: Person = {
      ...personData,
      id: `person-${Date.now()}`,
      isArchived: false,
      createdAt: new Date().toISOString(),
    };
    setPeople((prev) => [newPerson, ...prev]);
    return newPerson;
  };

  const archivePerson = (id: string) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isArchived: true,
              archivedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const restorePerson = (id: string) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isArchived: false,
              archivedAt: undefined,
            }
          : p
      )
    );
  };

  const deletePerson = (id: string) => {
    // Delete only removes from active directory; activity log references remain intact!
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  // After Hours Manual Log
  const logAfterHoursEntry = ({
    keyId,
    personId,
    action,
    timestamp,
    notes,
    expectedReturnAt,
  }: {
    keyId: string;
    personId: string;
    action: 'checkout' | 'return';
    timestamp: string;
    notes: string;
    expectedReturnAt?: string;
  }) => {
    if (action === 'checkout') {
      checkoutKey({
        keyId,
        personId,
        expectedReturnAt,
        notes: `[After-Hours Entry] ${notes}`,
        isAfterHours: true,
        customTimestamp: timestamp,
      });
    } else {
      returnKey({
        keyId,
        notes: `[After-Hours Return Entry] ${notes}`,
        customTimestamp: timestamp,
      });
    }
  };

  // Visitor & Invite Access Codes
  const createVisitorCode = ({
    label,
    isPermanent,
    expiresInDays,
    notes,
    allowedPropertyId,
    role = 'guest',
  }: {
    label: string;
    isPermanent: boolean;
    expiresInDays?: number;
    notes?: string;
    allowedPropertyId?: string;
    role?: InviteAccessLevel;
  }): VisitorAccessCode => {
    // Generate clean 6-digit code: XXX-XXX
    const part1 = Math.floor(100 + Math.random() * 900);
    const part2 = Math.floor(100 + Math.random() * 900);
    const code = `${part1}-${part2}`;

    let expiresAt: string | null = null;
    if (!isPermanent && expiresInDays) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + expiresInDays);
      expiresAt = expDate.toISOString();
    }

    const newPass: VisitorAccessCode = {
      id: `vis-${Date.now()}`,
      code,
      label,
      createdAt: new Date().toISOString(),
      expiresAt,
      isPermanent,
      createdBy: currentUser.name || 'Sello Ncwani',
      accessCount: 0,
      notes,
      allowedPropertyId,
      role,
    };

    setVisitorCodes((prev) => [newPass, ...prev]);
    return newPass;
  };

  const deleteVisitorCode = (id: string) => {
    setVisitorCodes((prev) => prev.filter((v) => v.id !== id));
    if (activeVisitorSession?.id === id) {
      exitVisitorSession();
    }
  };

  const verifyVisitorCode = (codeString: string): VisitorAccessCode | null => {
    const cleanInput = codeString.replace(/[^0-9]/g, '');
    const found = visitorCodes.find(
      (v) => v.code.replace(/[^0-9]/g, '') === cleanInput
    );

    if (!found) return null;

    // Check expiration if not permanent
    if (!found.isPermanent && found.expiresAt) {
      if (new Date(found.expiresAt) < new Date()) {
        return null; // Expired
      }
    }

    // Increment count
    setVisitorCodes((prev) =>
      prev.map((v) =>
        v.id === found.id
          ? {
              ...v,
              accessCount: v.accessCount + 1,
              lastUsedAt: new Date().toISOString(),
            }
          : v
      )
    );

    return found;
  };

  const loginWithInviteCode = (
    codeOrUrl: string
  ): { success: boolean; error?: string; pass?: VisitorAccessCode } => {
    let extracted = codeOrUrl.trim();
    if (extracted.includes('?')) {
      try {
        const urlObj = new URL(extracted, window.location.origin);
        extracted =
          urlObj.searchParams.get('visitor_code') ||
          urlObj.searchParams.get('invite') ||
          urlObj.searchParams.get('code') ||
          extracted;
      } catch {
        const match = extracted.match(/[?&](?:visitor_code|invite|code)=([^&]+)/);
        if (match) extracted = decodeURIComponent(match[1]);
      }
    }

    const cleanInput = extracted.replace(/[^0-9]/g, '');
    if (!cleanInput || cleanInput.length < 4) {
      return {
        success: false,
        error: 'Please enter a valid 6-digit access code (e.g. 512-890) or invite link.',
      };
    }

    const found = visitorCodes.find(
      (v) => v.code.replace(/[^0-9]/g, '') === cleanInput
    );

    if (!found) {
      return {
        success: false,
        error: `No active pass found matching "${codeOrUrl.trim()}". Check the code and try again.`,
      };
    }

    if (!found.isPermanent && found.expiresAt) {
      if (new Date(found.expiresAt) < new Date()) {
        return {
          success: false,
          error: `This invite pass (${found.label}) has expired. Please request a new pass from the administrator.`,
        };
      }
    }

    // Increment count
    setVisitorCodes((prev) =>
      prev.map((v) =>
        v.id === found.id
          ? {
              ...v,
              accessCount: v.accessCount + 1,
              lastUsedAt: new Date().toISOString(),
            }
          : v
      )
    );

    const accessRole: UserRole = found.role === 'agent' ? 'agent' : 'visitor';
    const guestUser: TeamMember = {
      id: `invite-${found.id}`,
      name: found.label,
      email: found.role === 'agent' ? 'agent.invite@keypoint.local' : 'guest.invite@keypoint.local',
      role: accessRole,
      lastActive: 'Active Now',
    };

    setActiveVisitorSession(found);
    setCurrentUser(guestUser);
    setIsAuthenticated(true);
    localStorage.setItem('keypoint_v3_auth', 'true');
    localStorage.setItem('keypoint_v3_current_user', JSON.stringify(guestUser));
    localStorage.setItem('keypoint_v2_active_visitor', JSON.stringify(found));

    if (found.role === 'guest') {
      setCurrentTab('keys');
    }

    return { success: true, pass: found };
  };

  const isGuestReadOnly =
    activeVisitorSession?.role === 'guest' || (!isAdmin && currentUser.role === 'visitor');

  const exitVisitorSession = () => {
    setActiveVisitorSession(null);
    localStorage.removeItem('keypoint_v2_active_visitor');
    logout();
  };

  // Team management (Enforcing max 2 admins)
  const addTeamMember = (member: Omit<TeamMember, 'id' | 'lastActive'>): { success: boolean; error?: string } => {
    if (member.role === 'admin') {
      const currentAdmins = teamMembers.filter((m) => m.role === 'admin');
      if (currentAdmins.length >= MAX_ADMINS) {
        return {
          success: false,
          error: `Maximum limit of ${MAX_ADMINS} Admins reached. The main admins are sello@gnapest.com and admin@keypoint.com.`,
        };
      }
    }

    const newMember: TeamMember = {
      ...member,
      id: `team-${Date.now()}`,
      password: member.password || 'admin123',
      lastActive: 'Just added',
    };
    setTeamMembers((prev) => [...prev, newMember]);
    return { success: true };
  };

  const updateTeamRole = (id: string, role: UserRole): { success: boolean; error?: string } => {
    const target = teamMembers.find((m) => m.id === id);
    if (!target) return { success: false, error: 'Member not found' };

    if (role === 'admin' && target.role !== 'admin') {
      const currentAdmins = teamMembers.filter((m) => m.role === 'admin');
      if (currentAdmins.length >= MAX_ADMINS) {
        return {
          success: false,
          error: `Maximum limit of ${MAX_ADMINS} Admins reached. Only 2 admins are permitted.`,
        };
      }
    }

    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, role }));
    }
    return { success: true };
  };

  const deleteTeamMember = (id: string) => {
    if (id === currentUser.id) return; // Prevent deleting yourself
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        theme,
        setTheme,
        searchQuery,
        setSearchQuery,
        currentUser,
        setCurrentUser,
        teamMembers,
        addTeamMember,
        updateTeamRole,
        deleteTeamMember,
        isAdmin,
        adminCount,
        maxAdmins: MAX_ADMINS,
        isAuthenticated,
        login,
        logout,
        properties,
        addProperty,
        archiveProperty,
        restoreProperty,
        deleteProperty,
        selectedPropertyId,
        setSelectedPropertyId,
        keys,
        addKey,
        archiveKey,
        restoreKey,
        deleteKey,
        checkoutKey,
        returnKey,
        selectedKeyId,
        setSelectedKeyId,
        people,
        addPerson,
        archivePerson,
        restorePerson,
        deletePerson,
        selectedPersonId,
        setSelectedPersonId,
        activities,
        logAfterHoursEntry,
        visitorCodes,
        createVisitorCode,
        deleteVisitorCode,
        activeVisitorSession,
        setActiveVisitorSession,
        verifyVisitorCode,
        loginWithInviteCode,
        exitVisitorSession,
        isGuestReadOnly,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAddKeyModalOpen,
        setIsAddKeyModalOpen,
        isAddPropertyModalOpen,
        setIsAddPropertyModalOpen,
        isAddPersonModalOpen,
        setIsAddPersonModalOpen,
        preselectedKeyForCheckout,
        setPreselectedKeyForCheckout,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
