import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { supabase } from './utils/supabase';
import { useAppData } from './hooks/useAppData';
import { Navbar } from './components/Navbar';
import { LandingTab } from './components/LandingTab';
import { DashboardTab } from './components/DashboardTab';
import { TransactionsTab } from './components/TransactionsTab';
import { DistributionTab } from './components/DistributionTab';
import { ReportsTab } from './components/ReportsTab';
import { SettingsTab } from './components/SettingsTab';
import { AdminUsersTab } from './components/AdminUsersTab';
import { VolunteersTab } from './components/VolunteersTab';
import { AdminLayout } from './pages/AdminLayout';
import { SecretPortal } from './pages/SecretPortal';


// Helper component to pass outlet context down to the original tabs
function TabWrapper({ component: Component }: { component: any }) {
  const { appData, setIsAddGalleryModalOpen, setModalDefaultType, setIsModalOpen } = useOutletContext<any>();
  
  if (Component === DashboardTab) {
    return <Component 
      config={appData.config} 
      transactions={appData.transactions} 
      spots={appData.spots} 
      trendData={[]} 
      galleryItems={appData.galleryItems} 
      onOpenAddModal={(type: any) => { setModalDefaultType(type); setIsModalOpen(true); }}
      onNavigateToTab={() => {}} 
      onOpenAddGalleryModal={() => setIsAddGalleryModalOpen(true)} 
      onDeleteGalleryItem={appData.handleDeleteGalleryItem} 
    />;
  }
  
  if (Component === TransactionsTab) {
    const [searchTerm, setSearchTerm] = useState('');
    return <Component 
      transactions={appData.transactions} 
      onOpenAddModal={(type: any) => { setModalDefaultType(type); setIsModalOpen(true); }} 
      onDeleteTransaction={appData.handleDeleteTransaction} 
      searchTerm={searchTerm} 
      setSearchTerm={setSearchTerm} 
    />;
  }

  if (Component === DistributionTab) {
    return <Component 
      spots={appData.spots} 
      config={appData.config} 
      onUpdateSpotStatus={appData.handleUpdateSpotStatus} 
      onAddSpot={appData.handleAddSpot} 
      onDeleteSpot={appData.handleDeleteSpot}
    />;
  }

  if (Component === ReportsTab) {
    return <Component 
      config={appData.config} 
      transactions={appData.transactions} 
      spots={appData.spots} 
    />;
  }

  if (Component === AdminUsersTab) {
    return <Component 
      adminUsers={appData.adminUsers} 
      onAddAdminUser={appData.handleAddAdminUser}
      onUpdateAdminUser={appData.handleUpdateAdminUser}
      onDeleteAdminUser={appData.handleDeleteAdminUser}
    />;
  }

  if (Component === VolunteersTab) {
    return <Component />;
  }

  if (Component === SettingsTab) {
    return <Component 
      config={appData.config} 
      transactions={appData.transactions} 
      spots={appData.spots} 
      onSaveConfig={appData.handleSaveConfig} 
      onResetData={appData.handleResetData} 
      onRestoreBackup={() => {}} 
    />;
  }

  return null;
}

export default function App() {
  const appData = useAppData();
  const [session, setSession] = useState<any>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!appData.isDataLoaded || !isSessionLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Navbar Skeleton */}
        <div className="h-14 sm:h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-3.5 w-32 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="h-2 w-20 bg-slate-200 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="hidden sm:flex gap-4">
            <div className="h-4 w-16 bg-slate-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-16 bg-slate-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-16 bg-slate-200 rounded-md animate-pulse"></div>
          </div>
        </div>
        
        {/* Hero Skeleton */}
        <div className="w-full h-80 bg-slate-900 px-4 sm:px-8 py-16">
          <div className="max-w-3xl space-y-6">
            <div className="h-5 w-48 bg-slate-800 rounded-full animate-pulse"></div>
            <div className="h-12 w-3/4 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-4 w-full bg-slate-800 rounded-md animate-pulse mt-4"></div>
            <div className="h-4 w-5/6 bg-slate-800 rounded-md animate-pulse"></div>
            <div className="flex gap-3 mt-8">
              <div className="h-12 w-40 bg-slate-800 rounded-2xl animate-pulse"></div>
              <div className="h-12 w-40 bg-slate-800 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Cards Skeleton */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6">
            <div className="h-4 w-24 bg-slate-200 rounded-md mb-4"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6">
            <div className="h-4 w-24 bg-slate-200 rounded-md mb-4"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6">
            <div className="h-4 w-24 bg-slate-200 rounded-md mb-4"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar
                config={appData.config}
                onOpenAddModal={() => {}}
                searchTerm=""
                setSearchTerm={() => {}}
                activeTab="landing"
                isAdminLoggedIn={!!session}
                onLoginClick={() => { window.location.href = '/portal-rahasia-bem'; }}
                onLogoutClick={async () => { await supabase.auth.signOut(); }}
              />
              <LandingTab
                config={appData.config}
                transactions={appData.transactions}
                spots={appData.spots}
                galleryItems={appData.galleryItems}
                isAdminLoggedIn={!!session}
                onLoginClick={() => { window.location.href = '/portal-rahasia-bem'; }}
                onNavigateToTab={() => {}}
              />
            </>
          } />
          
          <Route path="/portal-rahasia-bem" element={session ? <Navigate to="/admin/dashboard" replace /> : <SecretPortal />} />
          
          <Route path="/admin" element={session ? <AdminLayout appData={appData} /> : <Navigate to="/portal-rahasia-bem" replace />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TabWrapper component={DashboardTab} />} />
            <Route path="transactions" element={<TabWrapper component={TransactionsTab} />} />
            <Route path="distribution" element={<TabWrapper component={DistributionTab} />} />
            <Route path="admins" element={<TabWrapper component={AdminUsersTab} />} />
            <Route path="volunteers" element={<TabWrapper component={VolunteersTab} />} />
            <Route path="reports" element={<TabWrapper component={ReportsTab} />} />
            <Route path="settings" element={<TabWrapper component={SettingsTab} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
