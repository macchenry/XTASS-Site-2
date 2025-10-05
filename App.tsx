
import React, { useState, useCallback } from 'react';
import { CustomerApp } from './components/CustomerApp';
import { DriverApp } from './components/DriverApp';
import { AdminPanel } from './components/AdminPanel';
import type { Role, Screen } from './types';

const App: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>('Welcome');

  const navigate = useCallback((newScreen: Screen) => {
    setScreen(newScreen);
  }, []);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    switch (selectedRole) {
      case 'Customer':
        navigate('Login');
        break;
      case 'Driver':
        navigate('DriverLogin');
        break;
      case 'Admin':
        navigate('AdminLogin');
        break;
    }
  };
  
  const logout = () => {
    setRole(null);
    setScreen('Welcome');
  };

  const renderContent = () => {
    if (!role) {
      return <WelcomeScreen onRoleSelect={handleRoleSelect} />;
    }

    switch (role) {
      case 'Customer':
        return <CustomerApp screen={screen} navigate={navigate} logout={logout} />;
      case 'Driver':
        return <DriverApp screen={screen} navigate={navigate} logout={logout} />;
      case 'Admin':
        return <AdminPanel screen={screen} navigate={navigate} logout={logout} />;
      default:
        return <WelcomeScreen onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

interface WelcomeScreenProps {
  onRoleSelect: (role: Role) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRoleSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
      <div className="text-center text-white mb-12">
        <h1 className="text-5xl font-display font-bold text-accent">XTASS</h1>
        <p className="text-xl mt-2">Smart Airport Transportation</p>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-display text-white text-center font-semibold">I am a...</h2>
        <button onClick={() => onRoleSelect('Customer')} className="w-full bg-white text-primary font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
          Customer
        </button>
        <button onClick={() => onRoleSelect('Driver')} className="w-full bg-white text-primary font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
          Driver
        </button>
        <button onClick={() => onRoleSelect('Admin')} className="w-full bg-white text-primary font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
          Admin
        </button>
      </div>
    </div>
  );
};


export default App;
