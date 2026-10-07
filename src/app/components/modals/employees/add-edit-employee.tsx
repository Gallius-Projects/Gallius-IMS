import axiosInstance from '@/lib/axiosInstance';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function AddEditEmployee({
  formMode,
  formData,
  setFormData,
  handleClose,
  handleFormSubmit,
  formError,
  isSubmitting,
}: {
  formMode: 'create' | 'edit';
  formData: any;
  setFormData: any;
  handleClose: () => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  formError: string;
  isSubmitting: boolean;
}) {
  const departmentRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);
  const officeRef = useRef<HTMLDivElement>(null);

  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [showDepartment, setShowDepartment] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState('');

  const [showPosition, setShowPosition] = useState(false);
  const [positionSearch, setPositionSearch] = useState('');

  const [showOffice, setShowOffice] = useState(false);
  const [officeSearch, setOfficeSearch] = useState('');

  const filteredOffices = offices.filter((office: any) => {
    const officeName = `${office.name}`.toLowerCase();

    return officeName.includes(officeSearch.toLowerCase());
  });

  const filteredDepartments = departments.filter((department: any) => {
    const departmentName = `${department.name}`.toLowerCase();

    return departmentName.includes(departmentSearch.toLowerCase());
  });

  const filteredPositions = positions.filter((position: any) => {
    const positionName = `${position.name}`.toLowerCase();

    return positionName.includes(positionSearch.toLowerCase());
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axiosInstance.get('/departments');
      setDepartments(response.data);
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      const response = await axiosInstance.get('/positions');
      setPositions(response.data);
    };

    fetchPositions();
  }, []);

  useEffect(() => {
    const fetchOffices = async () => {
      const response = await axiosInstance.get('/offices');
      setOffices(response.data);
    };

    fetchOffices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        officeRef.current &&
        !officeRef.current.contains(event.target as Node)
      ) {
        setShowOffice(false);

        if (!formData.officeId) {
          setOfficeSearch('');
        }
      }
      if (
        departmentRef.current &&
        !departmentRef.current.contains(event.target as Node)
      ) {
        setShowDepartment(false);

        if (!formData.departmentId) {
          setDepartmentSearch('');
        }
      }
      if (
        positionRef.current &&
        !positionRef.current.contains(event.target as Node)
      ) {
        setShowPosition(false);

        if (!formData.positionId) {
          setPositionSearch('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formData]);

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 px-6 py-4 dark:border-slate-800/60">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {formMode === 'create' ? 'Add New Employee' : 'Edit Employee'}
          </h3>
          <button
            onClick={() => handleClose()}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Middle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={formData.middleName}
                  onChange={(e) =>
                    setFormData({ ...formData, middleName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Suffix
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jr."
                  value={formData.suffix || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, suffix: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {/* Office */}
              <div ref={officeRef}>
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Office *
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={officeSearch}
                      placeholder="Select Office"
                      onFocus={() => setShowOffice(true)}
                      onChange={(e) => {
                        setOfficeSearch(e.target.value);
                        setShowOffice(true);
                      }}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />

                    {/* Clear button */}
                    {officeSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setOfficeSearch('');
                          setFormData({
                            ...formData,
                            officeId: null,
                          });
                          setShowOffice(true);
                        }}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Clear office"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {showOffice && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      {filteredOffices.length > 0 ? (
                        filteredOffices.map((office: any) => (
                          <button
                            key={office.id}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                officeId: office.id,
                              });

                              setOfficeSearch(office.name);
                              setShowOffice(false);
                            }}
                            className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                          >
                            {office.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-3.5 py-2.5 text-sm text-slate-500">
                          No offices found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Department */}
              <div ref={departmentRef}>
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Department *
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={departmentSearch}
                      placeholder="Select Department"
                      onFocus={() => setShowDepartment(true)}
                      onChange={(e) => {
                        setDepartmentSearch(e.target.value);
                        setShowDepartment(true);
                      }}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />

                    {/* Clear button */}
                    {departmentSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setDepartmentSearch('');
                          setFormData({
                            ...formData,
                            departmentId: null,
                          });
                          setShowDepartment(true);
                        }}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Clear department"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {showDepartment && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((department: any) => (
                          <button
                            key={department.id}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                departmentId: department.id,
                              });

                              setDepartmentSearch(department.name);
                              setShowDepartment(false);
                            }}
                            className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                          >
                            {department.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-3.5 py-2.5 text-sm text-slate-500">
                          No departments found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Position */}
              <div ref={positionRef}>
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Position *
                  </label>

                  <div className="relative">
                    <input
                      required
                      placeholder="Search Position"
                      value={positionSearch}
                      onFocus={() => setShowPosition(true)}
                      onChange={(e) => {
                        setPositionSearch(e.target.value);
                        setShowPosition(true);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />

                    {/* Clear button */}
                    {positionSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setPositionSearch('');
                          setFormData({
                            ...formData,
                            positionId: null,
                          });
                          setShowPosition(true);
                        }}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Clear position"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {showPosition && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      {filteredPositions.length > 0 ? (
                        filteredPositions.map((position: any) => (
                          <button
                            key={position.id}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                positionId: position.id,
                              });

                              setPositionSearch(position.name);
                              setShowPosition(false);
                            }}
                            className="block w-full px-3.5 py-2.5 text-left text-sm text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
                          >
                            {position.name}
                          </button>
                        ))
                      ) : (
                        <div className="px-3.5 py-2.5 text-sm text-slate-500">
                          No positions found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 bg-slate-50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => handleClose()}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-75 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
