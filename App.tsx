// SCREEN 1 ONLY UPDATED — Recreated the "Airport Transportation" section to visually match the provided reference image, including the overlapping card layout, shadows, rounded corners, and typography. The rest of the page and app remain unchanged.
import React, { useState, useCallback } from 'react';
import { CustomerApp } from './components/CustomerApp';
import { DriverApp } from './components/DriverApp';
import { AdminPanel } from './components/AdminPanel';
import type { Role, Screen } from './types';
import { SearchIcon, CheckCircleIcon, CreditCardIcon, CarIcon, ChevronDownIcon, MapPinIcon, CalendarIcon, ClockIcon } from './components/Icons';


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
    <div className="bg-white min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

interface WelcomeScreenProps {
  onRoleSelect: (role: Role) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRoleSelect }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const NavLink: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => (
    <a href={href} className="text-gray-800 hover:text-primary transition-colors">{children}</a>
  );
  
  const faqs = [
    { q: 'Can I book rides in both my departure and arrival cities?', a: 'Yes. When you book with XTASS, you can schedule all four legs of your trip with rides to and from the airport in both your home city and your destination. One booking takes care of it all.' },
    { q: 'What happens if my flight is delayed or cancelled?', a: 'We track your flight status to adjust pickup times accordingly. If your flight is cancelled, please contact our support to reschedule or cancel your ride.' },
    { q: 'How do I know if you operate at my airport?', a: 'We operate at all major airports across Ghana. You can check the "Where We Go" section on our homepage or enter your airport in the booking form to confirm.' },
    { q: 'What kind of vehicles do you use for airport transportation?', a: 'We offer a wide range of vehicles to suit your needs, including sedans, SUVs, and vans for larger groups. All vehicles are clean, modern, and regularly inspected for safety.' },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-3xl font-display font-bold text-primary">XTASS</div>
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="#">Home</NavLink>
              <NavLink href="#">Services</NavLink>
              <NavLink href="#">About Us</NavLink>
              <NavLink href="#">FAQ</NavLink>
              <NavLink href="#">Support</NavLink>
            </nav>
            <div className="flex items-center space-x-4">
              <button onClick={() => onRoleSelect('Customer')} className="hidden sm:block text-gray-800 hover:text-primary transition-colors">Sign in | Register</button>
              <button onClick={() => onRoleSelect('Customer')} className="bg-accent text-primary font-bold py-2 px-6 hover:bg-yellow-400 transition-colors">Book Now</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative">
          {/* Hero background and text */}
          <div className="relative bg-black text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-50" 
              style={{backgroundImage: "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-32 text-center">
              <p className="font-display">Welcome to</p>
              <h1 className="text-2xl md:text-3xl font-display font-semibold mt-2">XCELLENT TRANSPORT & SHUTTLE SERVICES</h1>
              <p className="text-sm md:text-base mt-4 max-w-3xl mx-auto">Trusted Transport Services for Every Traveler</p>
            </div>
          </div>

          {/* Form - positioned to overlap */}
          <div className="relative z-10 -mt-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 shadow-lg text-left text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pick Up Location */}
                  <div>
                    <label htmlFor="pickup" className="block text-lg font-semibold text-gray-800 mb-2">Pick Up Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="pickup"
                        placeholder="Kotoka International Airport, Ghana."
                        className="w-full p-3 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                      />
                      <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    </div>
                  </div>
                  {/* Drop Off Location */}
                  <div>
                    <label htmlFor="dropoff" className="block text-lg font-semibold text-gray-800 mb-2">Drop Off Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="dropoff"
                        placeholder="East Legon, Accra."
                        className="w-full p-3 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                      />
                      <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-lg font-semibold text-gray-800 mb-2">Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="date"
                        placeholder="Enter Date"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        className="w-full p-3 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    </div>
                  </div>
                  {/* Time */}
                  <div>
                    <label htmlFor="time" className="block text-lg font-semibold text-gray-800 mb-2">Time</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="time"
                        placeholder="Enter Time"
                        onFocus={(e) => (e.target.type = 'time')}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        className="w-full p-3 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                      />
                      <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    </div>
                  </div>
                  {/* Passaengers */}
                  <div>
                    <label htmlFor="passengers" className="block text-lg font-semibold text-gray-800 mb-2">Passaengers</label>
                    <input
                      type="number"
                      id="passengers"
                      placeholder="No. of Passangers"
                      className="w-full p-3 pl-4 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                    />
                  </div>
                  {/* Book Now Button */}
                  <div>
                    <button onClick={() => onRoleSelect('Customer')} className="w-full bg-accent text-primary font-bold py-3 px-6 hover:bg-yellow-400 transition-colors text-lg">Book Now</button>
                  </div>
                </div>
              </div>
          </div>
        </div>


        {/* Airport Transportation Section */}
        <section className="pt-24 pb-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="md:w-3/5 w-full">
                <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop" alt="Airport Transportation" className="shadow-xl w-full h-auto object-cover"/>
              </div>
              <div className="md:w-1/2 w-full bg-white p-8 md:p-12 shadow-xl md:-ml-24 mt-8 md:mt-0 relative">
                <h2 className="text-4xl font-display font-bold text-gray-800 leading-tight">Airport Transportation</h2>
                <hr className="my-6 border-gray-800 w-24 border-t-2" />
                <p className="mt-4 text-lg text-gray-600">Reserve shared ride or private airport transportation in your departure and destination city. Vans, sedans, or SUVs.</p>
                <button onClick={() => onRoleSelect('Customer')} className="mt-8 bg-primary text-white font-bold py-3 px-8 hover:bg-primary-hover transition-colors">AIRPORT RIDES</button>
              </div>
            </div>
          </div>
        </section>

        {/* Private Car Service Section */}
        <section className="py-16" style={{ backgroundColor: '#660033' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-3/5 w-full">
                    <img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop" alt="Private Car Service" className="shadow-xl w-full h-auto object-cover"/>
                </div>
                <div className="md:w-1/2 w-full bg-white p-8 md:p-12 shadow-xl md:-mr-24 mt-8 md:mt-0 relative z-10">
                    <h2 className="text-4xl font-display font-bold text-gray-800 leading-tight">Private Car Service</h2>
                    <hr className="my-6 border-gray-800 w-24 border-t-2" />
                    <p className="mt-4 text-lg text-gray-600">Travel on your schedule with a private driver. Book by the hour or choose point-to-point transfers.</p>
                    <button onClick={() => onRoleSelect('Customer')} className="mt-8 bg-primary text-white font-bold py-3 px-8 hover:bg-primary-hover transition-colors">PRIVATE CAR SERVICE</button>
                </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold text-primary">Door-to-Door Airport Transportation</h3>
              <p className="mt-4">XTASS has been providing affordable, convenient, and safe shared ride and private airport transfers. We pioneered the shared ride concept with specialization in grouping and routing passengers traveling in the same direction together in an airport shuttle. Since then, we’ve expanded our ground transportation services beyond shared ride vans to include: airport car service, point to point transfers, and group transportation for special events. We’re not just about getting from point A to point B, but about enhancing your entire travel experience.</p>
              <p className="mt-4">XTASS is a national brand that partners with trusted local transportation providers in each city, so you get the convenience of a national network with the service of a local expert. Our operators provide door-to-door airport pickups and drop offs from your home, office, hotel, or anywhere you desire. We use flight tracking software so we know if your flight is delayed or arriving early.</p>
              <p className="mt-4">Booking with XTASS means choosing an organization that values safety, affordability, and convenience. With transparent fares, and the assurance of reliable transport, we’ll not only meet your travel demands, but exceed them.</p>
              <p className="mt-4 font-semibold">Book your ride with us today!</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white text-primary p-6 border border-primary">
                <h4 className="font-bold font-display">Upfront Pricing</h4>
                <p className="mt-2 text-sm">All inclusive fares with no hidden fees or additional charges for reserving in advance. No surge pricing during peak travel times or inclement weather.</p>
              </div>
              <div className="bg-primary text-white p-6">
                <h4 className="font-bold font-display">Departure & Destination</h4>
                <p className="mt-2 text-sm">Book transportation for all four legs of your journey in your departure and destination cities at the same time – making airport travel easy.</p>
              </div>
              <div className="bg-primary text-white p-6">
                <h4 className="font-bold font-display">Available 24/7</h4>
                <p className="mt-2 text-sm">Book airport rides, around town transportation, or tours and attractions securely with the device of your choice.</p>
              </div>
              <div className="bg-white text-primary p-6 border border-primary">
                <h4 className="font-bold font-display">Safety First</h4>
                <p className="mt-2 text-sm">From background and safety checks to deep cleaning standards, we're doing our part to ensure that your ride is a safe one.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-display font-bold">How It Works</h2>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white text-primary p-4 mb-4 rounded-full"><SearchIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">1. Search</h4>
                <p>Tell us where you're going.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white text-primary p-4 mb-4 rounded-full"><CheckCircleIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">2. Select</h4>
                <p>Choose your ride type.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white text-primary p-4 mb-4 rounded-full"><CreditCardIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">3. Book</h4>
                <p>Confirm your ride.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white text-primary p-4 mb-4 rounded-full"><CarIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">4. GO</h4>
                <p>Your driver meets you curbside.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Where We Go */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-display font-bold text-primary">Where We Go</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto">Connecting you to major airports across Ghana. Your journey, our priority.</p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <button className="bg-primary text-white p-4 hover:bg-primary-hover">Kotoka Int'l Airport</button>
              <button className="bg-primary text-white p-4 hover:bg-primary-hover">Tamale Airport</button>
              <button className="bg-primary text-white p-4 hover:bg-primary-hover">Takoradi Airport</button>
              <button className="bg-primary text-white p-4 hover:bg-primary-hover">Kumasi Airport</button>
              <button className="bg-primary text-white p-4 hover:bg-primary-hover">Wa Airport</button>
              <button className="bg-primary text-white p-4 hover:bg-primary-hover">Sunyani Airport</button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-display font-bold text-primary text-center">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left text-xl font-semibold">
                    <span>{faq.q}</span>
                    <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}/>
                  </button>
                  {openFaq === index && (
                    <div className="mt-2 text-gray-600">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              <div className="col-span-2 lg:col-span-1">
                <h3 className="text-2xl font-display font-bold text-accent">XTASS</h3>
              </div>
              <div>
                <h4 className="font-bold tracking-wider uppercase">About Us</h4>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Why Choose XTASS</a></li>
                  <li><a href="#" className="hover:text-white">Our Story</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">Press & Media</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold tracking-wider uppercase">Our Services</h4>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Airport Transfers</a></li>
                  <li><a href="#" className="hover:text-white">Private Car Service</a></li>
                  <li><a href="#" className="hover:text-white">Scheduled Rides</a></li>
                  <li><a href="#" className="hover:text-white">Group Transport</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold tracking-wider uppercase">Support</h4>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center / FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Report an Issue</a></li>
                  <li><a href="#" className="hover:text-white">WhatsApp Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold tracking-wider uppercase">For Partners</h4>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li><button onClick={() => onRoleSelect('Driver')} className="hover:text-white">Driver Portal</button></li>
                  <li><button onClick={() => onRoleSelect('Admin')} className="hover:text-white">Admin Portal</button></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};


export default App;