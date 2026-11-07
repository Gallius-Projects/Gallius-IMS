'use client';

import { createContext, useContext, useState } from 'react';
import { Categories } from '@/types/categories';
import { Brands } from '@/types/brands';
import { Locations } from '@/types/locations';
import { Suppliers } from '@/types/suppliers';
import { Offices } from '@/types/offices';
import { Employees } from '@/types/employees';
import { Departments } from '@/types/departments';
import { Positions } from '@/types/positions';
import { Roles } from '@/types/roles';

const LibrariesContext = createContext<{
  categories: Categories[];
  setCategories: React.Dispatch<React.SetStateAction<Categories[]>>;
  brands: Brands[];
  setBrands: React.Dispatch<React.SetStateAction<Brands[]>>;
  locations: Locations[];
  setLocations: React.Dispatch<React.SetStateAction<Locations[]>>;
  suppliers: Suppliers[];
  setSuppliers: React.Dispatch<React.SetStateAction<Suppliers[]>>;
  offices: Offices[];
  setOffices: React.Dispatch<React.SetStateAction<Offices[]>>;
  employees: Employees[];
  setEmployees: React.Dispatch<React.SetStateAction<Employees[]>>;
  departments: Departments[];
  setDepartments: React.Dispatch<React.SetStateAction<Departments[]>>;
  positions: Positions[];
  setPositions: React.Dispatch<React.SetStateAction<Positions[]>>;
  roles: Roles[];
  setRoles: React.Dispatch<React.SetStateAction<Roles[]>>;
} | null>(null);

export const LibrariesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [locations, setLocations] = useState<Locations[]>([]);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [offices, setOffices] = useState<Offices[]>([]);
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [positions, setPositions] = useState<Positions[]>([]);
  const [roles, setRoles] = useState<Roles[]>([]);

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
