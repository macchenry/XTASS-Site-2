// SCREEN 1 ONLY UPDATED — Recreated the "Airport Transportation" section to visually match the provided reference image, including the overlapping card layout, shadows, rounded corners, and typography. The rest of the page and app remain unchanged.
import React, { useState, useCallback } from 'react';
import { CustomerApp } from './components/CustomerApp';
import { DriverApp } from './components/DriverApp';
import { AdminPanel } from './components/AdminPanel';
import type { Role, Screen } from './types';
import { SearchIcon, CheckCircleIcon, BookingIcon, CarIcon, ChevronDownIcon, MapPinIcon, CalendarIcon, ClockIcon, ShieldIcon, StarIcon, DollarSignIcon, UploadCloudIcon } from './components/Icons';

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

  // State for Report an Issue form
  const [reportIssueData, setReportIssueData] = useState({
      fullName: '',
      email: '',
      phone: '',
      tripDate: '',
      tripType: '',
      issueType: '',
      description: '',
  });
  const [reportFile, setReportFile] = useState<File | null>(null);

  // State for Lost & Found form
  const [lostAndFoundData, setLostAndFoundData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tripDate: '',
    tripType: '',
    description: '',
  });
  const [lostAndFoundFile, setLostAndFoundFile] = useState<File | null>(null);


  const handleReportIssueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setReportIssueData(prev => ({ ...prev, [name]: value }));
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setReportFile(e.target.files[0]);
      } else {
          setReportFile(null);
      }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Thank you for your report. Our team will review it and get back to you shortly.');
      // Reset form
      setReportIssueData({
          fullName: '',
          email: '',
          phone: '',
          tripDate: '',
          tripType: '',
          issueType: '',
          description: '',
      });
      setReportFile(null);
  };

  const handleLostAndFoundChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLostAndFoundData(prev => ({ ...prev, [name]: value }));
  };

  const handleLostAndFoundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setLostAndFoundFile(e.target.files[0]);
      } else {
          setLostAndFoundFile(null);
      }
  };

  const handleLostAndFoundSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Your lost item report has been submitted. We will contact you shortly.');
      // Reset form
      setLostAndFoundData({
          fullName: '',
          email: '',
          phone: '',
          tripDate: '',
          tripType: '',
          description: '',
      });
      setLostAndFoundFile(null);
  };


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
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('report-issue')}} className="hover:text-white transition-colors">Report an Issue</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('lost-and-found')}} className="hover:text-white transition-colors">Lost & Found</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('accessibility')}} className="hover:text-white underline transition-colors">Accessibility Services</a></li>
              </ul>
            </div>
            
            {/* Legal Column */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('terms')}} className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('privacy')}} className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('cookie')}} className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('refund')}} className="hover:text-white transition-colors">Refund & Cancellation Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Driver Agreement</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('community')}} className="hover:text-white transition-colors">Community Guidelines</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('data-protection')}} className="hover:text-white transition-colors">Data Protection</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('compliance')}} className="hover:text-white transition-colors">Compliance & Safety</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('licensing')}} className="hover:text-white transition-colors">Licensing Information</a></li>
                <li><a href="#" onClick={(e) => {e.preventDefault(); setView('insurance')}} className="hover:text-white transition-colors">Insurance Coverage</a></li>
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

      {view === 'privacy' && (
        <main>
          {/* Hero for Privacy Policy page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Privacy Policy</h1>
              <p className="mt-4 text-lg text-white/90">Your privacy is important to us.</p>
            </div>
          </div>
          
          {/* Privacy Policy Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>XTASS respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website, mobile app, or any XTASS transportation services. By using XTASS, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of our services.</p>

                  <h4>2. Information We Collect</h4>
                  <p>XTASS collects personal and non-personal information to provide and improve our services. The information we collect includes:</p>
                  <h5>a. Personal Information</h5>
                  <ul>
                    <li>Full name, phone number, and email address</li>
                    <li>Pickup and drop-off locations</li>
                    <li>Payment information (e.g., card details, mobile money number)</li>
                    <li>Profile picture or ID (if applicable)</li>
                    <li>Communication preferences and booking history</li>
                  </ul>
                  <h5>b. Technical and Usage Data</h5>
                  <ul>
                    <li>Device type, IP address, and browser information</li>
                    <li>App usage statistics and access logs</li>
                    <li>Location data (GPS) when using ride services</li>
                    <li>Cookies and similar technologies for analytics and personalization</li>
                  </ul>
                  
                  <h4>3. How We Use Your Information</h4>
                  <p>XTASS uses your data to deliver safe, efficient, and personalized services. Specifically, we use your information to:</p>
                  <ul>
                    <li>Process ride bookings, payments, and confirmations</li>
                    <li>Connect you with drivers and provide navigation assistance</li>
                    <li>Communicate trip updates, notifications, and customer support responses</li>
                    <li>Improve our platform’s features, performance, and user experience</li>
                    <li>Ensure safety and compliance through background checks and fraud prevention</li>
                    <li>Send promotional offers, service updates, and newsletters (only with your consent)</li>
                  </ul>

                  <h4>4. Location Data</h4>
                  <p>XTASS relies on location information to operate effectively.</p>
                  <ul>
                    <li>Your real-time GPS location helps assign the nearest driver and estimate arrival times.</li>
                    <li>Drivers’ locations are tracked during trips to ensure safety and trip accuracy.</li>
                  </ul>
                  <p>You can disable location access in your device settings, but doing so may limit the functionality of the XTASS app.</p>
                  
                  <h4>5. Payment Information</h4>
                  <p>XTASS processes all payments through secure, encrypted channels. We do not store full card or mobile money details on our servers. Payment processing is handled by trusted third-party providers who comply with international data security standards (PCI-DSS).</p>

                  <h4>6. Data Sharing and Disclosure</h4>
                  <p>XTASS does not sell or rent your personal data. However, we may share necessary information in the following cases:</p>
                  <ul>
                      <li><strong>With Drivers:</strong> To complete your trip (e.g., pickup location, name, contact).</li>
                      <li><strong>With Payment Providers:</strong> For secure payment processing.</li>
                      <li><strong>With Law Enforcement:</strong> If required by law, regulation, or court order.</li>
                      <li><strong>With Service Partners:</strong> For analytics, app improvement, and customer support under strict confidentiality agreements.</li>
                  </ul>
                  <p>All third parties handling your data are required to maintain the same level of security and privacy as XTASS.</p>

                  <h4>7. Data Retention</h4>
                  <p>We retain your information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes. After this period, data is securely deleted or anonymized.</p>

                  <h4>8. Data Security</h4>
                  <p>XTASS employs advanced security measures to protect your data against unauthorized access, loss, or misuse. This includes:</p>
                  <ul>
                    <li>Secure servers and encryption protocols (SSL/TLS)</li>
                    <li>Access control and regular security audits</li>
                    <li>Continuous monitoring for suspicious activities</li>
                  </ul>
                  <p>However, no system is 100% secure, and XTASS cannot guarantee absolute security. Users are advised to safeguard their login details and report any suspicious activity immediately.</p>
                  
                  <h4>9. Your Rights</h4>
                  <p>As a user, you have the right to:</p>
                  <ul>
                    <li>Access and review your personal information</li>
                    <li>Request correction of inaccurate or outdated data</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Request deletion of your account and personal data</li>
                    <li>Opt out of marketing communications at any time</li>
                  </ul>
                  <p>To exercise these rights, contact XTASS through the details provided below.</p>

                  <h4>10. Cookies and Tracking Technologies</h4>
                  <p>XTASS uses cookies and tracking tools to enhance user experience, analyze site traffic, and personalize content. You can manage or disable cookies through your browser settings, but some site features may not function properly without them.</p>

                  <h4>11. Children’s Privacy</h4>
                  <p>XTASS services are not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If a child’s information is discovered, it will be deleted promptly.</p>

                  <h4>12. International Data Transfers</h4>
                  <p>If XTASS expands outside Ghana, your information may be processed in other countries where data protection laws differ. In such cases, XTASS ensures all transfers are secured and compliant with applicable regulations.</p>

                  <h4>13. Policy Updates</h4>
                  <p>XTASS may update this Privacy Policy periodically to reflect legal, operational, or service changes. Any updates will be posted on our website and mobile app. The “Last Updated” date will indicate when the latest version took effect. Continued use of our services after any update means you accept the revised terms.</p>

                  <h4>14. Contact Us</h4>
                  <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact:</p>
                  <p><strong>XTASS Privacy Office</strong><br/>
                  📧 Email: <a href="mailto:privacy@xtass.com">privacy@xtass.com</a><br/>
                  📞 Phone: +233 XXX XXX XXX<br/>
                  🌐 Website: <a href="https://www.xtass.com" target="_blank" rel="noopener noreferrer">www.xtass.com</a></p>

                  <h4>15. Effective Date</h4>
                  <p>This Privacy Policy is effective as of October 27, 2023 and applies to all users of XTASS services in Ghana and future regions of operation.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'cookie' && (
        <main>
          {/* Hero for Cookie Policy page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Cookie Policy</h1>
              <p className="mt-4 text-lg text-white/90">How we use cookies to improve your experience.</p>
            </div>
          </div>
          
          {/* Cookie Policy Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>This Cookie Policy explains how XTASS (“we,” “our,” or “us”) uses cookies and similar tracking technologies on our website, mobile application, and digital platforms. It outlines what cookies are, how we use them, and how you can manage your preferences. By continuing to browse or use XTASS services, you agree to our use of cookies as described in this policy.</p>

                  <h4>2. What Are Cookies?</h4>
                  <p>Cookies are small text files that are stored on your computer, smartphone, or other device when you visit a website or use an app. They help websites function properly, improve performance, and remember your preferences. Some cookies are temporary (session cookies) and are deleted when you close your browser, while others are stored for longer periods (persistent cookies).</p>
                  
                  <h4>3. How XTASS Uses Cookies</h4>
                  <p>XTASS uses cookies to provide a smooth, secure, and personalized experience. The main purposes include:</p>
                  <h5>a. Essential Cookies</h5>
                  <p>These are necessary for the website or app to function correctly. They enable basic features such as secure login, ride booking, and payment processing. Without these cookies, certain parts of the XTASS platform may not work properly.</p>
                  <h5>b. Performance and Analytics Cookies</h5>
                  <p>These cookies help us understand how users interact with our platform by collecting data such as pages visited, time spent, and actions taken. This allows us to improve performance, optimize loading speed, and enhance usability.</p>
                  <h5>c. Functional Cookies</h5>
                  <p>These cookies allow XTASS to remember your preferences, such as saved locations, selected language, ride type, or login details, so you don’t have to re-enter them each time you visit.</p>
                  <h5>d. Advertising and Marketing Cookies</h5>
                  <p>XTASS may use these cookies to deliver relevant advertisements or promotional offers based on your browsing activity. They also help us measure the effectiveness of our marketing campaigns.</p>
                  <h5>e. Security Cookies</h5>
                  <p>These cookies help detect fraud, protect your account, and ensure your data is used safely.</p>

                  <h4>4. Third-Party Cookies</h4>
                  <p>Some cookies on XTASS may come from trusted third-party services we use for analytics, advertising, or functionality enhancement — for example, Google Analytics, Meta (Facebook) Pixel, or payment gateways. These third parties may collect information about your online behavior to improve their own services. XTASS does not control these cookies and recommends reviewing their respective privacy and cookie policies for more details.</p>

                  <h4>5. Managing Cookies</h4>
                  <p>You have full control over how cookies are used on your device. You can:</p>
                  <ul>
                    <li>Accept or reject cookies through the cookie consent banner displayed on the XTASS website or app.</li>
                    <li>Adjust your browser or mobile settings to block, restrict, or delete cookies.</li>
                    <li>Clear your browser’s cookie cache at any time.</li>
                  </ul>
                  <p>Please note that disabling certain cookies may affect the functionality of XTASS services, such as preventing secure logins or saving your ride preferences.</p>

                  <h4>6. Your Consent</h4>
                  <p>When you first visit the XTASS website or use the app, you will see a cookie consent banner allowing you to accept or customize cookie settings. By clicking “Accept All” or continuing to use our services, you consent to our use of cookies in accordance with this policy.</p>

                  <h4>7. Updates to This Cookie Policy</h4>
                  <p>XTASS may update this Cookie Policy periodically to reflect changes in technology, applicable laws, or our operational practices. Updated versions will be posted on our website with a revised “Last Updated” date. We encourage users to review this policy regularly to stay informed.</p>
                  
                  <h4>8. Contact Us</h4>
                  <p>If you have questions or concerns about our use of cookies or this policy, please contact us at:</p>
                  <p><strong>XTASS Privacy Office</strong><br/>
                  Email: <a href="mailto:privacy@xtass.com">privacy@xtass.com</a><br/>
                  Phone: +233 XXX XXX XXX<br/>
                  Website: <a href="https://www.xtass.com" target="_blank" rel="noopener noreferrer">www.xtass.com</a></p>

                  <h4>9. Effective Date</h4>
                  <p>This Cookie Policy is effective as of October 27, 2023 and applies to all visitors and users of XTASS online services.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'refund' && (
        <main>
          {/* Hero for Refund & Cancellation Policy page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Refund & Cancellation Policy</h1>
              <p className="mt-4 text-lg text-white/90">Details on how we handle refunds and cancellations.</p>
            </div>
          </div>
          
          {/* Refund Policy Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>This Refund and Cancellation Policy explains how XTASS (“we,” “our,” or “us”) handles ride cancellations, refunds, and booking modifications. By booking a ride with XTASS through our website, mobile app, or digital channels, you agree to the terms outlined in this policy.</p>

                  <h4>2. Ride Cancellation by Customers</h4>
                  <h5>a. Instant Rides:</h5>
                  <p>Once an instant ride is confirmed and a driver has been assigned, cancellation by the customer may incur a cancellation fee. The fee depends on how long after booking the cancellation is made.</p>
                  <h5>b. Scheduled Rides:</h5>
                  <p>Customers may cancel a scheduled ride up to 30 minutes before the pickup time without penalty. Cancellations made within 30 minutes of the pickup time may result in a partial charge or forfeiture of the booking amount.</p>
                  <h5>c. Rental Rides:</h5>
                  <p>For hourly or daily rental rides, customers must cancel at least 2 hours before the scheduled start time to receive a full refund. Late cancellations may attract a 20%–50% cancellation fee depending on the time of cancellation.</p>

                  <h4>3. Refund Eligibility</h4>
                  <p>Refunds are issued under the following conditions:</p>
                  <ul>
                    <li>The ride was canceled by XTASS or the assigned driver due to operational issues.</li>
                    <li>The customer canceled within the free cancellation window.</li>
                    <li>Duplicate bookings were made due to a technical error.</li>
                    <li>Payment was made, but no driver was assigned or service not delivered.</li>
                  </ul>
                  <p>Refunds will not be issued for:</p>
                  <ul>
                    <li>Late cancellations outside the allowed window.</li>
                    <li>No-shows or when the driver arrives but the customer fails to appear.</li>
                    <li>Service dissatisfaction caused by factors outside XTASS’s control (e.g., traffic delays, weather).</li>
                  </ul>

                  <h4>4. Refund Process</h4>
                  <p>Refund requests should be submitted through the XTASS mobile app, website contact form, or customer service email (support@xtass.com). Approved refunds will be processed to the original payment method within 5–10 business days, depending on your bank or payment provider. XTASS will notify you by email once your refund has been processed.</p>

                  <h4>5. Cancellations by XTASS or Drivers</h4>
                  <p>In rare circumstances (vehicle breakdown, safety issues, or driver unavailability), XTASS or the driver may cancel your ride. If this occurs, customers are entitled to:</p>
                  <ul>
                    <li>A full refund of the fare amount, or</li>
                    <li>A free reschedule of the ride at the earliest available time.</li>
                  </ul>
                  <p>XTASS is not liable for any indirect losses (such as missed flights or appointments) resulting from such cancellations.</p>

                  <h4>6. Modifying a Booking</h4>
                  <p>Customers can modify pickup time or drop-off location before a driver is assigned, depending on availability. If a modification increases trip distance or duration, fare adjustments will apply. Once a driver is on the way, modification may be treated as a cancellation and rebooking.</p>

                  <h4>7. Payment Disputes</h4>
                  <p>If you notice an incorrect charge or have a concern about a transaction, please contact our billing support at billing@xtass.com within 7 days of the ride completion. XTASS will investigate and, if applicable, issue a correction or refund.</p>
                  
                  <h4>8. Non-Refundable Items</h4>
                  <p>Certain fees are non-refundable, including:</p>
                  <ul>
                    <li>Service fees and transaction charges.</li>
                    <li>Late cancellation or no-show penalties.</li>
                    <li>Promotional or discounted rides unless canceled by XTASS.</li>
                  </ul>

                  <h4>9. Contact Us</h4>
                  <p>For all refund or cancellation-related inquiries, please contact:</p>
                  <p><strong>XTASS Customer Care</strong><br/>
                  Email: <a href="mailto:support@xtass.com">support@xtass.com</a><br/>
                  Phone: +233 XXX XXX XXX<br/>
                  Website: <a href="https://www.xtass.com" target="_blank" rel="noopener noreferrer">www.xtass.com</a></p>

                  <h4>10. Updates to This Policy</h4>
                  <p>XTASS may update this Refund and Cancellation Policy from time to time to reflect changes in service terms, legal requirements, or operational processes. Updated versions will be posted on our website with a revised “Last Updated” date.</p>

                  <h4>11. Effective Date</h4>
                  <p>This Refund & Cancellation Policy is effective as of October 27, 2023 and applies to all XTASS customers and services.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'community' && (
        <main>
          {/* Hero for Community Guidelines page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Community Guidelines</h1>
              <p className="mt-4 text-lg text-white/90">Our commitment to a safe and respectful community.</p>
            </div>
          </div>
          
          {/* Community Guidelines Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>At XTASS, our mission is to provide safe, respectful, and reliable transportation experiences for everyone. These Community Guidelines outline the standards of behavior expected from all customers, drivers, and partners using the XTASS platform. By using XTASS services, you agree to follow these guidelines and promote a safe, professional, and welcoming community.</p>

                  <h4>2. Respect and Courtesy</h4>
                  <p>XTASS values respect and courtesy at all times. All users — passengers, drivers, and support staff — must treat one another with professionalism and kindness.</p>
                  <ul>
                    <li>Be polite and use respectful language.</li>
                    <li>Avoid insults, discrimination, or offensive gestures.</li>
                    <li>Treat vehicles, property, and people with care.</li>
                    <li>Maintain calm communication, even in case of delays or misunderstandings.</li>
                  </ul>
                  <p>Disrespectful, threatening, or abusive behavior may result in temporary or permanent suspension of your account.</p>

                  <h4>3. Safety Comes First</h4>
                  <p>Safety is the foundation of every XTASS trip. To protect both drivers and riders:</p>
                  <ul>
                    <li>Always wear your seatbelt.</li>
                    <li>Follow all local traffic laws and safety regulations.</li>
                    <li>Do not ask or pressure the driver to speed, break rules, or take unsafe shortcuts.</li>
                    <li>Passengers should not distract the driver or interfere with driving.</li>
                    <li>Drivers must ensure their vehicle is roadworthy, clean, and properly maintained.</li>
                    <li>No weapons, drugs, or illegal items are permitted in the vehicle.</li>
                  </ul>
                  <p>If you ever feel unsafe, contact XTASS support immediately or use the emergency contact feature in the app.</p>

                  <h4>4. Honesty and Fair Use</h4>
                  <p>XTASS is built on trust. Dishonest or fraudulent behavior harms the entire community. Users must not:</p>
                  <ul>
                    <li>Create fake or duplicate accounts.</li>
                    <li>Provide false information or impersonate others.</li>
                    <li>Book rides without intent to travel or repeatedly cancel trips.</li>
                    <li>Manipulate pricing, ratings, or referral systems.</li>
                    <li>Request payment outside the XTASS platform.</li>
                  </ul>
                  <p>Fraudulent or deceptive activities may result in account deactivation and possible legal action.</p>

                  <h4>5. Cleanliness and Care</h4>
                  <p>All XTASS users should help maintain a clean and pleasant environment.</p>
                  <ul>
                    <li><strong>Drivers:</strong> Keep your vehicle tidy, free of odors, and in good condition.</li>
                    <li><strong>Riders:</strong> Avoid littering, eating messy foods, or causing damage to the vehicle.</li>
                  </ul>
                  <p>Both parties should leave the vehicle as they found it. If damage occurs, the responsible party may be charged a cleaning or repair fee.</p>

                  <h4>6. Ratings and Feedback</h4>
                  <p>XTASS uses a rating system to ensure quality service and accountability. When rating a trip:</p>
                  <ul>
                    <li>Be fair and objective — rate based on the overall experience, not unrelated issues.</li>
                    <li>Use feedback constructively to help improve service quality.</li>
                    <li>Repeated false or malicious reviews will be investigated and may lead to removal.</li>
                  </ul>

                  <h4>7. Zero Tolerance Policy</h4>
                  <p>XTASS has zero tolerance for:</p>
                  <ul>
                    <li>Harassment or discrimination based on race, religion, gender, or background.</li>
                    <li>Physical or verbal abuse.</li>
                    <li>Use of alcohol or drugs while driving.</li>
                    <li>Unsafe, reckless, or illegal driving behavior.</li>
                    <li>Soliciting inappropriate or personal favors.</li>
                  </ul>
                  <p>Any user found violating these standards will face immediate suspension or permanent removal from the platform.</p>

                  <h4>8. Lost and Found</h4>
                  <p>If you leave an item in a vehicle, contact the driver through the XTASS app or our support team. XTASS will make reasonable efforts to help recover lost items, though we cannot guarantee retrieval.</p>

                  <h4>9. Reporting and Enforcement</h4>
                  <p>If you experience misconduct or unsafe behavior, report it through the XTASS app or contact support@xtass.com. All reports are treated seriously and investigated confidentially. XTASS reserves the right to take action, including warnings, suspensions, or permanent bans.</p>

                  <h4>10. Updates to These Guidelines</h4>
                  <p>XTASS may update these Community Guidelines periodically to reflect policy changes or local regulations. Updated versions will be published on our website with a revised “Last Updated” date. We encourage users to review these guidelines regularly.</p>

                  <h4>11. Contact Us</h4>
                  <p>For questions, reports, or feedback related to these guidelines, please contact:</p>
                  <p><strong>XTASS Support Team</strong><br/>
                  Email: <a href="mailto:support@xtass.com">support@xtass.com</a><br/>
                  Phone: +233 XXX XXX XXX<br/>
                  Website: <a href="https://www.xtass.com" target="_blank" rel="noopener noreferrer">www.xtass.com</a></p>
                  
                  <h4>12. Effective Date</h4>
                  <p>These Community Guidelines are effective as of October 27, 2023 and apply to all XTASS users and service partners.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'data-protection' && (
        <main>
          {/* Hero for Data Protection Policy page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Data Protection Policy</h1>
              <p className="mt-4 text-lg text-white/90">Our commitment to safeguarding your data.</p>
            </div>
          </div>
          
          {/* Data Protection Policy Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>XTASS is committed to protecting your personal data and ensuring that your privacy is respected at all times. This Data Protection Policy outlines how XTASS (“we,” “our,” or “us”) collects, processes, stores, and secures the personal information of customers, drivers, employees, and partners in compliance with applicable data protection laws, including the Ghana Data Protection Act, 2012 (Act 843) and other relevant international standards.</p>
                  <p>By using XTASS services — whether through our website, mobile app, or customer channels — you consent to the data practices described in this policy.</p>

                  <h4>2. Purpose of Data Collection</h4>
                  <p>We collect and process personal data to:</p>
                  <ul>
                    <li>Deliver safe, efficient, and personalized transportation services.</li>
                    <li>Verify identities and ensure account security.</li>
                    <li>Enable ride bookings, payments, and communication between users.</li>
                    <li>Improve our platform functionality and customer experience.</li>
                    <li>Comply with legal obligations, law enforcement, or regulatory requirements.</li>
                    <li>Support analytics, research, and service optimization.</li>
                  </ul>

                  <h4>3. Types of Data We Collect</h4>
                  <p>XTASS may collect the following categories of information:</p>
                  <h5>a. Personal Identification Data</h5>
                  <ul>
                    <li>Name, phone number, email, and address.</li>
                    <li>Government-issued ID (e.g., driver’s license, national ID, or passport).</li>
                  </ul>
                  <h5>b. Account and Transaction Data</h5>
                  <ul>
                    <li>Payment details (processed securely via third-party gateways).</li>
                    <li>Trip history, ride preferences, and service feedback.</li>
                  </ul>
                  <h5>c. Device and Usage Data</h5>
                  <ul>
                    <li>IP address, device information, operating system, and app activity.</li>
                    <li>Location data (for pickup, drop-off, and navigation).</li>
                  </ul>
                  <h5>d. Communications Data</h5>
                  <ul>
                    <li>Messages or calls made through XTASS’s in-app chat or support system.</li>
                    <li>Customer service inquiries and feedback forms.</li>
                  </ul>

                  <h4>4. Legal Basis for Processing Data</h4>
                  <p>XTASS processes personal data under the following legal grounds:</p>
                  <ul>
                    <li><strong>Consent</strong> — when you voluntarily provide information or agree to data use.</li>
                    <li><strong>Contractual necessity</strong> — when processing is required to deliver XTASS services.</li>
                    <li><strong>Legal obligation</strong> — when required by law or government regulation.</li>
                    <li><strong>Legitimate interest</strong> — for business operations, analytics, and fraud prevention.</li>
                  </ul>

                  <h4>5. Data Sharing and Disclosure</h4>
                  <p>XTASS will never sell your personal data. However, we may share information only when necessary and secure:</p>
                  <ul>
                    <li>With drivers and riders for service delivery.</li>
                    <li>With payment processors to facilitate secure transactions.</li>
                    <li>With law enforcement or regulators when required by law.</li>
                    <li>With third-party service providers (e.g., cloud hosting, analytics) under strict confidentiality agreements.</li>
                  </ul>
                  <p>All partners and vendors must comply with XTASS’s data protection standards.</p>

                  <h4>6. Data Storage and Security</h4>
                  <p>XTASS implements industry-standard security measures to safeguard data from unauthorized access, loss, or misuse. These include:</p>
                  <ul>
                    <li>Encrypted storage and secure servers.</li>
                    <li>Access controls and authentication systems.</li>
                    <li>Regular audits, vulnerability testing, and employee training.</li>
                    <li>Limited data access based on user roles and business necessity.</li>
                  </ul>
                  <p>If a data breach occurs, XTASS will notify affected users and relevant authorities in accordance with applicable law.</p>

                  <h4>7. Data Retention</h4>
                  <p>XTASS retains personal data only for as long as necessary to fulfill service purposes or comply with legal obligations. When data is no longer required, it is securely deleted or anonymized.</p>
                  <p>Retention periods may vary depending on:</p>
                  <ul>
                    <li>Legal and financial record-keeping requirements.</li>
                    <li>Dispute resolution or fraud prevention needs.</li>
                    <li>Operational and contractual obligations.</li>
                  </ul>
                  
                  <h4>8. Your Rights</h4>
                  <p>As an XTASS user, you have the right to:</p>
                  <ul>
                    <li>Access your personal data.</li>
                    <li>Request correction of inaccurate or incomplete data.</li>
                    <li>Withdraw consent for data processing (where applicable).</li>
                    <li>Request deletion of your data when no longer necessary.</li>
                    <li>Restrict or object to certain processing activities.</li>
                    <li>Receive a copy of your data in a portable format.</li>
                  </ul>
                  <p>To exercise these rights, contact the XTASS Privacy Office at privacy@xtass.com.</p>
                  
                  <h4>9. International Data Transfers</h4>
                  <p>If XTASS transfers data outside Ghana, it ensures the receiving country or service provider maintains adequate data protection standards consistent with Ghana’s Data Protection Act and international privacy principles.</p>

                  <h4>10. Children’s Data</h4>
                  <p>XTASS does not knowingly collect personal data from individuals under 18 years old. If such data is discovered, it will be promptly deleted unless parental consent is verified.</p>
                  
                  <h4>11. Updates to This Policy</h4>
                  <p>XTASS may update this Data Protection Policy periodically to reflect changes in our technology, business operations, or legal requirements. All updates will be posted on our website with a revised “Last Updated” date. We encourage users to review this policy regularly to stay informed.</p>
                  
                  <h4>12. Contact Us</h4>
                  <p>For inquiries, requests, or complaints related to data protection, please contact:</p>
                  <p><strong>XTASS Privacy Office</strong><br/>
                  Email: <a href="mailto:privacy@xtass.com">privacy@xtass.com</a><br/>
                  Phone: +233 XXX XXX XXX<br/>
                  Website: <a href="https://www.xtass.com" target="_blank" rel="noopener noreferrer">www.xtass.com</a></p>

                  <h4>13. Effective Date</h4>
                  <p>This Data Protection Policy is effective as of October 27, 2023 and applies to all XTASS platforms, users, and partners.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'compliance' && (
        <main>
          {/* Hero for Compliance & Safety page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Compliance & Safety Policy</h1>
              <p className="mt-4 text-lg text-white/90">Our commitment to ensuring safety, trust, and compliance.</p>
            </div>
          </div>
          
          {/* Compliance & Safety Policy Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h4>1. Introduction</h4>
                  <p>This Compliance & Safety Policy explains XTASS’s commitment to ensuring safety, trust, and compliance across all operations. It defines the standards, processes, and responsibilities that guide our transport and shuttle services in full accordance with Ghanaian laws and international best practices.</p>
                  <p>XTASS prioritizes passenger and driver safety, data protection, and ethical conduct in every ride and interaction.</p>

                  <h4>2. Legal and Regulatory Compliance</h4>
                  <p>XTASS fully complies with applicable Ghanaian laws, including:</p>
                  <ul>
                      <li>Road Traffic Act, 2004 (Act 683)</li>
                      <li>Road Traffic Regulations, 2012 (L.I. 2180)</li>
                      <li>Data Protection Act, 2012 (Act 843)</li>
                      <li>Consumer and Public Safety Regulations</li>
                  </ul>
                  <p>All operations — from vehicle licensing to payment processing — are performed within legal and regulatory frameworks.</p>

                  <h4>3. Driver Compliance and Verification</h4>
                  <p>XTASS drivers must pass through strict onboarding and verification before activation. This includes:</p>
                  <ul>
                      <li>Valid driver’s license and ID verification</li>
                      <li>Vehicle inspection and insurance confirmation</li>
                      <li>Background and criminal record checks</li>
                      <li>Mandatory customer service and safety training</li>
                  </ul>
                  <p>Non-compliant drivers are suspended until review or removal.</p>

                  <h4>4. Vehicle Standards and Maintenance</h4>
                  <p>All vehicles on XTASS must:</p>
                  <ul>
                      <li>Pass roadworthiness and safety inspections</li>
                      <li>Be clean, insured, and fitted with functioning seatbelts</li>
                      <li>Have first-aid kits and emergency tools</li>
                      <li>Be regularly maintained and inspected</li>
                  </ul>
                  <p>Non-compliant vehicles are deactivated until issues are resolved.</p>

                  <h4>5. Passenger Safety</h4>
                  <p>Passenger safety is ensured through:</p>
                  <ul>
                      <li>GPS tracking of all rides</li>
                      <li>Verified driver identity and trip information</li>
                      <li>In-app emergency contact button</li>
                      <li>24/7 support for incident reporting</li>
                      <li>Full trip record and monitoring</li>
                  </ul>
                  <p>Passengers are advised to verify driver details before boarding.</p>

                  <h4>6. Data and Privacy Safety</h4>
                  <p>XTASS protects user data according to its Data Protection Policy. We apply encryption, access controls, and monitoring systems to prevent unauthorized data access, leaks, or misuse.</p>

                  <h4>7. Health and Hygiene Standards</h4>
                  <p>XTASS maintains hygiene standards for all vehicles and drivers:</p>
                  <ul>
                      <li>Clean vehicles and interiors</li>
                      <li>Respect for passenger comfort</li>
                      <li>Adherence to public health measures during outbreaks</li>
                  </ul>
                  <p>Passengers are expected to maintain mutual respect and cleanliness during rides.</p>

                  <h4>8. Emergency Response and Incident Management</h4>
                  <p>In any accident or emergency:</p>
                  <ul>
                      <li>Drivers must contact the XTASS Emergency Line or the nearest authority.</li>
                      <li>The XTASS Response Team assists with coordination and medical or legal support.</li>
                      <li>Incidents are logged, reviewed, and followed up for resolution and safety improvement.</li>
                  </ul>

                  <h4>9. Anti-Fraud and Misconduct</h4>
                  <p>XTASS enforces zero tolerance for fraud or misconduct, including:</p>
                  <ul>
                      <li>Fake profiles, trip manipulation, or unauthorized payments</li>
                      <li>Harassment, discrimination, or unsafe conduct</li>
                  </ul>
                  <p>Violations result in suspension or permanent removal, with possible legal action.</p>

                  <h4>10. Continuous Training and Monitoring</h4>
                  <p>Drivers and XTASS staff undergo continuous training on:</p>
                  <ul>
                      <li>Road and passenger safety</li>
                      <li>Data security</li>
                      <li>Emergency handling</li>
                      <li>Service quality</li>
                  </ul>
                  <p>Monitoring tools identify unsafe driving patterns for proactive intervention.</p>
                  
                  <h4>11. Reporting Safety Concerns</h4>
                  <p>Reports can be submitted to:</p>
                  <p><strong>XTASS Safety & Compliance Desk</strong><br/>
                  📧 Email: <a href="mailto:safety@xtass.com">safety@xtass.com</a><br/>
                  📞 Phone: +233 XXX XXX XXX<br/>
                  🌐 Website: <a href="#" onClick={(e) => e.preventDefault()}>www.xtass.com/safety</a></p>

                  <h4>12. Policy Updates</h4>
                  <p>XTASS may update this policy to reflect new laws, technologies, or internal standards. Updated versions will be published with a revised “Last Updated” date.</p>
                  
                  <h4>13. Effective Date</h4>
                  <p>This policy is effective as of October 27, 2023 and applies to all XTASS users, drivers, and employees.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'licensing' && (
        <main>
          {/* Hero for Licensing Information page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Licensing Information</h1>
              <p className="mt-4 text-lg text-white/90">Details about our operational authorizations and compliance.</p>
            </div>
          </div>
          
          {/* Licensing Information Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h2 className="text-3xl font-display font-bold text-gray-800 text-center">XTASS — Licensing Information</h2>

                  <h4>1. Introduction</h4>
                  <p>This Licensing Information page provides details about XTASS’s official authorization, certifications, and operational compliance under Ghanaian transport and technology regulations. XTASS operates with full legal recognition and licensing to provide airport and city shuttle services, ride bookings, and vehicle rentals across Ghana.</p>

                  <h4>2. Company Registration</h4>
                  <p>XTASS is a registered transport and technology service provider under the laws of the Republic of Ghana.</p>
                  <p><strong>Registered Company Name:</strong> XTASS</p>
                  <p><strong>Registration Type:</strong> Private Limited Liability Company</p>
                  <p><strong>Registrar of Companies:</strong> Registrar General’s Department, Accra, Ghana</p>
                  <p><strong>Company Registration Number:</strong> [Insert Number]</p>
                  <p><strong>Date of Incorporation:</strong> [Insert Date]</p>
                  <p><strong>Registered Office Address:</strong> [Insert Office Address]</p>

                  <h4>3. Business and Operational Licenses</h4>
                  <p>XTASS operates under the following licenses and permits:</p>
                  <ul>
                    <li>a. Transport Operations License — issued by the Driver and Vehicle Licensing Authority (DVLA).</li>
                    <li>b. Digital Platform Service Permit — issued under the Communications Service Regulatory Framework.</li>
                    <li>c. Airport Transport Authorization — in compliance with Ghana Civil Aviation Authority (GCAA) and Airport Operations Guidelines.</li>
                    <li>d. Business Operating Permit — issued by the Accra Metropolitan Assembly (AMA).</li>
                  </ul>
                  <p>All licenses are renewed periodically to maintain compliance with national and municipal standards.</p>

                  <h4>4. Driver Licensing and Verification</h4>
                  <p>Every XTASS driver must hold:</p>
                  <ul>
                    <li>A valid Ghanaian driver’s license for commercial passenger vehicles.</li>
                    <li>Proof of identity (National ID, Passport, or Voter’s ID).</li>
                    <li>Completed XTASS onboarding and verification checks.</li>
                  </ul>
                  <p>Driver profiles are reviewed regularly to ensure license validity and adherence to safety and compliance policies.</p>

                  <h4>5. Vehicle Licensing and Roadworthiness</h4>
                  <p>All vehicles used on the XTASS platform are:</p>
                  <ul>
                    <li>Registered and licensed by the DVLA.</li>
                    <li>Covered by comprehensive insurance policies.</li>
                    <li>Periodically inspected to ensure roadworthiness and safety compliance.</li>
                    <li>Maintained in line with Ghana’s Road Traffic Regulations (L.I. 2180).</li>
                  </ul>
                  <p>Vehicles that fail inspections or license renewal are deactivated from the XTASS platform until compliance is restored.</p>

                  <h4>6. Technology and Data Licensing</h4>
                  <p>XTASS digital systems and software are operated under:</p>
                  <ul>
                    <li>Valid software licenses and data protection compliance agreements.</li>
                    <li>Ghana’s Data Protection Act, 2012 (Act 843).</li>
                    <li>Applicable intellectual property laws ensuring the protection of proprietary software and databases.</li>
                  </ul>
                  <p>XTASS does not use unlicensed software or technology in its operations.</p>

                  <h4>7. Partnership and Affiliate Licensing</h4>
                  <p>XTASS partners with third-party service providers and affiliates who are:</p>
                  <ul>
                    <li>Legally registered and authorized under Ghanaian law.</li>
                    <li>Compliant with XTASS’s internal safety, data protection, and service standards.</li>
                    <li>Verified through formal agreements outlining licensing and regulatory adherence.</li>
                  </ul>

                  <h4>8. License Verification and Contact</h4>
                  <p>For verification or inquiries about XTASS licensing, please contact:</p>
                  <p><strong>XTASS Legal & Compliance Department</strong><br/>
                  📧 Email: <a href="mailto:compliance@xtass.com">compliance@xtass.com</a><br/>
                  📞 Phone: +233 XXX XXX XXX<br/>
                  🌐 Website: <a href="#" onClick={(e) => {e.preventDefault(); setView('compliance')}}>www.xtass.com/compliance</a><br/>
                  📍 Address: [Insert Registered Office Address]</p>
                  <p>Requests for documentation or verification will be processed within 7 working days of submission.</p>

                  <h4>9. Updates to Licensing Information</h4>
                  <p>XTASS reviews and updates this Licensing Information page whenever regulatory or operational changes occur. Updated versions will reflect the new “Last Updated” date at the bottom of this page.</p>

                  <h4>10. Effective Date</h4>
                  <p>This Licensing Information page is effective as of [Insert Date] and applies to all XTASS users, drivers, and partners.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'insurance' && (
        <main>
          {/* Hero for Insurance Coverage page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Insurance Coverage</h1>
              <p className="mt-4 text-lg text-white/90">Our commitment to the safety and security of every passenger and driver.</p>
            </div>
          </div>
          
          {/* Insurance Coverage Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h2 className="text-3xl font-display font-bold text-gray-800 text-center">XTASS — Insurance Coverage</h2>
                  
                  <h4>1. Introduction</h4>
                  <p>XTASS prioritizes the safety, security, and peace of mind of every passenger and driver. This Insurance Coverage Policy outlines the protection measures in place for rides, vehicles, and individuals who use XTASS services. It explains the types of insurance coverage provided, how claims are handled, and the responsibilities of both XTASS and its users.</p>

                  <h4>2. Purpose of Insurance</h4>
                  <p>Our insurance policy ensures that passengers, drivers, and vehicles are protected against accidents, injuries, and damages that may occur during XTASS rides, whether Instant, Scheduled, or Car Rental. It is part of XTASS’s commitment to operating a safe, trustworthy, and transparent transport service in Ghana and beyond.</p>

                  <h4>3. Scope of Coverage</h4>
                  <p>XTASS’s insurance covers three key areas:</p>
                  <h5>a. Passenger Insurance</h5>
                  <p>All passengers riding with XTASS are covered for:</p>
                  <ul>
                    <li>Accidental injury or loss of life during an XTASS trip.</li>
                    <li>Medical expenses resulting from a verified road incident.</li>
                    <li>Personal property loss due to verified vehicle-related incidents.</li>
                  </ul>
                  <h5>b. Driver Insurance</h5>
                  <p>All XTASS-approved drivers are protected by:</p>
                  <ul>
                    <li>Personal accident insurance during active trips.</li>
                    <li>Third-party liability coverage for injury or damage caused while on duty.</li>
                    <li>Loss of income coverage (where applicable) for extended recovery periods after verified accidents.</li>
                  </ul>
                  <h5>c. Vehicle Insurance</h5>
                  <p>All vehicles operating under XTASS are required to maintain:</p>
                  <ul>
                    <li>Comprehensive insurance that includes theft, fire, and damage.</li>
                    <li>Third-party liability insurance as mandated by the National Insurance Commission (NIC) of Ghana.</li>
                    <li>Coverage for passengers as part of the commercial transport requirement.</li>
                  </ul>
                  
                  <h4>4. Insurance Partners</h4>
                  <p>XTASS partners with certified and licensed insurance providers regulated by the National Insurance Commission (NIC). Our partners ensure all vehicles are adequately insured before activation on the XTASS platform. Only vehicles with valid insurance certificates are allowed to provide rides.</p>

                  <h4>5. Passenger Responsibilities</h4>
                  <p>To benefit from XTASS insurance coverage, passengers must:</p>
                  <ul>
                    <li>Book rides exclusively through the XTASS app or official channels.</li>
                    <li>Provide accurate personal information when booking.</li>
                    <li>Report incidents within 24 hours of occurrence using the in-app report feature or support email.</li>
                  </ul>
                  <p>Failure to comply with these requirements may affect eligibility for insurance compensation.</p>

                  <h4>6. Claim Process</h4>
                  <p>If an incident occurs during an XTASS trip:</p>
                  <ul>
                    <li>The driver and passenger should ensure immediate safety.</li>
                    <li>Contact emergency services (if needed).</li>
                    <li>Report the incident to XTASS Customer Support or via the app’s “Report an Incident” section.</li>
                    <li>XTASS will initiate a verification process and liaise with the insurance provider.</li>
                    <li>Approved claims will be processed by the insurer according to Ghana’s insurance regulations.</li>
                  </ul>
                  <p>Claims typically take 7–14 working days to process, depending on the case complexity.</p>

                  <h4>7. Exclusions and Limitations</h4>
                  <p>Insurance coverage does not apply in the following situations:</p>
                  <ul>
                    <li>Rides not booked or recorded through the XTASS app.</li>
                    <li>Incidents caused by deliberate negligence or unlawful behavior.</li>
                    <li>Losses unrelated to vehicle use (e.g., personal negligence).</li>
                    <li>Unverified or fraudulent claims.</li>
                  </ul>
                  
                  <h4>8. Proof of Insurance</h4>
                  <p>Each XTASS vehicle is required to upload and maintain a valid insurance certificate in the XTASS system. Passengers can request to view proof of insurance for their assigned vehicle via the XTASS app’s “Vehicle Info” section.</p>

                  <h4>9. Legal and Regulatory Compliance</h4>
                  <p>XTASS complies with all Ghanaian insurance regulations under the National Insurance Act, 2006 (Act 724). All insurance contracts are underwritten by insurers licensed by the National Insurance Commission (NIC).</p>

                  <h4>10. Contact Information</h4>
                  <p>For insurance-related questions or claims, please contact:</p>
                  <p><strong>XTASS Insurance & Claims Department</strong><br/>
                  📧 Email: <a href="mailto:insurance@xtass.com">insurance@xtass.com</a><br/>
                  📞 Phone: +233 XXX XXX XXX<br/>
                  🌐 Website: <a href="#" onClick={(e) => {e.preventDefault(); setView('insurance')}}>www.xtass.com/insurance</a><br/>
                  📍 Address: [Insert Office Address]</p>

                  <h4>11. Updates to This Policy</h4>
                  <p>XTASS may review and update this Insurance Coverage Policy periodically. Any changes will be reflected on this page with a revised “Last Updated” date.</p>

                  <h4>12. Effective Date</h4>
                  <p>This Insurance Coverage Policy is effective as of [Insert Date] and applies to all XTASS passengers, drivers, and vehicles.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}
      
      {view === 'report-issue' && (
        <main>
          {/* Hero for Report an Issue page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Report an Issue</h1>
              <p className="mt-4 text-lg text-white/90">Your feedback helps us improve. Let us know what happened.</p>
            </div>
          </div>
          
          {/* Report an Issue Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h2 className="text-3xl font-display font-bold text-gray-800 text-center">XTASS — Report an Issue</h2>
                  
                  <h4>1. Introduction</h4>
                  <p>At XTASS, we take customer feedback seriously. Your safety, comfort, and satisfaction are our top priorities. This page allows passengers and drivers to report any issue experienced during or after a ride so we can investigate and resolve it quickly.</p>
                  <p>You can report problems related to rides, payments, safety, drivers, vehicles, or the XTASS app.</p>
                  
                  <h4>2. Types of Issues You Can Report</h4>
                  <p>You can use this form or contact our support team for any of the following:</p>
                  <h5>a. Ride Issues</h5>
                  <ul>
                    <li>Driver didn’t arrive or cancelled unexpectedly.</li>
                    <li>Trip route changed without reason.</li>
                    <li>Vehicle didn’t match the one shown in the app.</li>
                    <li>Overcharging or incorrect fare.</li>
                  </ul>
                  <h5>b. Safety Concerns</h5>
                  <ul>
                    <li>Reckless driving or speeding.</li>
                    <li>Driver or passenger misconduct.</li>
                    <li>Suspicious activity during a trip.</li>
                    <li>Accident or emergency during a ride.</li>
                  </ul>
                  <h5>c. Payment Issues</h5>
                  <ul>
                    <li>Failed or duplicate payments.</li>
                    <li>Incorrect deductions.</li>
                    <li>Refund or cancellation problem.</li>
                    <li>Unrecognized transactions.</li>
                  </ul>
                  <h5>d. App or Booking Problems</h5>
                  <ul>
                    <li>App not loading or crashing.</li>
                    <li>Booking errors or location inaccuracy.</li>
                    <li>Difficulty logging in or updating profile.</li>
                  </ul>
                  <h5>e. Lost and Found</h5>
                  <ul>
                    <li>Forgotten or lost items in a vehicle.</li>
                    <li>Delay in returning lost property.</li>
                  </ul>
                  
                  <h4>3. How to Report an Issue</h4>
                  <p>You can report any issue through the following channels:</p>
                  <h5>a. In-App Reporting (Preferred Method)</h5>
                  <ul>
                    <li>Open the XTASS App.</li>
                    <li>Go to Menu → Help → Report an Issue.</li>
                    <li>Choose the trip and select the issue type.</li>
                    <li>Describe the problem clearly and attach evidence (e.g., screenshot, receipt, or photo).</li>
                    <li>Submit your report.</li>
                  </ul>
                  
                  <h5>b. Online Form (Website)</h5>
                  <p>You can also fill out the issue form directly below:</p>
                  
                  <div className="not-prose mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-2xl font-bold font-display text-gray-800 mb-6 text-center">Report an Issue Form</h3>
                      <form onSubmit={handleReportSubmit} className="space-y-6">
                          <div>
                              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                              <input type="text" name="fullName" id="fullName" value={reportIssueData.fullName} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                              <input type="email" name="email" id="email" value={reportIssueData.email} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                              <input type="tel" name="phone" id="phone" value={reportIssueData.phone} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="tripDate" className="block text-sm font-medium text-gray-700">Trip Date</label>
                              <input type="date" name="tripDate" id="tripDate" value={reportIssueData.tripDate} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="tripType" className="block text-sm font-medium text-gray-700">Trip Type</label>
                              <select name="tripType" id="tripType" value={reportIssueData.tripType} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                                  <option value="">Select Trip Type</option>
                                  <option>Instant Ride</option>
                                  <option>Scheduled Ride</option>
                                  <option>Car Rental</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">Issue Type</label>
                              <select name="issueType" id="issueType" value={reportIssueData.issueType} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                                  <option value="">Select Issue Type</option>
                                  <option>Ride Issue</option>
                                  <option>Payment</option>
                                  <option>Safety</option>
                                  <option>App</option>
                                  <option>Lost Item</option>
                                  <option>Other</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                              <textarea name="description" id="description" rows={5} value={reportIssueData.description} onChange={handleReportIssueChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Please provide as much detail as possible..." required></textarea>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Attach File or Screenshot (optional)</label>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="space-y-1 text-center">
                                      <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                      <div className="flex text-sm text-gray-600">
                                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                              <span>Upload a file</span>
                                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleReportFileChange} />
                                          </label>
                                          <p className="pl-1">or drag and drop</p>
                                      </div>
                                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                  </div>
                              </div>
                              {reportFile && <p className="mt-2 text-sm text-gray-500">Selected file: {reportFile.name}</p>}
                          </div>
                          <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 hover:bg-primary-hover transition-colors rounded-md shadow-sm">Send Report</button>
                      </form>
                  </div>

                  <h5>c. Contact Support (Alternative)</h5>
                  <p>If you prefer to speak with a representative, contact:<br/>
                  📧 support@xtass.com<br/>
                  📞 +233 XXX XXX XXX<br/>
                  📍 XTASS Head Office, Accra, Ghana</p>
                  <p>Support is available 24/7 for emergency or safety-related issues.</p>
                  
                  <h4>4. Response and Resolution Timeline</h4>
                  <p>After submitting your report:</p>
                  <ul>
                      <li>You’ll receive an acknowledgment email within 24 hours.</li>
                      <li>Our team will investigate and follow up within 3–5 business days.</li>
                      <li>Complex cases (like insurance or legal matters) may take longer, but you’ll be updated throughout the process.</li>
                  </ul>

                  <h4>5. Confidentiality and Data Protection</h4>
                  <p>All submitted reports are handled confidentially. Your information will only be used for resolving your issue in compliance with XTASS’s Privacy Policy and Data Protection Policy.</p>
                  
                  <h4>6. Urgent or Emergency Situations</h4>
                  <p>For emergencies (e.g., accidents, safety threats, or medical assistance):</p>
                  <ul>
                    <li>Immediately contact local emergency services (Dial 112).</li>
                    <li>Then, report the incident to XTASS through the app or by calling +233 XXX XXX XXX.</li>
                  </ul>
                  
                  <h4>7. Our Commitment</h4>
                  <p>XTASS is committed to building trust, safety, and accountability in every ride. Reporting issues helps us maintain high standards for all passengers and drivers. Every report is reviewed by our Quality Assurance & Safety Department to ensure continuous improvement.</p>
                  
                  <h4>8. Effective Date</h4>
                  <p>This “Report an Issue” policy is effective as of [Insert Date] and may be updated periodically. Please check this page for the latest version.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'lost-and-found' && (
        <main>
          {/* Hero for Lost & Found page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Lost & Found</h1>
              <p className="mt-4 text-lg text-white/90">Report a lost item to get help with recovery.</p>
            </div>
          </div>
          
          {/* Lost & Found Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h2 className="text-3xl font-display font-bold text-gray-800 text-center">XTASS — Lost & Found</h2>
                  
                  <h4>1. Introduction</h4>
                  <p>At XTASS, we understand that passengers may occasionally forget personal belongings in a vehicle after a ride. Our Lost & Found service is designed to help you recover your items quickly and securely.</p>
                  <p>If you’ve lost an item during a trip, please follow the steps outlined below to report it and track the recovery process.</p>

                  <h4>2. What You Can Report</h4>
                  <p>You can report any item that was left behind during a ride, including:</p>
                  <ul>
                    <li>Mobile phones, laptops, or tablets</li>
                    <li>Wallets, purses, or bags</li>
                    <li>Keys, jewelry, or watches</li>
                    <li>Documents or identification cards</li>
                    <li>Clothing or personal accessories</li>
                  </ul>
                  <p>If you’re unsure whether your item qualifies, please still submit a report — our team will assist you in determining next steps.</p>

                  <h4>3. How to Report a Lost Item</h4>
                  <h5>a. Using the XTASS App (Preferred Method)</h5>
                  <ul>
                    <li>Open the XTASS App.</li>
                    <li>Go to Menu → Help → Lost & Found.</li>
                    <li>Select the trip where you believe the item was lost.</li>
                    <li>Provide details of the lost item and upload any helpful photos (optional).</li>
                    <li>Submit the report and wait for confirmation.</li>
                  </ul>
                  
                  <h5>b. Through the Website</h5>
                  <p>Fill out the online Lost & Found Form below:</p>
                  
                  <div className="not-prose mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-2xl font-bold font-display text-gray-800 mb-6 text-center">Lost & Found Form</h3>
                      <form onSubmit={handleLostAndFoundSubmit} className="space-y-6">
                          <div>
                              <label htmlFor="lostFullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                              <input type="text" name="fullName" id="lostFullName" value={lostAndFoundData.fullName} onChange={handleLostAndFoundChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="lostEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                              <input type="email" name="email" id="lostEmail" value={lostAndFoundData.email} onChange={handleLostAndFoundChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="lostPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                              <input type="tel" name="phone" id="lostPhone" value={lostAndFoundData.phone} onChange={handleLostAndFoundChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="lostTripDate" className="block text-sm font-medium text-gray-700">Trip Date</label>
                              <input type="date" name="tripDate" id="lostTripDate" value={lostAndFoundData.tripDate} onChange={handleLostAndFoundChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
                          </div>
                          <div>
                              <label htmlFor="lostTripType" className="block text-sm font-medium text-gray-700">Trip Type</label>
                              <select name="tripType" id="lostTripType" value={lostAndFoundData.tripType} onChange={handleLostAndFoundChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                                  <option value="">Select Trip Type</option>
                                  <option>Instant Ride</option>
                                  <option>Scheduled Ride</option>
                                  <option>Car Rental</option>
                              </select>
                          </div>
                          <div>
                              <label htmlFor="lostDescription" className="block text-sm font-medium text-gray-700">Description of Lost Item</label>
                              <textarea name="description" id="lostDescription" rows={5} value={lostAndFoundData.description} onChange={handleLostAndFoundChange} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Please describe the item, including color, brand, or any unique features..." required></textarea>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Attach File or Photo (optional)</label>
                              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="space-y-1 text-center">
                                      <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                                      <div className="flex text-sm text-gray-600">
                                          <label htmlFor="lost-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                              <span>Upload a file</span>
                                              <input id="lost-file-upload" name="file-upload" type="file" className="sr-only" onChange={handleLostAndFoundFileChange} />
                                          </label>
                                          <p className="pl-1">or drag and drop</p>
                                      </div>
                                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                  </div>
                              </div>
                              {lostAndFoundFile && <p className="mt-2 text-sm text-gray-500">Selected file: {lostAndFoundFile.name}</p>}
                          </div>
                          <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 hover:bg-primary-hover transition-colors rounded-md shadow-sm">Report Lost Item</button>
                      </form>
                  </div>

                  <h4>4. What Happens After You Submit a Report</h4>
                  <p>Once your report is received:</p>
                  <ul>
                    <li>You’ll get an acknowledgment email confirming your submission.</li>
                    <li>Our support team will contact the driver who completed your ride.</li>
                    <li>If the item is found, we’ll coordinate a safe and convenient pickup or delivery.</li>
                    <li>If the item cannot be located within 7 working days, we’ll update you with a closure notification.</li>
                  </ul>

                  <h4>5. Found an Item?</h4>
                  <p>If you are a driver or passenger who has found an item, please:</p>
                  <ul>
                    <li>Report it immediately through the XTASS app → Help → Found Item.</li>
                    <li>Provide details and, if possible, attach a photo.</li>
                    <li>XTASS will contact the rightful owner and handle the return.</li>
                  </ul>
                  <p>Never hand over lost items directly to others without XTASS verification. This ensures safe and verified returns for all users.</p>

                  <h4>6. Fees (If Applicable)</h4>
                  <p>XTASS does not charge any fee for reporting or recovering lost items. However, if a delivery or courier is required to return an item, the cost will be communicated to the owner before shipment.</p>

                  <h4>7. Confidentiality and Data Protection</h4>
                  <p>Your personal data and item details are handled in accordance with XTASS’s Privacy Policy and Data Protection Policy. We will never share your information with third parties except as necessary to recover your lost property.</p>

                  <h4>8. Contact Our Support Team</h4>
                  <p>For urgent or follow-up inquiries:<br/>
                  📧 lostandfound@xtass.com<br/>
                  📞 +233 XXX XXX XXX<br/>
                  📍 XTASS Head Office, Accra, Ghana</p>
                  <p>Support Hours: Monday – Sunday (6:00 AM – 10:00 PM)</p>

                  <h4>9. Safety Reminder</h4>
                  <p>XTASS will never request payment or personal information beyond what is needed to verify ownership. Always confirm official communication is from @xtass.com before providing any details.</p>

                  <h4>10. Effective Date</h4>
                  <p>This Lost & Found Policy is effective as of [Insert Date] and will be updated periodically to improve service and security.</p>
              </div>
            </div>
          </section>

          {commonFooter}
        </main>
      )}

      {view === 'accessibility' && (
        <main>
          {/* Hero for Accessibility Services page */}
          <div className="relative bg-primary text-white">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30" 
              style={{backgroundImage: "url('https://i.ibb.co/svMbtFfn/XTASS-Hero-Banner-2.jpg')"}}>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold">Accessibility Services</h1>
              <p className="mt-4 text-lg text-white/90">Our commitment to providing equal access for all passengers.</p>
            </div>
          </div>
          
          {/* Accessibility Services Content */}
          <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose lg:prose-lg max-w-none text-gray-700 space-y-6">
                  <h2 className="text-3xl font-display font-bold text-gray-800 text-center">XTASS — Accessibility Services</h2>
                  
                  <h4>1. Introduction</h4>
                  <p>XTASS is committed to providing equal access and convenience for all passengers, regardless of ability or mobility level. Our goal is to make every aspect of our transportation service inclusive, comfortable, and safe for everyone. This Accessibility Services Policy outlines the measures we take to support passengers with disabilities or special needs.</p>

                  <h4>2. Our Accessibility Commitment</h4>
                  <p>XTASS ensures that all users can easily request, book, and enjoy rides through our platform. We continuously improve our app, website, and vehicles to meet accessibility standards and accommodate all passengers.</p>

                  <h4>3. Accessible Ride Options</h4>

                  <h5>a. Wheelchair-Accessible Vehicles (WAVs)</h5>
                  <ul>
                    <li>XTASS provides vehicles equipped with wheelchair ramps or lifts.</li>
                    <li>Passengers can request a WAV directly in the app by selecting the “Accessible Vehicle” option when booking a ride.</li>
                    <li>Our drivers are trained to assist passengers in entering and exiting vehicles safely.</li>
                  </ul>

                  <h5>b. Assistance for Passengers with Mobility Challenges</h5>
                  <ul>
                    <li>Drivers are instructed to offer reasonable assistance such as opening doors or helping with light luggage.</li>
                    <li>If you need extra support, please note it in the “Special Request” section of your booking form.</li>
                  </ul>
                  
                  <h5>c. Hearing and Speech Accessibility</h5>
                  <ul>
                    <li>XTASS supports communication through text chat within the app.</li>
                    <li>Real-time messaging ensures passengers who are deaf or hard of hearing can communicate with drivers effectively.</li>
                  </ul>

                  <h5>d. Visual Assistance</h5>
                  <ul>
                    <li>Drivers are trained to assist visually impaired passengers with boarding and identifying destinations.</li>
                    <li>Guide dogs and certified service animals are welcome on all XTASS rides.</li>
                  </ul>
                  
                  <h4>4. App and Website Accessibility</h4>
                  <p>XTASS digital platforms follow international accessibility guidelines (WCAG 2.1 standards) to ensure inclusivity:</p>
                  <ul>
                    <li>Screen reader support for blind and low-vision users.</li>
                    <li>High-contrast color themes for better visibility.</li>
                    <li>Resizable text to accommodate different viewing preferences.</li>
                    <li>Keyboard navigation for users who cannot use a mouse.</li>
                  </ul>
                  <p>If you encounter difficulties accessing any part of the XTASS website or app, you can contact our accessibility support team for immediate help.</p>

                  <h4>5. Assistance for Elderly Passengers</h4>
                  <p>XTASS prioritizes the comfort of elderly users:</p>
                  <ul>
                    <li>Drivers provide patient, courteous, and personalized support.</li>
                    <li>The app allows caregivers or family members to book rides on behalf of elderly passengers.</li>
                    <li>Riders can save preferred drivers for future trips for consistency and comfort.</li>
                  </ul>

                  <h4>6. Assistance Animals</h4>
                  <p>XTASS fully supports passengers traveling with service or guide animals.</p>
                  <ul>
                    <li>No extra fees apply.</li>
                    <li>Drivers are required by policy to accommodate service animals at all times.</li>
                    <li>Passengers are encouraged to inform the driver in advance for a smoother experience.</li>
                  </ul>

                  <h4>7. Requesting Accessibility Assistance</h4>
                  <p>Passengers who need accessibility accommodations can do so easily through the app:</p>
                  <ul>
                    <li>Select “Accessibility Options” during booking.</li>
                    <li>Choose your preferred accessibility type (e.g., wheelchair, hearing, visual).</li>
                    <li>Add special instructions for your driver, if necessary.</li>
                  </ul>
                  <p>Alternatively, you can contact our team directly at:<br/>
                  📧 Email: <a href="mailto:accessibility@xtass.com">accessibility@xtass.com</a><br/>
                  📞 Phone: +233 XXX XXX XXX</p>
                  <p>Our Accessibility Support Team is available 24/7 to provide immediate help or arrange special rides.</p>

                  <h4>8. Driver Training and Awareness</h4>
                  <p>All XTASS drivers receive specialized training on:</p>
                  <ul>
                    <li>Disability awareness and sensitivity.</li>
                    <li>Safe assistance techniques for passengers with special needs.</li>
                    <li>Proper handling of wheelchairs and other mobility devices.</li>
                  </ul>
                  <p>Drivers who fail to comply with accessibility standards may be subject to retraining or removal from the platform.</p>

                  <h4>9. Feedback and Improvements</h4>
                  <p>XTASS encourages all users to share feedback on accessibility experiences:<br/>
                  📧 Email: <a href="mailto:feedback@xtass.com">feedback@xtass.com</a></p>
                  <p>Your feedback helps us improve services, train drivers better, and expand accessibility options across more regions in Ghana and Africa.</p>

                  <h4>10. Commitment to Continuous Inclusion</h4>
                  <p>XTASS continually reviews and updates its Accessibility Services to ensure inclusivity, fairness, and comfort for all riders. We aim to be the most accessible transportation platform in Ghana and across Africa.</p>

                  <h4>11. Effective Date</h4>
                  <p>This Accessibility Services Policy is effective as of [Insert Date] and applies to all XTASS operations, including app, website, and in-vehicle services.</p>
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