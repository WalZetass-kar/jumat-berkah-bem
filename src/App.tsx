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
import { AdminLayout } from './pages/AdminLayout';
import { LoginPage } from './pages/LoginPage';


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
    />;
  }

  if (Component === ReportsTab) {
    return <Component 
      config={appData.config} 
      transactions={appData.transactions} 
      spots={appData.spots} 
    />;
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
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
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
                onLoginClick={() => { window.location.href = '/login'; }}
                onLogoutClick={async () => { await supabase.auth.signOut(); }}
              />
              <LandingTab
                config={appData.config}
                transactions={appData.transactions}
                spots={appData.spots}
                galleryItems={appData.galleryItems}
                isAdminLoggedIn={!!session}
                onLoginClick={() => { window.location.href = '/login'; }}
                onNavigateToTab={() => {}}
              />
            </>
          } />
          
          <Route path="/login" element={session ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />} />
          
          <Route path="/admin" element={session ? <AdminLayout appData={appData} /> : <Navigate to="/login" replace />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TabWrapper component={DashboardTab} />} />
            <Route path="transactions" element={<TabWrapper component={TransactionsTab} />} />
            <Route path="distribution" element={<TabWrapper component={DistributionTab} />} />
            <Route path="reports" element={<TabWrapper component={ReportsTab} />} />
            <Route path="settings" element={<TabWrapper component={SettingsTab} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
