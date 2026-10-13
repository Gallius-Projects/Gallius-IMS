'use client';

import { createContext, useContext, useState } from 'react';

const LibrariesContext = createContext<{
  categories: { id: number; name: string; abbreviation: string } | null;
  setCategories: (
    categories: { id: number; name: string; abbreviation: string } | null
  ) => void;
  brands: { id: number; name: string } | null;
  setBrands: (brands: { id: number; name: string } | null) => void;
  locations: { id: number; name: string; abbreviation: string } | null;
  setLocations: (locations: {
    id: number;
    name: string;
    abbreviation: string;
  }) => void;
  suppliers: {
    id: number;
    name: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    address: string;
  } | null;
  setSuppliers: (suppliers: {
    id: number;
    name: string;
    contactPerson: string;
    contactNumber: string;
    email: string;
    address: string;
  }) => void;
  offices: {
    id: number;
    name: string;
    abbreviation: string;
  } | null;
  setOffices: (offices: {
    id: number;
    name: string;
    abbreviation: string;
  }) => void;
  employees: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    suffix: string;
    officeId: number;
    departmentId: number;
    positionId: number;
    status: boolean;
  } | null;
  setEmployees: (employees: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    suffix: string;
    officeId: number;
    departmentId: number;
    positionId: number;
    status: boolean;
  }) => void;
  departments: {
    id: number;
    name: string;
    abbreviation: string;
  } | null;
  setDepartments: (
    departments: {
      id: number;
      name: string;
      abbreviation: string;
    } | null
  ) => void;
  positions: {
    id: number;
    name: string;
    departmentId: number;
    department: {
      id: number;
      name: string;
      abbreviation: string;
    };
  } | null;
  setPositions: (
    positions: {
      id: number;
      name: string;
      departmentId: number;
      department: {
        id: number;
        name: string;
        abbreviation: string;
      };
    } | null
  ) => void;
  roles: {
    id: number;
    role: string;
  } | null;
  setRoles: (roles: { id: number; role: string }) => void;
} | null>(null);

export const LibrariesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<
    {
      id: number;
      name: string;
      abbreviation: string;
    }[]
  >([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[] | null>(
    []
  );
  const [locations, setLocations] = useState<
    | {
        id: number;
        name: string;
        abbreviation: string;
      }[]
    | null
  >([]);
  const [suppliers, setSuppliers] = useState<
    | {
        id: number;
        name: string;
        contactPerson: string;
        contactNumber: string;
        email: string;
        address: string;
      }[]
    | null
  >([]);
  const [offices, setOffices] = useState<
    | {
        id: number;
        name: string;
        abbreviation: string;
      }[]
    | null
  >([]);
  const [employees, setEmployees] = useState<
    | {
        id: number;
        firstName: string;
        lastName: string;
        middleName: string;
        suffix: string;
        officeId: number;
        departmentId: number;
        positionId: number;
        status: boolean;
      }[]
    | null
  >([]);

  const [departments, setDepartments] = useState<
    {
      id: number;
      name: string;
      abbreviation: string;
    }[]
  >([]);
  const [positions, setPositions] = useState<
    {
      id: number;
      name: string;
      departmentId: number;
      department: {
        id: number;
        name: string;
        abbreviation: string;
      };
    }[]
  >([]);
  const [roles, setRoles] = useState<
    {
      id: number;
      role: string;
    }[]
  >([]);

  return (
    <LibrariesContext.Provider
      value={{
        categories,
        setCategories,
        brands,
        setBrands,
        locations,
        setLocations,
        suppliers,
        setSuppliers,
        offices,
        setOffices,
        employees,
        setEmployees,
        departments,
        setDepartments,
        positions,
        setPositions,
        roles,
        setRoles,
      }}
    >
      {children}
    </LibrariesContext.Provider>
  );
};

// Custom hook
export const useLibrariesContext = () => {
  const context = useContext(LibrariesContext);

  if (!context) {
    throw new Error('useLibrariesContext must be used within UserProvider');
  }

  return context;
};
