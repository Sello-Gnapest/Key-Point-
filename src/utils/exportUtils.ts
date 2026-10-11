import * as XLSX from 'xlsx';
import { KeyItem, Property, KeyActivity } from '../types';

/**
 * Format ISO date string into readable format
 */
export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

export const formatDateOnly = (isoString?: string): string => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toISOString().split('T')[0];
  } catch {
    return isoString;
  }
};

/**
 * Export full master keys inventory spreadsheet (.xlsx)
 */
export const exportFullKeysExcel = (keys: KeyItem[], properties: Property[]) => {
  const propMap = new Map(properties.map((p) => [p.id, p]));

  const rows = keys.map((key) => {
    const prop = propMap.get(key.propertyId);
    return {
      'Key Tag': key.tag,
      'Property Name': prop?.name || 'Unassigned',
      'Property Address': prop?.address || '—',
      'Key Type': key.keyType,
      'Peg / Hook Location': key.pegLocation,
      'Status': key.status,
      'Current Holder': key.currentBorrowerName || (key.status === 'Available' ? 'In Key Cabinet' : '—'),
      'Company': key.currentBorrowerCompany || '—',
      'Holder Contact': key.currentBorrowerPhone || '—',
      'Checked Out At': formatDateTime(key.checkedOutAt),
      'Expected Return': formatDateTime(key.expectedReturnAt),
      'Copies / Sets': key.copies,
      'Archived': key.isArchived ? 'Yes (Archived)' : 'No (Active)',
      'Archive Reason': key.archivedReason || '—',
      'General Notes': key.notes || '—',
      'Checkout Notes': key.checkoutNotes || '—',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Key Tag
    { wch: 26 }, // Property Name
    { wch: 35 }, // Property Address
    { wch: 15 }, // Key Type
    { wch: 18 }, // Peg Location
    { wch: 14 }, // Status
    { wch: 22 }, // Current Holder
    { wch: 25 }, // Company
    { wch: 18 }, // Holder Contact
    { wch: 20 }, // Checked Out At
    { wch: 20 }, // Expected Return
    { wch: 12 }, // Copies
    { wch: 14 }, // Archived
    { wch: 25 }, // Archive Reason
    { wch: 30 }, // General Notes
    { wch: 30 }, // Checkout Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Keys Inventory');

  const todayStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `KeyPoint_Master_Keys_Report_${todayStr}.xlsx`);
};

/**
 * Export daily activity report and after-hours physical sign-out sheet
 */
export const exportDailyActivityExcel = (
  activities: KeyActivity[],
  selectedDate: string, // YYYY-MM-DD
  keys: KeyItem[],
  properties: Property[]
) => {
  // Filter activities for this date
  const filteredActivities = activities.filter((act) => {
    return act.timestamp.startsWith(selectedDate);
  });

  // Sheet 1: Daily Activity Audit Log
  const logRows = filteredActivities.map((act) => ({
    'Timestamp': formatDateTime(act.timestamp),
    'Action': act.action.toUpperCase(),
    'Key Tag': act.keyTag,
    'Property': act.propertyName,
    'Address': act.propertyAddress,
    'Person / Borrower': act.personName,
    'Company': act.personCompany || 'Independent',
    'Phone': act.personPhone || '—',
    'Logged By': act.performedBy,
    'After-Hours Entry': act.isAfterHours ? 'YES' : 'NO',
    'Expected Return': formatDateTime(act.expectedReturnAt),
    'Notes / Purpose': act.notes || '—',
  }));

  const activitySheet = XLSX.utils.json_to_sheet(
    logRows.length > 0
      ? logRows
      : [
          {
            'Notice': `No recorded system activity on ${selectedDate}. You can use the After-Hours sheet below for manual entries.`,
          },
        ]
  );

  activitySheet['!cols'] = [
    { wch: 20 },
    { wch: 14 },
    { wch: 12 },
    { wch: 25 },
    { wch: 30 },
    { wch: 22 },
    { wch: 24 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 },
    { wch: 20 },
    { wch: 35 },
  ];

  // Sheet 2: Currently In Use Keys Snapshot (what is currently out for overnight tracking)
  const propMap = new Map(properties.map((p) => [p.id, p]));
  const currentlyOut = keys.filter((k) => k.status === 'Checked Out');
  const activeOutRows = currentlyOut.map((k) => {
    const prop = propMap.get(k.propertyId);
    return {
      'Key Tag': k.tag,
      'Property': prop?.name || '—',
      'Address': prop?.address || '—',
      'Key Type': k.keyType,
      'Held By Person': k.currentBorrowerName || '—',
      'Company': k.currentBorrowerCompany || '—',
      'Contact Number': k.currentBorrowerPhone || '—',
      'Checked Out Date': formatDateTime(k.checkedOutAt),
      'Expected Return': formatDateTime(k.expectedReturnAt),
      'Current Peg': k.pegLocation,
    };
  });

  const activeSheet = XLSX.utils.json_to_sheet(activeOutRows);
  activeSheet['!cols'] = [
    { wch: 12 },
    { wch: 24 },
    { wch: 30 },
    { wch: 16 },
    { wch: 22 },
    { wch: 24 },
    { wch: 18 },
    { wch: 20 },
    { wch: 20 },
    { wch: 16 },
  ];

  // Sheet 3: Printable After-Hours Manual Handover Template (with 15 blank write-in rows)
  const manualBlankRows: Record<string, string>[] = [];
  for (let i = 1; i <= 20; i++) {
    manualBlankRows.push({
      'Entry #': `${i}`,
      'Date': selectedDate,
      'Time Out': '',
      'Key Tag (e.g. H0015)': '',
      'Property Name / Unit': '',
      'Agent / Person Name': '',
      'Company Name': '',
      'Contact Phone': '',
      'Purpose / Client Name': '',
      'Time Returned': '',
      'Agent Signature': '',
      'System Captured (Y/N)': '',
    });
  }

  const manualSheet = XLSX.utils.json_to_sheet(manualBlankRows);
  manualSheet['!cols'] = [
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 26 },
    { wch: 22 },
    { wch: 22 },
    { wch: 16 },
    { wch: 26 },
    { wch: 14 },
    { wch: 20 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, activitySheet, `Activity Log (${selectedDate})`);
  XLSX.utils.book_append_sheet(workbook, activeSheet, 'Currently Out Keys');
  XLSX.utils.book_append_sheet(workbook, manualSheet, 'After-Hours Manual Template');

  XLSX.writeFile(workbook, `KeyPoint_Daily_Activity_${selectedDate}.xlsx`);
};

/**
 * Clean CSV export utility
 */
export const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const escapeCell = (val: string | number) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
