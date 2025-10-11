// SCREEN 1 ONLY UPDATED — Recreated the "Airport Transportation" section to visually match the provided reference image, including the overlapping card layout, shadows, rounded corners, and typography. The rest of the page and app remain unchanged.
import React, { useState, useCallback } from 'react';
import { CustomerApp } from './components/CustomerApp';
import { DriverApp } from './components/DriverApp';
import { AdminPanel } from './components/AdminPanel';
import type { Role, Screen } from './types';
import { SearchIcon, CheckCircleIcon, BookingIcon, CarIcon, ChevronDownIcon, MapPinIcon, CalendarIcon, ClockIcon, ShieldIcon, StarIcon, DollarSignIcon } from './components/Icons';

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
  const [view, setView] = useState('home');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openFullFaq, setOpenFullFaq] = useState<number | null>(0);
  
  // State for landing page booking form
  const [rideType, setRideType] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('');

  const NavLink: React.FC<{href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void}> = ({ href, children, onClick }) => (
    <a href={href} onClick={(e) => { e.preventDefault(); onClick?.(e); }} className="text-gray-800 hover:text-primary transition-colors">{children}</a>
  );
  
  const faqs = [
    { q: 'Can I book rides in both my departure and arrival cities?', a: 'Yes. When you book with XTASS, you can schedule all four legs of your trip with rides to and from the airport in both your home city and your destination. One booking takes care of it all.' },
    { q: 'What happens if my flight is delayed or cancelled?', a: 'We track your flight status to adjust pickup times accordingly. If your flight is cancelled, please contact our support to reschedule or cancel your ride.' },
    { q: 'How do I know if you operate at my airport?', a: 'We operate at all major airports across Ghana. You can check the "Where We Go" section on our homepage or enter your airport in the booking form to confirm.' },
    { q: 'What kind of vehicles do you use for airport transportation?', a: 'We offer a wide range of vehicles to suit your needs, including sedans, SUVs, and vans for larger groups. All vehicles are clean, modern, and regularly inspected for safety.' },
  ];

  const fullFaqs = [
    {
      q: '1. What is XTASS?',
      a: 'XTASS is a professional airport and city transportation service that provides safe, reliable, and comfortable rides for travelers across Ghana. Customers can book instant rides, schedule trips in advance, or rent vehicles with drivers for hours or days — all through a convenient online platform.'
    },
    {
      q: '2. What types of rides does XTASS offer?',
      a: 'XTASS offers three main ride types: <strong>Instant Ride</strong>, <strong>Scheduled Ride</strong>, and <strong>Rental Ride</strong>. Instant Ride is for immediate pick-up requests, Scheduled Ride lets you pre-book for a specific time, and Rental Ride allows you to hire a car with a driver for a set number of hours or a full day.'
    },
    {
      q: '3. Can I book a ride in advance?',
      a: 'Yes. With <strong>XTASS Scheduled Rides</strong>, you can plan your trip days or even weeks ahead. This feature is especially helpful for airport drop-offs, business meetings, and important events where timing is critical.'
    },
    {
      q: '4. How do I book a ride?',
      a: 'You can easily book your ride using our <strong>secure online booking system</strong>, available 24/7. Simply choose your pickup and drop-off locations, select your ride type and service level, and confirm your booking. You’ll receive instant confirmation and ride details via email and SMS.'
    },
    {
      q: '5. What areas does XTASS operate in?',
      a: 'XTASS currently serves major cities and airports across <strong>Ghana</strong>, including <strong>Accra</strong> and surrounding regions, with plans to expand across Africa and beyond. Our services cover airport transfers, city commutes, and intercity trips.'
    },
    {
      q: '6. Is XTASS available 24/7?',
      a: 'Yes. XTASS operates <strong>24 hours a day, 7 days a week</strong>, including weekends and holidays. You can request or schedule a ride anytime.'
    },
    {
      q: '7. How safe are XTASS rides?',
      a: 'Safety is our <strong>top priority</strong>. All XTASS drivers undergo strict background checks and continuous monitoring. Vehicles are regularly inspected, cleaned, and maintained to meet high safety standards. We partner only with <strong>trusted, verified local operators</strong> to ensure your well-being on every trip.'
    },
    {
      q: '8. What types of vehicles are available?',
      a: 'XTASS provides a range of vehicles across different service levels — from <strong>Premium and Business class rides</strong> for executives and comfort seekers to <strong>Economy and Basic options</strong> for everyday, budget-friendly travel. Whether you need a sedan, SUV, or van for a group, there’s always a suitable option available.'
    },
    {
      q: '9. Can I book a round-trip?',
      a: 'Yes. XTASS allows both <strong>one-way</strong> and <strong>round-trip</strong> bookings. You can plan your return ride in advance for added convenience.'
    },
    {
      q: '10. Can I use XTASS for group or family travel?',
      a: 'Absolutely. XTASS offers <strong>group travel options</strong> designed for families, tour groups, and corporate teams. Larger vehicles or multi-seat vans are available to ensure everyone rides together comfortably.'
    },
    {
      q: '11. Does XTASS provide airport transfer services?',
      a: 'Yes. <strong>Airport transfers</strong> are one of our core services. You can book a pickup or drop-off to and from the airport anytime. We also use <strong>flight tracking technology</strong> to ensure your driver arrives on time, even if your flight is delayed or rescheduled.'
    },
    {
      q: '12. What payment methods does XTASS accept?',
      a: 'XTASS accepts multiple payment options, including <strong>credit/debit cards, mobile money</strong>, and other secure online payment methods. You’ll receive a payment confirmation immediately after booking.'
    },
    {
      q: '13. Will I receive a receipt after payment?',
      a: 'Yes. You’ll receive a <strong>payment notification</strong> immediately after your booking is confirmed, and an <strong>official receipt</strong> after the trip is completed. Both are sent to your email and stored in your account’s ride history.'
    },
    {
      q: '14. Can I change or cancel my booking?',
      a: 'Yes. Bookings can be <strong>modified or canceled</strong> depending on the ride type and timing. Cancellations made early may be free, while last-minute cancellations might attract a small fee. Details are shown clearly during the booking process.'
    },
    {
      q: '15. How do I contact XTASS for support?',
      a: 'You can reach our <strong>customer support team</strong> directly through the app or website via chat, phone, or email. We’re always available to assist you with bookings, inquiries, or special requests.'
    },
    {
      q: '16. Does XTASS operate internationally?',
      a: 'XTASS currently operates in <strong>Ghana</strong> but is actively expanding across <strong>Africa</strong>. Our goal is to build a connected network of smart, safe, and efficient transportation services across the continent.'
    },
    {
      q: '17. What makes XTASS different from other transport services?',
      a: 'XTASS stands out for its <strong>uncompromising safety standards</strong>, consistent quality, and <strong>ease of booking</strong>. With multiple ride options, flexible scheduling, and transparent pricing, XTASS ensures every customer enjoys a <strong>stress-free, reliable, and high-quality travel experience.</strong>'
    }
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
  
  const commonFooter = (
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
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('terms')}} className="hover:text-white transition-colors">Terms & Conditions</a></li>
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
  );

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img src="https://i.ibb.co/6JVrf2Bt/XTASS-Logo.png" alt="XTASS Logo" className="h-10 cursor-pointer" onClick={() => setView('home')} />
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="#" onClick={() => setView('home')}>Home</NavLink>
              <NavLink href="#" onClick={() => setView('services')}>Services</NavLink>
              <NavLink href="#" onClick={() => setView('about')}>About Us</NavLink>
              <NavLink href="#" onClick={() => setView('faq')}>FAQ</NavLink>
              <NavLink href="#">Support</NavLink>
            </nav>
            <div className="flex items-center space-x-4">
              <button onClick={() => onRoleSelect('Customer')} className="hidden sm:block text-gray-800 hover:text-primary transition-colors">Sign in | Register</button>
              <button onClick={handleBookNow} className="bg-accent text-primary font-bold py-2 px-6 hover:bg-yellow-400 transition-colors">Book Now</button>
            </div>
          </div>
        </div>
      </header>

      {view === 'home' && (
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
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex flex-col-reverse md:flex-row items-center">
                    <div className="md:w-1/2 w-full bg-white p-8 md:p-12 shadow-xl relative z-10 md:mt-0 mt-8">
                        <h2 className="text-4xl font-display font-bold text-gray-800 leading-tight">Private Car Service</h2>
                        <hr className="my-6 border-gray-800 w-24 border-t-2" />
                        <p className="mt-4 text-lg text-gray-600">Travel on your schedule with a private driver. Book by the hour or choose point-to-point transfers.</p>
                        <button onClick={() => onRoleSelect('Customer')} className="mt-8 bg-primary text-white font-bold py-3 px-8 hover:bg-primary-hover transition-colors">PRIVATE CAR SERVICE</button>
                    </div>
                    <div className="md:w-3/5 w-full md:-ml-24 md:p-0">
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
          
          {commonFooter}

        </main>
      )}

      {view === 'about' && (
        <main>
          {/* Hero for About Us page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">About Us</h1>
              <p className="mt-4 text-lg text-white/90">Learn more about our mission and commitment to excellence.</p>
            </div>
          </div>

          {/* About XTASS Section */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="prose lg:prose-lg max-w-none text-gray-600 space-y-4">
                  <h2 className="text-3xl font-display font-bold text-gray-800">About XTASS</h2>
                  <p>XTASS has been provides affordable, convenient, and reliable airport and city transportation services to travelers in Ghana since its launch. Customers can choose how they want to ride with Instant Ride, Scheduled Ride and Rental Ride. In every location, XTASS delivers a safe and comfortable way to get to and from the airport, your hotel, tourist destinations or anywhere preferably.</p>
                  <p>XTASS offers airport transfers, private car service, and group travel options, including premium, Business, Economy and Basic services that can be reserved by the hour for personalized, around-town rides.</p>
                </div>
                <div>
                  <img src="https://i.ibb.co/99HNcLqx/Private-Car-Service.png" alt="XTASS Car" className="rounded-lg shadow-xl w-full h-auto object-cover"/>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose XTASS Section */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-display font-bold text-gray-800">Why Choose XTASS</h2>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {/* Safety Card */}
                <div className="bg-white p-8 shadow-lg rounded-lg">
                  <ShieldIcon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-display text-gray-800">Safety</h3>
                  <p className="mt-2 text-gray-600">At XTASS, safety has always been and will always be our top priority. We implement strict background checks, continuous driver monitoring, and high vehicle maintenance standards across our trusted local partners. When you ride with XTASS, you ride with confidence knowing we prioritize your well-being every step of the way.</p>
                </div>
                {/* Consistent Quality Card */}
                <div className="bg-white p-8 shadow-lg rounded-lg">
                  <StarIcon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-display text-gray-800">Consistent Quality</h3>
                  <p className="mt-2 text-gray-600">We take pride in delivering the same friendly, dependable, and affordable service in every city through our growing network of trusted affiliates.</p>
                </div>
                {/* Easy to Book Card */}
                <div className="bg-white p-8 shadow-lg rounded-lg">
                  <BookingIcon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-display text-gray-800">Easy to Book</h3>
                  <p className="mt-2 text-gray-600">Our secure online booking system is available 24/7, allowing you to schedule or request rides anytime, anywhere. XTASS can be booked for one-way or round-trip transportation at both departure and destination cities. Whether you’re traveling for business, vacation, or daily commutes, XTASS makes ground transportation simple and stress-free.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Section */}
          <section className="py-16 md:py-20" style={{ backgroundColor: '#EEE3E9' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">Follow us as we expand across Africa and beyond, introducing smarter, safer, and more efficient travel experiences for everyone.</p>
              <p className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed">Let XTASS be your go-to for all your airport and city transportation needs locally and internationally.</p>
            </div>
          </section>
          
          {commonFooter}
        </main>
      )}

      {view === 'services' && (
        <main>
          {/* Hero for Services page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Our Services</h1>
              <p className="mt-4 text-lg text-white/90">A complete range of airport and city transportation options.</p>
            </div>
          </div>

          {/* XTASS Services Section */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="prose lg:prose-lg max-w-none text-gray-600 space-y-4">
                  <h2 className="text-3xl font-display font-bold text-gray-800">XTASS Services</h2>
                  <p>XTASS provides a complete range of airport and city transportation options designed to meet the needs of every traveler. Whether you’re looking for a quick airport transfer, a private car for business, or a rental ride for a day of sightseeing, XTASS ensures a smooth, reliable, and comfortable experience from start to finish.</p>
                  <h4 className="font-bold text-gray-800">Ride Options</h4>
                  <p>XTASS offers three main ride types — <strong>Instant Ride, Scheduled Ride, and Rental Ride</strong>. Instant Ride allows customers to request a ride on demand whenever they need to move immediately. This is perfect for travelers with sudden schedule changes or urgent transportation needs. Scheduled Ride lets customers book a vehicle in advance for a specific time and date, offering peace of mind for planned airport drop-offs, meetings, or special occasions. Rental Ride provides the flexibility to hire a vehicle with a professional driver for several hours or the entire day, ideal for those who have multiple stops, sightseeing plans, or business errands around town.</p>
                  <h4 className="font-bold text-gray-800">Service Types</h4>
                   <p>The platform caters to different travel needs with options including <strong>Airport Transfers, Private Car Services, and Group Travel</strong>. Airport Transfers ensure smooth and timely trips to and from the airport, eliminating the stress of catching or missing a flight. Private Car Services are tailored for individuals or small groups who value comfort, privacy, and exclusivity. Group Travel services accommodate larger groups, making them ideal for family trips, corporate travel, or tourist groups moving together.</p>
                   <h4 className="font-bold text-gray-800">Service Levels</h4>
                  <p>XTASS understands that every traveler has unique expectations, so it provides four service tiers: <strong>Premium, Business, Economy, and Basic.</strong> The Premium service delivers a top-tier experience with luxury vehicles, professional drivers, and additional comforts such as onboard Wi-Fi and refreshments. Business service provides high-quality vehicles and professional service at a slightly more affordable rate, perfect for executives and professionals. Economy service focuses on comfort and affordability, offering clean and reliable rides for everyday use. For those who only need essential, budget-friendly transportation, the Basic service ensures safety and reliability without extra frills.</p>
                </div>
                <div>
                  <img src="https://i.ibb.co/S7HBYCvk/Airport-Transportation.jpg" alt="XTASS Airport Service" className="rounded-lg shadow-xl w-full h-auto object-cover"/>
                </div>
              </div>
            </div>
          </section>
          
          {/* Our Commitment Section */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-display font-bold text-gray-800">Our Commitment to You</h2>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {/* Booking Flexibility Card */}
                <div className="bg-white p-8 shadow-lg rounded-lg">
                  <BookingIcon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-display text-gray-800">Booking Flexibility</h3>
                  <p className="mt-2 text-gray-600">XTASS makes it easy to plan and manage your rides with a secure 24/7 online booking system. Customers can choose <strong>one-way or round-trip</strong> options depending on their travel needs. The service accommodates <strong>pick-ups and drop-offs from airports, hotels, tourist destinations, or any address within the operating city.</strong> Whether booking in advance or at the last minute, XTASS ensures convenience and flexibility every time.</p>
                </div>
                {/* Safety and Quality Card */}
                <div className="bg-white p-8 shadow-lg rounded-lg">
                  <ShieldIcon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-display text-gray-800">Safety and Quality Assurance</h3>
                  <p className="mt-2 text-gray-600">Safety remains the foundation of XTASS operations. Every driver undergoes <strong>thorough background checks and continuous monitoring</strong> to ensure high standards of professionalism. Vehicles are regularly inspected and maintained to guarantee reliability and comfort. XTASS also partners with trusted local affiliates to maintain consistent quality and safety across all its service areas. When you ride with XTASS, you can be confident that your <strong>safety and satisfaction come first.</strong></p>
                </div>
                {/* Pricing and Value Card */}
                <div className="bg-white p-8 shadow-lg rounded-lg">
                  <DollarSignIcon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-display text-gray-800">Pricing and Value</h3>
                  <p className="mt-2 text-gray-600">Pricing for XTASS services is based on several factors including the <strong>type of service selected, distance, duration, and vehicle category.</strong> Premium and Business rides offer added comfort at higher rates, while Economy and Basic options remain cost-effective without compromising safety. Customers also have the choice between <strong>Instant, Scheduled, or Rental</strong> modes, ensuring that every budget and travel style is accommodated.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Section */}
          <section className="py-16 md:py-20" style={{ backgroundColor: '#EEE3E9' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center prose lg:prose-lg max-w-none text-gray-700 space-y-4">
              <h4 className="font-bold text-gray-800">Coverage and Use Cases</h4>
              <p className="leading-relaxed">XTASS serves a wide range of transportation needs, from <strong>airport pick-ups and city commutes to intercity travel and group transportation.</strong> It is ideal for business travelers heading to meetings, tourists exploring local attractions, families traveling together, and individuals who simply want dependable rides for daily movement. The rental option makes it easy to move between multiple locations without the stress of finding new rides throughout the day.</p>
              <h4 className="font-bold text-gray-800">In Summary</h4>
              <p className="leading-relaxed">XTASS brings together <strong>comfort, flexibility, safety, and affordability</strong> in one platform. Whether you need an airport transfer, city ride, or hourly rental, XTASS ensures that every journey is easy to book, safe to ride, and consistently high in quality. As the company expands across Africa and beyond, XTASS continues to redefine how travelers experience ground transportation — <strong>one reliable ride at a time.</strong></p>
            </div>
          </section>
          
          {commonFooter}
        </main>
      )}
      
      {view === 'faq' && (
        <main>
          {/* Hero for FAQ page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Frequently Asked Questions</h1>
              <p className="mt-4 text-lg text-white/90">Your questions, answered.</p>
            </div>
          </div>
          
          {/* Full FAQ Section */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                {fullFaqs.map((faq, index) => (
                  <div key={index} className="border-b pb-6">
                    <button 
                      onClick={() => setOpenFullFaq(openFullFaq === index ? null : index)} 
                      className="w-full flex justify-between items-center text-left text-xl font-semibold text-gray-800 hover:text-primary"
                    >
                      <span dangerouslySetInnerHTML={{ __html: faq.q }}></span>
                      <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${openFullFaq === index ? 'rotate-180' : ''}`}/>
                    </button>
                    {openFullFaq === index && (
                      <div 
                        className="mt-4 text-gray-600 text-left pr-8 prose"
                        dangerouslySetInnerHTML={{ __html: faq.a }}
                      >
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'terms' && (
        <main>
          {/* Hero for Terms page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Terms & Conditions</h1>
              <p className="mt-4 text-lg text-white/90">Please read our terms carefully before using our services.</p>
            </div>
          </div>
          
          {/* Terms and Conditions Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>Welcome to XTASS. These Terms and Conditions govern your access to and use of our transportation services, including instant rides, scheduled rides, rental rides, and any related features or platforms provided by XTASS. By using our website, mobile app, or booking services, you agree to be bound by these Terms. If you do not agree, please do not use our services.</p>
                  <p>XTASS operates as a professional airport and city transportation service in Ghana, connecting customers with verified drivers and vehicles for safe, reliable, and convenient travel.</p>

                  <h4>2. Definitions</h4>
                  <p>“XTASS,” “we,” “us,” or “our” refers to XTASS, its affiliates, and authorized service partners.<br/>
                  “Customer,” “you,” or “user” refers to anyone who books, uses, or accesses XTASS services.<br/>
                  “Driver” refers to any individual or partner who provides transportation under the XTASS platform.<br/>
                  “Service” refers to any transportation or related service offered by XTASS, including Instant Ride, Scheduled Ride, and Rental Ride.</p>

                  <h4>3. Service Use</h4>
                  <p>You agree to use XTASS services only for lawful purposes and in accordance with these Terms. When booking a ride, you are responsible for providing accurate information such as pickup location, destination, and contact details.</p>
                  <p>XTASS may refuse or cancel bookings if the information provided is false, incomplete, or suspected of misuse. Misbehavior toward drivers or misuse of vehicles may result in suspension or termination of your account.</p>

                  <h4>4. Booking and Confirmation</h4>
                  <p>Bookings can be made through the XTASS website or mobile application. Once a booking is completed, you will receive a confirmation message via email or SMS containing the ride details.</p>
                  <ul>
                    <li>For <strong>Scheduled Rides</strong>, your driver will arrive at the confirmed time and location.</li>
                    <li>For <strong>Instant Rides</strong>, the system automatically assigns the nearest available driver.</li>
                    <li>For <strong>Rental Rides</strong>, the service includes a dedicated driver for the agreed duration.</li>
                  </ul>
                  <p>XTASS reserves the right to reassign or cancel bookings in case of operational issues, safety concerns, or driver unavailability.</p>

                  <h4>5. Payments and Pricing</h4>
                  <p>XTASS offers transparent and competitive pricing across all service tiers — Premium, Business, Economy, and Basic.</p>
                  <ul>
                    <li>All fares are displayed before booking confirmation.</li>
                    <li>Prices may vary depending on distance, duration, time of day, and service type.</li>
                    <li>Payments can be made via credit/debit cards, mobile money, or other approved online payment methods.</li>
                    <li>Once a ride is completed, customers receive a payment notification immediately and a receipt afterward via email or app.</li>
                    <li>Any unpaid or disputed charges must be resolved promptly with XTASS customer support.</li>
                  </ul>

                  <h4>6. Cancellations and Refunds</h4>
                  <ul>
                    <li><strong>Free cancellation:</strong> Available if done before the driver is dispatched or within the allowed time frame.</li>
                    <li><strong>Late cancellation:</strong> May result in a small cancellation fee.</li>
                    <li><strong>No-show:</strong> If the driver arrives and the customer is not present after a waiting period, the full fare may be charged.</li>
                  </ul>
                  <p>Refunds, where applicable, will be processed within a reasonable period after verification.</p>

                  <h4>7. Safety and Conduct</h4>
                  <p>XTASS prioritizes the safety of both passengers and drivers.</p>
                  <ul>
                    <li>All drivers undergo strict background checks and continuous monitoring.</li>
                    <li>Vehicles are regularly maintained to meet high safety standards.</li>
                    <li>Customers are expected to behave respectfully toward drivers and other passengers.</li>
                  </ul>
                  <p>XTASS reserves the right to deny service or block users who engage in inappropriate, unsafe, or unlawful behavior.</p>

                  <h4>8. Liability</h4>
                  <p>XTASS acts as a transportation service facilitator. While we take every measure to ensure reliability and safety, XTASS is not liable for any:</p>
                  <ul>
                    <li>Delays due to traffic, weather, or unforeseen circumstances.</li>
                    <li>Lost or damaged personal belongings during rides.</li>
                    <li>Indirect, incidental, or consequential damages resulting from use of the service.</li>
                  </ul>
                  <p>However, XTASS will make reasonable efforts to assist customers in resolving any issues that occur during their trip.</p>

                  <h4>9. Account and Data Protection</h4>
                  <p>If you create an account on the XTASS platform, you are responsible for maintaining the confidentiality of your login details. You agree not to share your credentials with others or use another person’s account without permission.</p>
                  <p>XTASS values your privacy and handles all personal data in accordance with applicable data protection laws. Personal information such as name, contact details, and payment information is securely stored and never shared with unauthorized parties.</p>

                  <h4>10. Service Modifications</h4>
                  <p>XTASS may modify, update, or discontinue certain features or services at any time to improve performance, security, or customer experience. Notice will be provided in cases of major updates that affect how the service operates.</p>

                  <h4>11. Intellectual Property</h4>
                  <p>All content, trademarks, logos, designs, and materials on the XTASS platform are the property of XTASS. You may not copy, reproduce, or distribute any materials without written consent.</p>

                  <h4>12. Governing Law</h4>
                  <p>These Terms and Conditions are governed by the laws of the Republic of Ghana. Any disputes arising from the use of XTASS services shall be resolved under Ghanaian jurisdiction.</p>

                  <h4>13. Limitation of Use</h4>
                  <p>Users must not use XTASS for unlawful activities, transport of illegal goods, or any action that violates national laws or public safety regulations. Misuse of the platform may result in account suspension or legal action.</p>

                  <h4>14. Feedback and Complaints</h4>
                  <p>XTASS welcomes customer feedback to continually improve our services. For any complaints, lost item reports, or refund requests, please contact our customer support team through the website, app, or official email. We aim to resolve all issues fairly and promptly.</p>

                  <h4>15. Changes to Terms</h4>
                  <p>XTASS reserves the right to update these Terms & Conditions at any time. Revised terms will take effect upon publication on our website or app. Continued use of our services after updates implies your acceptance of the new terms.</p>

                  <h4>16. Contact Information</h4>
                  <p>XTASS Customer Support<br/>
                  📧 Email: <a href="mailto:support@xtass.com">support@xtass.com</a><br/>
                  📞 Phone: +233 XXX XXX XXX<br/>
                  🌐 Website: <a href="https://www.xtass.com" target="_blank" rel="noopener noreferrer">www.xtass.com</a></p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

    </div>
  );
};


export default App;