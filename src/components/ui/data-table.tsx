import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Loader2, Database } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
  emptyMessage?: string;
  rowKey?: keyof T | ((record: T) => string | number);
}

type SortOrder = 'asc' | 'desc' | null;

interface SortState {
  column: string | null;
  order: SortOrder;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  className,
  emptyMessage = 'No data available',
  rowKey = 'id',
  ...props
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ column: null, order: null });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string | number>>(new Set());

  // Get unique key for each row
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Sort data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.order) {
      return data;
    }

    const column = columns.find(col => col.key === sortState.column);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      if (aValue === bValue) return 0;
      
      let comparison = 0;
      if (aValue == null) comparison = -1;
      else if (bValue == null) comparison = 1;
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue < bValue ? -1 : 1;
      }

      return sortState.order === 'desc' ? -comparison : comparison;
    });
  }, [data, sortState, columns]);

  // Handle column sort
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortState(prev => {
      if (prev.column !== column.key) {
        return { column: column.key, order: 'asc' };
      }
      
      switch (prev.order) {
        case null:
          return { column: column.key, order: 'asc' };
        case 'asc':
          return { column: column.key, order: 'desc' };
        case 'desc':
          return { column: null, order: null };
        default:
          return { column: null, order: null };
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (rowKey: string | number, selected: boolean) => {
    const newSelectedKeys = new Set(selectedRowKeys);
    
    if (selected) {
      newSelectedKeys.add(rowKey);
    } else {
      newSelectedKeys.delete(rowKey);
    }
    
    setSelectedRowKeys(newSelectedKeys);
    
    if (onRowSelect) {
      const selectedRows = data.filter((record, index) => 
        newSelectedKeys.has(getRowKey(record, index))
      );
      onRowSelect(selectedRows);
    }
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allKeys = new Set(data.map((record, index) => getRowKey(record, index)));
      setSelectedRowKeys(allKeys);
      onRowSelect?.(data);
    } else {
      setSelectedRowKeys(new Set());
      onRowSelect?.([]);
    }
  };

  // Check if all rows are selected
  const isAllSelected = data.length > 0 && selectedRowKeys.size === data.length;
  const isIndeterminate = selectedRowKeys.size > 0 && selectedRowKeys.size < data.length;

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortState.column === column.key;
    
    if (!isActive) {
      return (
        <div className="ml-2 flex flex-col">
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
          <ChevronDown className="h-3 w-3 text-muted-foreground -mt-1" />
        </div>
      );
    }

    return (
      <div className="ml-2">
        {sortState.order === 'asc' ? (
          <ChevronUp className="h-4 w-4 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" />
        )}
      </div>
    );
  };

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <div className={cn('rounded-md border bg-card', className)}>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Data</h3>
          <p className="text-muted-foreground text-center">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border bg-card overflow-hidden', className)} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-table-header">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(element) => {
                      if (element && 'indeterminate' in element) {
                        (element as any).indeterminate = isIndeterminate;
                      }
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-foreground',
                    column.sortable && 'cursor-pointer hover:bg-secondary-hover transition-colors',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.title}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                    <span className="text-muted-foreground">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRowKeys.has(key);
                
                return (
                  <tr
                    key={key}
                    className={cn(
                      'border-t border-border transition-colors',
                      'hover:bg-table-row-hover',
                      isSelected && 'bg-table-selected'
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleRowSelect(key, !!checked)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = record[column.dataIndex];
                      const displayValue = column.render 
                        ? column.render(value, record, index)
                        : value;

                      return (
                        <td
                          key={column.key}
                          className={cn(
                            'px-4 py-3 text-sm text-foreground',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { DataTable };
export type { DataTableProps, Column };