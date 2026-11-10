import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import type { Asset, Transaction } from './types/asset';
import { SEED_ASSETS, SEED_TRANSACTIONS } from './data/seed';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { LoginPage } from './pages/public/Login/LoginPage';
import { DashboardPage } from './pages/private/dashboard/DashboardPage';
import { AssetsPage } from './pages/private/assets/AssetsPage';
import { AssetDetailPage } from './pages/private/assets/AssetDetailPage';
import { TransactionsPage } from './pages/private/transactions/TransactionsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ams_auth') === 'true';
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('ams_assets');
    return saved ? JSON.parse(saved) : SEED_ASSETS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ams_transactions');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  });

  const saveAssets = (updated: Asset[]) => {
    setAssets(updated);
    localStorage.setItem('ams_assets', JSON.stringify(updated));
  };

  const saveTransactions = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem('ams_transactions', JSON.stringify(updated));
  };

  const handleLogin = () => {
    localStorage.setItem('ams_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ams_auth');
    setIsAuthenticated(false);
  };

  const handleAddAsset = (asset: Asset) => {
    const updated = [...assets, asset];
    saveAssets(updated);
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      assetId: asset.id,
      assetName: asset.name,
      assetTag: asset.assetTag,
      action: 'REGISTERED',
      performedBy: 'Admin',
      date: new Date().toISOString(),
      notes: `Asset registered into system. Location: ${asset.location}`,
    };
    saveTransactions([txn, ...transactions]);
  };

  const handleUpdateAsset = (updated: Asset, oldAsset: Asset) => {
    const updatedList = assets.map((a) => (a.id === updated.id ? updated : a));
    saveAssets(updatedList);

    // Log transaction if status changed
    if (updated.status !== oldAsset.status) {
      const actionMap: Record<string, Transaction['action']> = {
        Deployed: 'DEPLOYED',
        Disposed: 'DISPOSED',
        Donated: 'DONATED',
        Spare: 'RETURNED',
      };
      const txn: Transaction = {
        id: `txn-${Date.now()}`,
        assetId: updated.id,
        assetName: updated.name,
        assetTag: updated.assetTag,
        action: actionMap[updated.status] || 'UPDATED',
        performedBy: 'Admin',
        date: new Date().toISOString(),
        notes: `Status changed from ${oldAsset.status} to ${updated.status}.`,
      };
      saveTransactions([txn, ...transactions]);
    } else {
      const txn: Transaction = {
        id: `txn-${Date.now()}`,
        assetId: updated.id,
        assetName: updated.name,
        assetTag: updated.assetTag,
        action: 'UPDATED',
        performedBy: 'Admin',
        date: new Date().toISOString(),
        notes: `Asset details updated.`,
      };
      saveTransactions([txn, ...transactions]);
    }
  };

  const handleDeleteAsset = (id: string) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return;
    saveAssets(assets.filter((a) => a.id !== id));
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      assetId: id,
      assetName: asset.name,
      assetTag: asset.assetTag,
      action: 'DELETED',
      performedBy: 'Admin',
      date: new Date().toISOString(),
      notes: `Asset removed from system.`,
    };
    saveTransactions([txn, ...transactions]);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage onLogin={handleLogin} />
            </AuthLayout>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout onLogout={handleLogout} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage assets={assets} />} />
        <Route
          path="assets"
          element={
            <AssetsPage
              assets={assets}
              onAdd={handleAddAsset}
              onUpdate={handleUpdateAsset}
              onDelete={handleDeleteAsset}
            />
          }
        />
        <Route
          path="assets/:id"
          element={
            <AssetDetailPage
              assets={assets}
              transactions={transactions}
              onUpdate={handleUpdateAsset}
              onDelete={handleDeleteAsset}
            />
          }
        />
        <Route path="transactions" element={<TransactionsPage transactions={transactions} />} />
      </Route>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
