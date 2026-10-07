'use client';

import * as Lucide from 'lucide-react';
import { Edit, Eye, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

export default function TableTemplate({
  rows,
  columns,
  tableName,
  isLoading,
  handleCreateAccountOpen = () => {},
  handleEditAccountOpen = () => {},
  handleDetailOpen = () => {},
  handleEditOpen = () => {},
  handleDeleteOpen = () => {},
  canCreateAccount = false,
  canView = false,
  canEdit = false,
  canDelete = false,
}: {
  rows: any[];
  columns: any[];
  tableName: string;
  isLoading: boolean;
  handleCreateAccountOpen?: (row: any) => void;
  handleEditAccountOpen?: (row: any) => void;
  handleDetailOpen?: (row: any) => void;
  handleEditOpen?: (row: any) => void;
  handleDeleteOpen?: (id: number) => void;
  canCreateAccount?: boolean;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  return (
    <div className="h-[calc(100vh-320px)] overflow-y-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
          <tr className="border-b border-slate-200/60 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-950">
            {columns.map((column: any, index: number) => (
              <th
                key={index}
                className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500"
              >
                {column.header}
              </th>
            ))}
            {(canView || canEdit || canDelete) && (
              <th className="px-5 py-3.5 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/40 dark:divide-slate-800/40">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                  <span>Loading {tableName.toLowerCase()}...</span>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-sm text-slate-400 dark:text-slate-500"
              >
                No {tableName.toLowerCase()} found. Try adjusting filters or
                create a new {tableName.toLowerCase()}.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id || row.uuid}
                className="group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              >
                {columns.map((column, index) => {
                  const Icon =
                    column.accessor === 'icon'
                      ? Lucide[row[column.accessor] as keyof typeof Lucide]
                      : null;

                  return (
                    <td key={index} className="px-5 py-4">
                      <span
                        className={`block text-${column.fontSize} ${
                          column.fontStyle === 'semibold'
                            ? 'font-semibold'
                            : column.fontStyle === 'bold'
                              ? 'font-bold'
                              : 'font-normal'
                        } ${column.emphasizeLevel === 'high' ? 'text-slate-900 dark:text-white' : column.emphasizeLevel === 'medium' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'} `}
                      >
                        {column.dataType === 'date' ? (
                          new Date(row[column.accessor]).toLocaleString()
                        ) : column.dataType === 'boolean' ? (
                          row[column.accessor] === 1 ? (
                            'Active'
                          ) : (
                            'Inactive'
                          )
                        ) : column.dataType === 'array' ? (
                          row[column.accessor].join(', ')
                        ) : column.accessor === 'icon' ? (
                          Icon ? (
                            <div className="flex items-center gap-1">
                              <Icon className="size-4" />
                              {row[column.accessor]}
                            </div>
                          ) : (
                            column.accessor
                          )
                        ) : (
                          row[column.accessor]
                        )}
                      </span>

                      {column.secondary && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {row[column.secondary] || '--'}
                        </span>
                      )}
                    </td>
                  );
                })}

                {(canView || canEdit || canDelete) && (
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {canCreateAccount && !row?.accounts?.uuid && (
                        <button
                          onClick={() => handleCreateAccountOpen(row)}
                          className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                          title="Create Account"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {canCreateAccount && row?.accounts?.uuid && (
                        <button
                          onClick={() => handleEditAccountOpen(row)}
                          className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                          title="Edit Account"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {canView && (
                        <button
                          onClick={() => handleDetailOpen(row)}
                          className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                          title={`View ${tableName.toLowerCase()}`}
                        >
                          {/* View Button */}
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => handleEditOpen(row)}
                          className="dark:hover:bg-slate-850 cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:text-indigo-400"
                          title={`Edit ${tableName.toLowerCase()}`}
                        >
                          {/* Edit Button */}
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteOpen(row.id)}
                          className="cursor-pointer rounded-lg border border-slate-200/50 bg-white p-1.5 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-rose-950/20 dark:hover:text-rose-400"
                          title={`Delete ${tableName.toLowerCase()}`}
                        >
                          {/* Delete Button */}
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
