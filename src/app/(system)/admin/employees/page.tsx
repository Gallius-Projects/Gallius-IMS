'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Trash2, AlertCircle, LucideIdCard } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { useUserContext } from '@/context/UserContext';
import TableTemplate from '@/app/components/ui-templates/table-template';
import AddEmployee from '@/app/components/modals/employees/add-employee-modal';
import EditEmployee from '@/app/components/modals/employees/edit-employee-modal';
import AddAccountModal from '@/app/components/modals/accounts/add-account-modal';
import EditAccountModal from '@/app/components/modals/accounts/edit-account-modal';
import { Employees, EmployeeFormData } from '@/types/employees';
import { ConfirmationDialog } from '@/app/components/ui-templates/confirmation-dialog';

interface Account {
  id: number;
  username: string;
  roleId: number;
  status: boolean;
}

export default function EmployeesPage() {
  const { user, isAuthenticated } = useUserContext();
  // const { setOffices, setDepartments, setPositions, setRoles } =
  //   useLibrariesContext();

  const [search, setSearch] = useState('');

  // Data states
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isAddAccountFormOpen, setIsAddAccountFormOpen] = useState(false);
  const [isEditAccountFormOpen, setIsEditAccountFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeId: '',
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    officeId: null,
    departmentId: null,
    positionId: null,
    status: false,
  });

  const [accountFormData, setAccountFormData] = useState({
    username: '',
    password: '',
    roleId: '',
    status: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Delete target state
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(
    null
  );

  const [prevEmpData, setPrevEmpData] = useState({});
  const [prevAcctData, setPrevAcctData] = useState({});

  // Fetch Departments callback
  const fetchEmployees = useCallback(async () => {
    if (!localStorage.getItem('auth_token')) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/employees', {
        params: { search },
      });

      setEmployees(response.data);
    } catch (err: { message: string } | unknown) {
      console.error('Fetch employees error:', err);
      setError(
        (err as { message: string }).message ||
          'Could not connect to the database. Make sure MySQL is running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees();
    }, 300); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [fetchEmployees]);

  // Open form for account creation
  const handleCreateAccountOpen = (employee: Employees) => {
    setAccountFormData({
      username: '',
      password: '',
      roleId: '',
      status: true,
    });
    setPrevAcctData(employee);
    setIsAddAccountFormOpen(true);
  };

  // Open form for account editing
  const handleEditAccountOpen = async (employee: Employees) => {
    const getOldAccount = await axiosInstance.get(
      `/accounts/${employee?.accounts?.uuid}`
    );
    const oldAccountData = getOldAccount.data;

    setPrevAcctData(oldAccountData);

    setSelectedEmployeeId(employee?.id);
    setIsEditAccountFormOpen(true);
  };

  const handleAccountClose = () => {
    setIsAddAccountFormOpen(false);
    setIsEditAccountFormOpen(false);
    setAccountFormData({
      username: '',
      password: '',
      roleId: '',
      status: true,
    });
  };

  // Open form for creation
  const handleCreateOpen = () => {
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      suffix: '',
      officeId: null,
      departmentId: null,
      positionId: null,
      status: false,
    });
    setIsAddFormOpen(true);
  };

  // Open form for editing
  const handleEditOpen = async (employee: Employees) => {
    const getOldEmployee = await axiosInstance.get(
      `/employees/${employee?.id}`
    );
    const oldEmployeeData = getOldEmployee.data;

    setPrevEmpData(oldEmployeeData);

    setIsEditFormOpen(true);
  };

  // Open delete confirm
  const handleDeleteOpen = (id: number) => {
    setDeletingEmployeeId(id);
    setIsDeleteOpen(true);
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
    } catch (err: { message: string } | unknown) {
      alert(
        (err as { message: string }).message || 'Failed to delete employee'
      );
    }
  };

  const handleClose = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      suffix: '',
      officeId: null,
      departmentId: null,
      positionId: null,
      status: false,
    });
    setSelectedEmployeeId(null);
    setDeletingEmployeeId(null);
  };

  // Trigger fetch when parameters change
  useEffect(() => {
    if (isAuthenticated) {
      const delayDebounceFn = setTimeout(() => {
        fetchEmployees();
      }, 300); // Debounce search
      return () => clearTimeout(delayDebounceFn);
    }
  }, [fetchEmployees, isAuthenticated]);

  const columns = [
    {
      header: 'Employee',
      accessor: 'firstName',
      dataType: 'string',
      fontStyle: 'semibold',
      fontSize: 'sm',
      secondary: 'lastName',
      emphasizeLevel: 'high',
    },
    {
      header: 'Department',
      accessor: 'department',
      dataType: 'object',
      fontStyle: 'normal',
      fontSize: 'sm',
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
      header: 'Account Status',
      accessor: 'accountStatus',
      dataType: 'boolean',
      fontStyle: 'normal',
      emphasizeLevel: 'high',
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

  return (
    <div className="flex max-h-screen min-h-screen flex-col bg-slate-50/50 px-4 py-8 font-sans text-slate-900 transition-all duration-300 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-6 flex w-fit gap-2 border-b-2 border-slate-300 pr-2 pb-2 dark:border-slate-700">
        <LucideIdCard />
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
          canCreateEditAccount={user?.role === 'superadmin'}
          canEdit={user?.role === 'superadmin' || user?.role === 'admin'}
          canDelete={user?.role === 'superadmin' || user?.role === 'admin'}
        />
      </main>

      {/* FORM MODAL (Add / Edit) */}
      {isAddFormOpen && (
        <AddEmployee
          formData={formData}
          setFormData={setFormData}
          handleClose={handleClose}
          fetchEmployees={fetchEmployees}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}
      {isEditFormOpen && (
        <EditEmployee
          formData={formData}
          setFormData={setFormData}
          handleClose={handleClose}
          fetchEmployees={fetchEmployees}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          dataToUpdate={prevEmpData}
        />
      )}

      {isAddAccountFormOpen && (
        <AddAccountModal
          accountFormData={accountFormData}
          setAccountFormData={setAccountFormData}
          fetchEmployees={fetchEmployees}
          handleClose={handleAccountClose}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          dataToUpdate={prevAcctData}
        />
      )}
      {isEditAccountFormOpen && (
        <EditAccountModal
          accountFormData={accountFormData}
          setAccountFormData={setAccountFormData}
          fetchEmployees={fetchEmployees}
          handleClose={handleAccountClose}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          dataToUpdate={prevAcctData}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Employee"
          description={`Are you sure you want to delete ${employees.find((employee) => employee.id === deletingEmployeeId)?.firstName}?`}
          isLoading={isLoading}
          type="delete"
          iconColor="text-rose-600 dark:text-rose-400"
        />
      )}
    </div>
  );
}
