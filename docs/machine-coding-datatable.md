# Machine Coding: DataTable (Searchable, Filterable, Paginated)

**Timebox:** 60–90 minutes  
**Difficulty:** Medium  
**Topics:** React state management, filtering, sorting, pagination, memoization, accessibility

---

## Problem Statement

Build a React `DataTable` component that displays tabular data with the following features:
- **Search:** filter rows by keyword across all columns
- **Sorting:** click column headers to sort ascending/descending
- **Filtering:** filter by column values (e.g., status, category)
- **Pagination:** show N rows per page with prev/next navigation
- **Accessibility:** keyboard navigation, ARIA roles
- **Performance:** memoization for large datasets (1000+ rows)

---

## Requirements & Acceptance Criteria

### Must-have
1. **Data model:** accept an array of objects (rows) and array of column configs (name, label, sortable, filterable).
2. **Search:** single search input that filters rows by keyword across all columns (case-insensitive).
3. **Sorting:** click column header to toggle sort direction (asc/desc); show visual indicator.
4. **Pagination:** display 10 rows per page by default; show page controls (prev/next, page info).
5. **Filtering:** dropdown or checkboxes per column to filter rows.
6. **State management:** controlled component (parent owns state) or uncontrolled (internal state) — your choice, document it.
7. **Accessibility:** keyboard Tab to navigate headers/controls, keyboard Space/Enter to sort.
8. **Performance:** React.memo or useMemo for expensive computations; no unnecessary re-renders.

### Nice-to-have
- Editable cells (inline edit on double-click)
- Row selection (checkbox column)
- Multi-column sort
- Custom cell renderers (components)
- Export to CSV

---

## Clarifying Questions (answer these first)

1. **Data shape:** assume flat objects like `{ id, name, status, date }`? Or nested?
2. **Search scope:** search all columns or only visible ones?
3. **Filter UI:** single column at a time or multi-column (AND/OR logic)?
4. **Empty/error states:** how to display no results or loading?
5. **Sorting reset:** clicking same header again reverses order, or clicking a third time resets to original?

---

## Starter Template

```typescript
// components/DataTable/DataTable.tsx

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onSearch?: (query: string) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, string[]>) => void;
}

export const DataTable = React.memo(function DataTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
  onSearch,
  onSort,
  onFilter,
}: DataTableProps<T>) {
  // TODO: implement search, sort, filter, pagination state
  // TODO: compute filtered and sorted data
  // TODO: compute pagination and current page rows
  // TODO: render table with headers, body, and controls
  // TODO: accessibility: keyboard nav, ARIA roles

  return (
    <div className="data-table">
      {/* Search input */}
      {/* Column filters */}
      {/* Table */}
      {/* Pagination controls */}
    </div>
  );
});
```

---

## Test Cases (write these)

```typescript
// DataTable.test.tsx

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'Alice', status: 'active', date: '2025-01-01' },
    { id: 2, name: 'Bob', status: 'inactive', date: '2025-01-02' },
    { id: 3, name: 'Charlie', status: 'active', date: '2025-01-03' },
  ];

  const mockColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', filterable: true },
    { key: 'date', label: 'Date', sortable: true },
  ];

  it('renders all rows', () => {
    // Assert: 3 rows visible
  });

  it('filters rows by search query', () => {
    // Search for "Alice"
    // Assert: only Alice row visible
  });

  it('sorts by column when header clicked', () => {
    // Click "Name" header
    // Assert: rows sorted alphabetically
    // Click again, assert: reverse order
  });

  it('paginates rows (10 per page)', () => {
    // Create 25 rows
    // Assert: first page shows 10 rows
    // Click "Next"
    // Assert: page 2 shows 10 rows
  });

  it('filters rows by column value', () => {
    // Click status filter, select 'active'
    // Assert: only active rows visible
  });

  it('combines search + sort + filter', () => {
    // Search "alice", filter status='active', sort by date
    // Assert: correct filtered, sorted result
  });

  it('keyboard navigation: Tab through headers', () => {
    // Tab to first header, press Space
    // Assert: sort applied
  });

  it('shows no results message', () => {
    // Search for non-existent term
    // Assert: "No results" message shown
  });
});
```

---

## Implementation Checklist

- [ ] Define `Column` and `DataTableProps` types
- [ ] Create `DataTable` component (React.memo)
- [ ] Implement search state + search filter logic
- [ ] Implement sort state + sort logic (toggle asc/desc)
- [ ] Implement filter state + filter logic (per column)
- [ ] Implement pagination (page, pageSize, totalPages)
- [ ] Render search input
- [ ] Render column filter dropdowns/checkboxes
- [ ] Render table with headers and body
- [ ] Render pagination controls (prev/next, page info)
- [ ] Add keyboard accessibility (Tab, Space/Enter to sort)
- [ ] Add ARIA roles (table, columnheader, role="status" for updates)
- [ ] Memoize expensive computations (filtering, sorting, paginating)
- [ ] Write unit tests for all features
- [ ] Add loading/empty state UI
- [ ] Add visual indicators (sort arrow, active filter badges)

---

## Complexity & Performance Notes

- **Time:** O(n log n) for sort (per filter/search), O(n) for filter + search per keystroke.
- **Space:** O(n) for filtered results.
- **Optimization:** use `useMemo` for `filteredData` and `sortedData`; use `React.memo` on row components if rendering custom cells.
- **Large datasets:** consider virtualization (react-window) if 1000+ rows; for now, simple pagination is acceptable.

---

## Session Flow (coaching)

1. **Read problem (5m):** understand requirements, ask clarifying questions.
2. **Design (10m):** outline state shape, data flow (search → filter → sort → paginate), component structure.
3. **Implement (40–50m):** write component, tests, and UI.
4. **Review & refine (10–20m):** add accessibility, memoization, test edge cases, polish.
5. **Reflection (5–10m):** what worked, what to improve, 3 takeaways.

---

## Hints (reveal as needed)

- Use `useCallback` for sort/filter handlers to avoid unnecessary re-renders.
- Keep state minimal: `searchQuery`, `sortKey`, `sortDirection`, `filters`, `currentPage`.
- Compute `filteredData`, `sortedData`, `paginatedData` in order (not simultaneously).
- For large datasets, compute pagination only on displayed page (lazy).
- Use `aria-sort="ascending" | "descending" | "none"` on sortable headers.

---

Ready? Start by answering the 5 clarifying questions above, then outline your data flow and component structure. I'll give feedback as you implement.
