
// SCREEN 1 ONLY UPDATED — Recreated the "Airport Transportation" section to visually match the provided reference image, including the overlapping card layout, shadows, rounded corners, and typography. The rest of the page and app remain unchanged.
import React, { useState, useCallback } from 'react';
import { CustomerApp } from './components/CustomerApp';
import { DriverApp } from './components/DriverApp';
import { AdminPanel } from './components/AdminPanel';
import type { Role, Screen } from './types';
import { SearchIcon, CheckCircleIcon, BookingIcon, CarIcon, ChevronDownIcon, MapPinIcon, CalendarIcon, ClockIcon } from './components/Icons';

// Type for booking details from the landing page form
interface BookingDetails {
  rideType: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: string;
}

const App: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>('Welcome');
  const [initialBookingDetails, setInitialBookingDetails] = useState<BookingDetails | null>(null);

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
    setInitialBookingDetails(null);
  };

  const renderContent = () => {
    if (!role) {
      return <WelcomeScreen onRoleSelect={handleRoleSelect} setInitialBookingDetails={setInitialBookingDetails} />;
    }

    switch (role) {
      case 'Customer':
        return <CustomerApp screen={screen} navigate={navigate} logout={logout} initialBookingDetails={initialBookingDetails} clearInitialBookingDetails={() => setInitialBookingDetails(null)} />;
      case 'Driver':
        return <DriverApp screen={screen} navigate={navigate} logout={logout} />;
      case 'Admin':
        return <AdminPanel screen={screen} navigate={navigate} logout={logout} />;
      default:
        return <WelcomeScreen onRoleSelect={handleRoleSelect} setInitialBookingDetails={setInitialBookingDetails} />;
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
  setInitialBookingDetails: (details: BookingDetails | null) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRoleSelect, setInitialBookingDetails }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // State for landing page booking form
  const [rideType, setRideType] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('');

  const NavLink: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => (
    <a href={href} className="text-gray-800 hover:text-primary transition-colors">{children}</a>
  );
  
  const faqs = [
    { q: 'Can I book rides in both my departure and arrival cities?', a: 'Yes. When you book with XTASS, you can schedule all four legs of your trip with rides to and from the airport in both your home city and your destination. One booking takes care of it all.' },
    { q: 'What happens if my flight is delayed or cancelled?', a: 'We track your flight status to adjust pickup times accordingly. If your flight is cancelled, please contact our support to reschedule or cancel your ride.' },
    { q: 'How do I know if you operate at my airport?', a: 'We operate at all major airports across Ghana. You can check the "Where We Go" section on our homepage or enter your airport in the booking form to confirm.' },
    { q: 'What kind of vehicles do you use for airport transportation?', a: 'We offer a wide range of vehicles to suit your needs, including sedans, SUVs, and vans for larger groups. All vehicles are clean, modern, and regularly inspected for safety.' },
  ];

  const handleBookNow = () => {
    if (rideType) {
      setInitialBookingDetails({
        rideType,
        pickup,
        dropoff,
        date,
        time,
        passengers,
      });
    } else {
      setInitialBookingDetails(null); // No ride type selected, proceed with default flow
    }
    onRoleSelect('Customer');
  };

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src="https://i.ibb.co/6JVrf2Bt/XTASS-Logo.png" alt="XTASS Logo" className="h-10" />
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="#">Home</NavLink>
              <NavLink href="#">Services</NavLink>
              <NavLink href="#">About Us</NavLink>
              <NavLink href="#">FAQ</NavLink>
              <NavLink href="#">Support</NavLink>
            </nav>
            <div className="flex items-center space-x-4">
              <button onClick={() => onRoleSelect('Customer')} className="hidden sm:block text-gray-800 hover:text-primary transition-colors">Sign in | Register</button>
              <button onClick={handleBookNow} className="bg-accent text-primary font-bold py-2 px-6 hover:bg-yellow-400 transition-colors">Book Now</button>
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
              className="absolute inset-0 bg-cover bg-center opacity-[.85]" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-52 pb-52 text-center">
              <p className="font-display">Welcome to</p>
              <h1 className="text-2xl md:text-3xl font-display font-semibold mt-2">XCELLENT TRANSPORT & SHUTTLE SERVICES</h1>
              <p className="text-sm md:text-base mt-4 max-w-3xl mx-auto">Trusted Transport Services for Every Traveler</p>
            </div>
          </div>

          {/* Form - positioned to overlap */}
          <div className="relative z-10 -mt-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 shadow-lg text-left text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Types of Ride */}
                  <div>
                    <label htmlFor="rideType" className="block text-lg font-semibold text-gray-800 mb-2">Types of Ride</label>
                    <div className="relative">
                      <select
                        id="rideType"
                        value={rideType}
                        onChange={(e) => setRideType(e.target.value)}
                        className={`w-full p-3 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent appearance-none bg-white ${!rideType ? 'text-gray-500' : 'text-gray-800'}`}
                        required
                      >
                        <option value="" disabled>Select your ride</option>
                        <option value="Instant Ride">Instant Ride</option>
                        <option value="Scheduled Ride">Scheduled Ride</option>
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent pointer-events-none" />
                    </div>
                  </div>
                  {/* Pick Up Location */}
                  <div>
                    <label htmlFor="pickup" className="block text-lg font-semibold text-gray-800 mb-2">Pick Up Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="pickup"
                        placeholder="Kotoka International Airport, Ghana."
                        className="w-full p-3 pl-4 pr-10 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                        value={pickup}
                        onChange={e => setPickup(e.target.value)}
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
                        value={dropoff}
                        onChange={e => setDropoff(e.target.value)}
                      />
                      <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                    </div>
                  </div>
                </div>
                <div className={`mt-6 grid grid-cols-1 sm:grid-cols-2 ${rideType === 'Scheduled Ride' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 items-end`}>
                  {rideType === 'Scheduled Ride' && (
                    <>
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
                            value={date}
                            onChange={e => setDate(e.target.value)}
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
                            value={time}
                            onChange={e => setTime(e.target.value)}
                          />
                          <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                        </div>
                      </div>
                    </>
                  )}
                  {/* Passaengers */}
                  <div>
                    <label htmlFor="passengers" className="block text-lg font-semibold text-gray-800 mb-2">Passaengers</label>
                    <input
                      type="number"
                      id="passengers"
                      placeholder="No. of Passangers"
                      className="w-full p-3 pl-4 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent placeholder-gray-500"
                      value={passengers}
                      onChange={e => setPassengers(e.target.value)}
                    />
                  </div>
                  {/* Book Now Button */}
                  <div>
                    <button onClick={handleBookNow} className="w-full bg-accent text-primary font-bold py-3 px-6 hover:bg-yellow-400 transition-colors text-lg">Book Now</button>
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
                <img src="https://i.ibb.co/S7HBYCvk/Airport-Transportation.jpg" alt="Airport Transportation" className="shadow-xl w-full h-auto object-cover"/>
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
                <div className="relative flex flex-col-reverse md:flex-row items-center">
                <div className="md:w-1/2 w-full bg-white p-8 md:p-12 shadow-xl relative z-10 mt-8 md:mt-0">
                    <h2 className="text-4xl font-display font-bold text-gray-800 leading-tight">Private Car Service</h2>
                    <hr className="my-6 border-gray-800 w-24 border-t-2" />
                    <p className="mt-4 text-lg text-gray-600">Travel on your schedule with a private driver. Book by the hour or choose point-to-point transfers.</p>
                    <button onClick={() => onRoleSelect('Customer')} className="mt-8 bg-primary text-white font-bold py-3 px-8 hover:bg-primary-hover transition-colors">PRIVATE CAR SERVICE</button>
                </div>
                <div className="md:w-3/5 w-full md:-ml-24">
                    <img src="https://i.ibb.co/99HNcLqx/Private-Car-Service.png" alt="Private Car Service" className="shadow-xl w-full h-auto object-cover"/>
                </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16" style={{ backgroundColor: '#EEE3E9' }}>
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
              <div className="text-white p-6" style={{ backgroundColor: '#660032' }}>
                <h4 className="font-bold font-display">Departure & Destination</h4>
                <p className="mt-2 text-sm">Book transportation for all four legs of your journey in your departure and destination cities at the same time – making airport travel easy.</p>
              </div>
              <div className="text-white p-6" style={{ backgroundColor: '#660032' }}>
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
        <section className="relative py-16 text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{backgroundImage: "url('https://i.ibb.co/wFXkyNhy/How-it-works-background-section-image.png')"}}>
          </div>
          <div className="absolute inset-0 bg-primary opacity-70"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-display font-bold">How It Works</h2>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="border-4 border-accent text-accent p-3 mb-4 rounded-full"><SearchIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">1. Search</h4>
                <p>Tell us where you're going.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-4 border-accent text-accent p-3 mb-4 rounded-full"><CheckCircleIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">2. Select</h4>
                <p>Choose your ride type.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-4 border-accent text-accent p-3 mb-4 rounded-full"><BookingIcon className="w-8 h-8"/></div>
                <h4 className="font-bold text-xl">3. Book</h4>
                <p>Confirm your ride.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="border-4 border-accent text-accent p-3 mb-4 rounded-full"><CarIcon className="w-8 h-8"/></div>
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
              <button className="text-white p-4 hover:bg-primary-hover" style={{ backgroundColor: '#660032' }}>Kotoka Int'l Airport</button>
              <button className="text-white p-4 hover:bg-primary-hover" style={{ backgroundColor: '#660032' }}>Tamale Airport</button>
              <button className="text-white p-4 hover:bg-primary-hover" style={{ backgroundColor: '#660032' }}>Takoradi Airport</button>
              <button className="text-white p-4 hover:bg-primary-hover" style={{ backgroundColor: '#660032' }}>Kumasi Airport</button>
              <button className="text-white p-4 hover:bg-primary-hover" style={{ backgroundColor: '#660032' }}>Wa Airport</button>
              <button className="text-white p-4 hover:bg-primary-hover" style={{ backgroundColor: '#660032' }}>Sunyani Airport</button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16" style={{ backgroundColor: '#660032' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-display font-bold text-white text-center">Frequently Asked Questions</h2>
            <div className="mt-12 space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left text-xl font-semibold text-white">
                    <span>{faq.q}</span>
                    <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}/>
                  </button>
                  {openFaq === index && (
                    <div className="mt-4 text-white/90 text-left pr-8">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-white" style={{ backgroundColor: '#1A0006' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* About Us Column */}
              <div>
                <h4 className="font-bold text-lg mb-4">About Us</h4>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Why Choose XTASS</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press & Media</a></li>
                </ul>
              </div>
              
              {/* Our Services Column */}
              <div>
                <h4 className="font-bold text-lg mb-4">Our Services</h4>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Instant Pickup</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Scheduled Rides</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Airport Transfers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Group Transportation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Special Needs Transport</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">24/7 Availability</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Service Areas</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing Information</a></li>
                </ul>
              </div>

              {/* Support Column */}
              <div>
                <h4 className="font-bold text-lg mb-4">Support</h4>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center / FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li>Customer Support:</li>
                  <li>+233 XXX XXX XXX</li>
                  <li>Email: support@xtass.com</li>
                  <li><a href="#" className="hover:text-white transition-colors">WhatsApp Support</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Emergency Hotline</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Report an Issue</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Lost & Found</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                  <li><a href="#" className="hover:text-white underline transition-colors">Accessibility Services</a></li>
                </ul>
              </div>
              
              {/* Legal Column */}
              <div>
                <h4 className="font-bold text-lg mb-4">Legal</h4>
                <ul className="space-y-3 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Refund & Cancellation Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Driver Agreement</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Data Protection</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Compliance & Safety</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Licensing Information</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Insurance Coverage</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-black py-4 border-t border-gray-700">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm space-y-1">
                <p>© 2025 XTASS. All rights reserved. Made with in Ghana</p>
                <p className="mt-1">Available at: Kotoka Int'l Airport | Kumasi Airport | Tamale Airport</p>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};


export default App;
