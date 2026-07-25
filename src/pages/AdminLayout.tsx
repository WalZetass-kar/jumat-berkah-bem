import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navigation, TabType } from '../components/Navigation';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { AddGalleryModal } from '../components/AddGalleryModal';
import { AIChatBot } from '../components/AIChatBot';
import { supabase } from '../utils/supabase';
import { useToast } from '../context/ToastContext';
import { TransactionType } from '../types';

export const AdminLayout: React.FC<any> = ({ appData }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<TransactionType>('INCOME');
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const currentTab = location.pathname.split('/').pop() as TabType;

  const handleLogoutClick = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      addToast('Logout Berhasil', 'info', 'Anda telah keluar dari mode Admin.');
      navigate('/');
    }
  };

  const handleTabChange = (tab: TabType) => {
    navigate(`/admin/${tab}`);
  };

  return (
    <div className="flex-1 flex w-full">
      <Navigation
        activeTab={currentTab || 'dashboard'}
        setActiveTab={handleTabChange}
        onOpenAddModal={() => {
          setModalDefaultType('INCOME');
          setIsModalOpen(true);
        }}
        isAdminLoggedIn={true}
        onLoginClick={() => {}}
        onLogoutClick={handleLogoutClick}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <main className={`flex-1 w-full transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 pb-24 md:pb-8 w-full">
          <Outlet context={{ 
            appData, 
            setIsAddGalleryModalOpen,
            setModalDefaultType,
            setIsModalOpen 
          }} />
        </div>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddTransaction={appData.handleAddTransaction} 
        defaultType={modalDefaultType} 
      />
      <AddGalleryModal 
        isOpen={isAddGalleryModalOpen} 
        onClose={() => setIsAddGalleryModalOpen(false)} 
        onAddGalleryItem={appData.handleAddGalleryItem} 
      />
      <AIChatBot 
        config={appData.config} 
        transactions={appData.transactions} 
        spots={appData.spots} 
        galleryItems={appData.galleryItems}
        adminUsers={appData.adminUsers}
        volunteers={appData.volunteers}
      />
    </div>
  );
};
