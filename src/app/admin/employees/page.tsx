'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  AlertCircle,
  LucideBuilding2,
} from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import AddEditEmployee from '@/app/components/modals/employees/add-edit-employee';
import AddEditAccountModal from '@/app/components/modals/employees/account/add-edit-account';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix: string;
  officeId: number;
  departmentId: number;
  positionId: number;
  status: boolean;
}

interface Account {
  id: number;
  username: string;
  roleId: number;
  employeeId: number;
  status: boolean;
}

export default function EmployeesPage() {
  const { user, isAuthenticated } = useUserContext();

  const [search, setSearch] = useState('');

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [accountFormMode, setAccountFormMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    officeId: '',
    departmentId: '',
    positionId: '',
    status: false,
  });

  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
    roleId: '',
    employeeId: '',
    status: true,
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [accountFormError, setAccountFormError] = useState('');

  // Detail / Delete target state
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(
    null
  );

  // Fetch Departments callback
  const fetchEmployees = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/employees', {
        params: { search },
      });

      // console.log(response.data);

      setEmployees(response.data);
    } catch (err: any) {
      console.error('Fetch employees error:', err);
      setError(
        err.message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Open form for account creation
  const handleCreateAccountOpen = () => {
    setAccountFormData({
      username: '',
      password: '',
      roleId: '',
      employeeId: '',
      status: true,
    });
    setAccountFormError('');
    setAccountFormMode('create');
    setIsAccountFormOpen(true);
  };

  // Open form for account editing
  const handleEditAccountOpen = async (employee: Employee) => {
    // console.log(employee);

    const getOldAccount = await axiosInstance.get(`/accounts`, {
      params: { accountId: employee?.accounts?.uuid },
    });
    const oldAccountData = getOldAccount.data;

    setAccountFormMode('edit');
    setSelectedEmployeeId(employee?.id);
    setAccountFormData({
      username: oldAccountData.username,
      password: '',
      roleId: oldAccountData.roleId,
      employeeId: oldAccountData.employeeId,
      status: oldAccountData.status,
    });

    // console.log({
    //   username: oldAccountData.username,
    //   password: '',
    //   roleId: oldAccountData.roleId,
    //   employeeId: oldAccountData.employeeId,
    //   status: oldAccountData.status,
    // });

    setAccountFormError('');
    setIsAccountFormOpen(true);
  };

  const handleAccountClose = () => {
    setIsAccountFormOpen(false);
    setAccountFormMode('create');
    setAccountFormData({
      username: '',
      password: '',
      roleId: '',
      employeeId: '',
      status: true,
    });
    setAccountFormError('');
  };

  // Open form for creation
  const handleCreateOpen = () => {
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      suffix: '',
      officeId: '',
      departmentId: '',
      positionId: '',
      status: false,
    });
    setFormError('');
    setFormMode('create');
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = async (employee: Employee) => {
    const getOldEmployee = await axiosInstance.get(
      `/employees/${employee?.id}`
    );
    const oldEmployeeData = getOldEmployee.data;

    setOldEmployee(oldEmployeeData);

    setFormMode('edit');
    setSelectedEmployeeId(employee.id);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName,
      suffix: employee.suffix,
      officeId: employee.officeId,
      departmentId: employee.departmentId,
      positionId: employee.positionId,
      status: employee.status,
    });

    setOfficeSearch(oldEmployeeData?.office?.name || employee?.office || '');
    setDepartmentSearch(
      oldEmployeeData?.department?.name || employee?.department || ''
    );
    setCategorySearch(
      oldEmployeeData?.position?.name || employee?.position || ''
    );

    setFormError('');
    setIsFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingEmployeeId(id);
    setIsDeleteOpen(true);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Employee name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formMode === 'create') {
        await axiosInstance.post('/employees', {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      } else {
        await axiosInstance.put(`/employees/${selectedEmployeeId}`, {
          ...formData,
          updatedBy: user?.id ?? '',
        });
      }
      setIsFormOpen(false);
      fetchEmployees();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete department handler
  const handleDeleteConfirm = async () => {
    if (!deletingEmployeeId || !user) return;
    try {
      await axiosInstance.delete(`/employees/${deletingEmployeeId}`, {
        data: {
          updatedBy: user?.id ?? '',
        },
      });
      setIsDeleteOpen(false);
      setDeletingEmployeeId(null);
      fetchEmployees();
    } catch (err: any) {
      alert(err.message || 'Failed to delete employee');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setFormMode('create');
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      suffix: '',
      officeId: '',
      departmentId: '',
      positionId: '',
      status: false,
    });
    setFormError('');
    setSelectedEmployeeId(null);
    setDeletingEmployeeId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployees();
    }
  }, [fetchEmployees, isAuthenticated]);

  const columns = [
    {
      header: 'Employee',
      accessor: 'firstName',
      dataType: 'string',
      fontStyle: 'bold',
      secondary: 'lastName',
      emphasizeLevel: 'high',
    },
    {
      header: 'Department',
      accessor: 'department',
      dataType: 'object',
      fontStyle: 'normal',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Position',
      accessor: 'position',
      dataType: 'object',
      fontStyle: 'normal',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Status',
      accessor: 'status',
      dataType: 'boolean',
      fontStyle: 'normal',
      emphasizeLevel: 'medium',
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      dataType: 'date',
      fontStyle: 'normal',
    },
    {
      header: 'Updated At',
      accessor: 'updatedAt',
      dataType: 'date',
      fontStyle: 'normal',
    },
  ];

  // console.log(accountFormData);

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideBuilding2 />
        <h5 className="font-league-spartan text-lg font-bold text-slate-900 dark:text-slate-100">
          Employees
        </h5>
      </div>

      {/* Connection/Db Error Notice */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold">Database Sync Issue</h4>
            <p className="mt-1 text-xs leading-relaxed opacity-90">{error}</p>
            <p className="mt-2 rounded border border-amber-200/30 bg-white/40 p-2 font-mono text-[11px] dark:border-amber-900/30 dark:bg-slate-900/40">
              Setup reminder: Run{' '}
              <code className="font-bold">docker compose up -d</code> to start
              MySQL and configure the <code className="font-bold">.env</code>{' '}
              DATABASE_URL, then run{' '}
              <code className="font-bold">npx prisma db push</code>.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search and Actions */}
      <main className="space-y-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Filters Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Add New Button */}
            <button
              onClick={handleCreateOpen}
              className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 lg:ml-0 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableTemplate
          rows={employees.map((employee) => ({
            ...employee,
            position: employee.position ? employee.position.name : '--',
            department: employee.department ? employee.department.name : '--',
          }))}
          columns={columns}
          tableName="Employees"
          isLoading={isLoading}
          handleCreateAccountOpen={handleCreateAccountOpen}
          handleEditAccountOpen={handleEditAccountOpen}
          handleEditOpen={handleEditOpen}
          handleDeleteOpen={handleDeleteOpen}
          canCreateAccount={user?.role === 'superadmin'}
          canEditAccount={user?.role === 'superadmin'}
          canEdit={user?.role === 'superadmin'}
          canDelete={user?.role === 'superadmin'}
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <AddEditEmployee
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          handleClose={handleClose}
          handleFormSubmit={handleFormSubmit}
          formError={formError}
          isSubmitting={isSubmitting}
        />
      )}

      {isAccountFormOpen && (
        <AddEditAccountModal
          accountFormMode={accountFormMode}
          accountFormData={accountFormData}
          setAccountFormData={setAccountFormData}
          handleCreateAccountOpen={handleCreateAccountOpen}
          handleClose={handleAccountClose}
          accountFormError={accountFormError}
          setAccountFormError={setAccountFormError}
          isSubmitting={isSubmitting}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-4 p-6 text-center">
              <div className="inline-flex rounded-full border border-rose-100 bg-rose-50 p-3 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Employee Confirmation
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Are you sure you want to remove this employee? This action is
                  permanent and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
