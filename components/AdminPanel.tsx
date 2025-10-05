

import React from 'react';
import type { Screen, NavigationProps } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Input } from './shared/UI';
// FIX: Import all necessary icons for the admin panel.
import { UserIcon, LockIcon, MenuIcon, CarIcon, DollarSignIcon, UsersIcon, ShieldIcon, BarChart2Icon, MapPinIcon, SettingsIcon, LogOutIcon } from './Icons';

interface AdminPanelProps extends NavigationProps {
  screen: Screen;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ screen, navigate, logout }) => {
  const renderScreen = () => {
    switch (screen) {
      case 'AdminLogin':
        return <AdminLoginScreen navigate={navigate} />;
      case 'AdminPasswordRecovery':
        return <AdminPasswordRecoveryScreen navigate={navigate} />;
      case 'AdminDashboard':
        return <AdminDashboardScreen />;
      case 'DriverManagement':
        return <DriverManagementScreen />;
      case 'LiveOperations':
        return <LiveOperationsScreen />;
      case 'SystemConfig':
        return <SystemConfigScreen />;
      default:
        return <AdminLoginScreen navigate={navigate} />;
    }
  };
  
  const showLayout = screen !== 'AdminLogin' && screen !== 'AdminPasswordRecovery';

  return (
    <div className="min-h-screen bg-gray-100">
      {showLayout ? (
        <AdminLayout screen={screen} navigate={navigate} logout={logout}>
          {renderScreen()}
        </AdminLayout>
      ) : (
        renderScreen()
      )}
    </div>
  );
};


// --- Admin Layout ---
interface AdminLayoutProps extends NavigationProps {
    children: React.ReactNode;
    screen: Screen;
}
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, screen, navigate, logout }) => (
    <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-primary text-white flex flex-col">
            <div className="p-4 text-center border-b border-primary-active">
                <h1 className="text-2xl font-display font-bold text-accent">XTASS Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {/* FIX: Use imported icons directly instead of removed wrappers. */}
                <NavItem screenName="AdminDashboard" currentScreen={screen} navigate={navigate} icon={<BarChart2Icon />}>Dashboard</NavItem>
                <NavItem screenName="DriverManagement" currentScreen={screen} navigate={navigate} icon={<UsersIcon />}>Drivers</NavItem>
                <NavItem screenName="LiveOperations" currentScreen={screen} navigate={navigate} icon={<MapPinIcon />}>Live Map</NavItem>
                <NavItem screenName="SystemConfig" currentScreen={screen} navigate={navigate} icon={<SettingsIcon />}>Configuration</NavItem>
            </nav>
            <div className="p-4 border-t border-primary-active">
                <button onClick={logout} className="w-full flex items-center space-x-2 p-2 rounded hover:bg-primary-hover">
                    <LogOutIcon />
                    <span>Logout</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{screen.replace('Admin', '')}</h2>
                <div>
                    <UserIcon className="w-8 h-8 text-gray-600"/>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6">
                {children}
            </div>
        </main>
    </div>
);

// FIX: Changed icon prop type to be more specific for React.cloneElement to allow passing className.
const NavItem: React.FC<{ screenName: Screen, currentScreen: Screen, navigate: (s: Screen) => void, icon: React.ReactElement<{ className?: string }>, children: React.ReactNode }> = ({ screenName, currentScreen, navigate, icon, children }) => (
    <button
        onClick={() => navigate(screenName)}
        className={`w-full flex items-center space-x-3 p-2 rounded text-left ${currentScreen === screenName ? 'bg-primary-active' : 'hover:bg-primary-hover'}`}
    >
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        <span>{children}</span>
    </button>
);


// --- Screen Components ---

const AdminLoginScreen: React.FC<NavigationProps> = ({ navigate }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold font-display text-primary text-center">Admin Panel</h2>
      <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('AdminDashboard'); }}>
        <Input id="email" label="Email" type="email" placeholder="admin@xtass.com" icon={<UserIcon className="w-5 h-5 text-gray-400" />} />
        <Input id="password" label="Password" type="password" placeholder="••••••••" icon={<LockIcon className="w-5 h-5 text-gray-400" />} />
        <div>
          <Button type="submit">Sign In</Button>
        </div>
      </form>
    </div>
  </div>
);

const AdminPasswordRecoveryScreen: React.FC<NavigationProps> = ({ navigate }) => (<div>...</div>);

const AdminDashboardScreen: React.FC = () => {
    const revenueData = [
        { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
    ];
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="GHS 28,000" icon={<DollarSignIcon />} />
                <StatCard title="Active Trips" value="12" icon={<CarIcon />} />
                <StatCard title="Online Drivers" value="45" icon={<UsersIcon />} />
                <StatCard title="System Health" value="Operational" icon={<ShieldIcon />} status="ok" />
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-4">Revenue Overview</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={revenueData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#800020" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// FIX: Changed icon prop type to be more specific for React.cloneElement to allow passing className.
const StatCard: React.FC<{title: string, value: string, icon: React.ReactElement<{ className?: string }>, status?: string}> = ({ title, value, icon, status }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${status === 'ok' ? 'text-green-600' : 'text-gray-800'}`}>{value}</p>
        </div>
        <div className="bg-primary-active text-white p-3 rounded-full">
            {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
    </div>
);


const DriverManagementScreen: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="font-bold text-xl mb-4">Driver Management</h3>
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3">Name</th>
          <th className="p-3">Station</th>
          <th className="p-3">Status</th>
          <th className="p-3">Online Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <DriverRow name="Kofi Mensah" station="Airport T3" status="Approved" isOnline={true} />
        <DriverRow name="Esi Koomson" station="Airport T3" status="Pending" isOnline={false} />
        <DriverRow name="Kwame Appiah" station="Airport T2" status="Suspended" isOnline={false} />
      </tbody>
    </table>
  </div>
);

const DriverRow: React.FC<{name: string, station: string, status: 'Approved' | 'Pending' | 'Suspended', isOnline: boolean}> = ({ name, station, status, isOnline }) => {
    const [online, setOnline] = React.useState(isOnline);
    
    const statusColor = {
        Approved: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Suspended: 'bg-red-100 text-red-800',
    };
    return (
        <tr className="border-b">
            <td className="p-3">{name}</td>
            <td className="p-3">{station}</td>
            <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor[status]}`}>{status}</span></td>
            <td className="p-3">
                 <label className="inline-flex relative items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={online} 
                        onChange={() => setOnline(!online)} 
                        className="sr-only peer"
                        disabled={status !== 'Approved'}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </td>
            <td className="p-3 space-x-2">
                {status === 'Pending' && <Button variant="primary" className="py-1 px-3 text-sm">Approve</Button>}
                {status === 'Approved' && <Button variant="secondary" className="py-1 px-3 text-sm">Suspend</Button>}
            </td>
        </tr>
    );
};


const LiveOperationsScreen: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
    <h3 className="font-bold text-xl p-6 border-b">Live Operations Command Center</h3>
    <div className="flex-1 bg-gray-300 flex items-center justify-center">
      <p className="text-gray-600 font-semibold text-2xl">Live Map Placeholder</p>
    </div>
  </div>
);

const SystemConfigScreen: React.FC = () => (
  <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-xl mb-4">Pricing Rules</h3>
          <div className="space-y-4">
              <Input label="Base Fare (GHS)" id="baseFare" type="number" defaultValue="15" />
              <Input label="Per Kilometer Rate (GHS)" id="kmRate" type="number" defaultValue="2.5" />
          </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-xl mb-4">Vehicle Matching Logic</h3>
          <div className="space-y-2">
              <p>1 Passenger, 1 Luggage: <strong>Saloon Car</strong></p>
              <p>1-4 Passengers, 1-4 Luggage: <strong>SUV</strong></p>
              <p>5+ Passengers or 5+ Luggage: <strong>Shuttle Bus</strong></p>
          </div>
      </div>
       <div className="mt-6">
            <Button>Save Configuration</Button>
        </div>
  </div>
);

{/* FIX: Removed redundant and problematic icon wrapper components. */}