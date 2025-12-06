import React from 'react';
import { FiChevronDown, FiChevronUp, FiChevronsDown } from 'react-icons/fi';
import classNames from 'classnames';
import styles from './Table.module.css';

export interface Column<T> {
  key: string;
  title: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig | null) => void;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  className?: string;
  emptyText?: string;
  loading?: boolean;
}

const Table = <T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  sortConfig,
  onSort,
  striped = true,
  hoverable = true,
  compact = false,
  className,
  emptyText = 'Нет данных',
  loading = false,
}: TableProps<T>) => {
  const handleSort = (key: string) => {
    if (!onSort || !columns.find(col => col.key === key)?.sortable) return;

    if (sortConfig?.key === key) {
      if (sortConfig.direction === 'asc') {
        onSort({ key, direction: 'desc' });
      } else {
        onSort(null);
      }
    } else {
      onSort({ key, direction: 'asc' });
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <FiChevronsDown className={styles.sortIcon} />;
    }
    return sortConfig.direction === 'asc' ? (
      <FiChevronUp className={styles.sortIconActive} />
    ) : (
      <FiChevronDown className={styles.sortIconActive} />
    );
  };

  const tableClasses = classNames(
    styles.table,
    {
      [styles.striped]: striped,
      [styles.hoverable]: hoverable,
      [styles.compact]: compact,
      [styles.loading]: loading,
    },
    className
  );

  return (
    <div className={styles.tableContainer}>
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
                className={classNames({
                  [styles.sortable]: column.sortable && onSort,
                })}
                onClick={() => handleSort(column.key)}
              >
                <div className={styles.headerCell}>
                  <span>{column.title}</span>
                  {column.sortable && onSort && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`skeleton-${index}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    <div className={styles.skeleton} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((row) => (
              <tr key={keyExtractor(row)}>
                {columns.map((column) => {
                  const cellValue = row[column.key];
                  return (
                    <td
                      key={column.key}
                      style={{ textAlign: column.align || 'left' }}
                    >
                      {column.render
                        ? column.render(cellValue, row)
                        : cellValue}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.emptyCell}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;