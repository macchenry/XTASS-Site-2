import React, { useState } from 'react';
import type { Screen, NavigationProps } from '../types';
import { Button, Input, Header, BottomNav, FloatingActionButtons, ScreenContainer, Toast } from './shared/UI';
// FIX: Removed StarIcon from imports as it is not exported from ./Icons.tsx and was not used.
import { UserIcon, LockIcon, PhoneIcon, MapPinIcon, UsersIcon, BriefcaseIcon, CalendarIcon, CreditCardIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon } from './Icons';

interface CustomerAppProps extends NavigationProps {
  screen: Screen;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ screen, navigate, logout }) => {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [otpOrigin, setOtpOrigin] = useState<Screen>('Register');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };
    
  const renderScreen = () => {
    switch (screen) {
      case 'Login':
        return <AuthScreen navigate={navigate} isLogin />;
      case 'Register':
        return <AuthScreen 
            navigate={(nextScreen: Screen) => {
                if (nextScreen === 'OTPVerification') {
                    setOtpOrigin('Register');
                }
                navigate(nextScreen);
            }} 
            isLogin={false} 
        />;
      case 'ForgotPassword':
          return <ForgotPasswordScreen 
              navigate={(nextScreen: Screen) => {
                  if (nextScreen === 'OTPVerification') {
                      setOtpOrigin('ForgotPassword');
                  }
                  navigate(nextScreen);
              }} 
          />;
      case 'OTPVerification':
          return <OTPScreen navigate={navigate} onVerify={() => navigate('ServiceSelection')} onBack={() => navigate(otpOrigin)} />;
      case 'ServiceSelection':
          return <ServiceSelectionScreen navigate={navigate} />;
      case 'TripDetailsInput':
          return <TripDetailsInputScreen navigate={navigate} />;
      case 'ScheduleRide':
          return <ScheduleRideScreen navigate={navigate} />;
      case 'CompatibleShuttlesList':
          return <CompatibleShuttlesListScreen navigate={navigate} />;
      case 'ShuttleDriverDetails':
          return <ShuttleDriverDetailsScreen navigate={navigate} />;
      case 'BookingConfirmation':
          return <BookingConfirmationScreen navigate={navigate} />;
      case 'PaymentSelection':
          return <PaymentSelectionScreen navigate={navigate} />;
      case 'PaymentProcessing':
          return <PaymentProcessingScreen navigate={navigate} showToast={showToast} />;
      case 'TripTracking':
          return <TripTrackingScreen navigate={navigate} />;
      case 'TripCompletionReceipt':
          return <TripCompletionReceiptScreen navigate={navigate} />;
      case 'TripHistory':
          return <TripHistoryScreen navigate={navigate} />;
      case 'TripDetailsView':
          return <TripDetailsViewScreen navigate={navigate} />;
      case 'AccountProfile':
          return <AccountProfileScreen navigate={navigate} logout={logout} />;
      case 'SavedPassengers':
          return <SavedPassengersScreen navigate={navigate} />;
      case 'EmergencyContacts':
          return <EmergencyContactsScreen navigate={navigate} />;
      default:
        return <AuthScreen navigate={navigate} isLogin />;
    }
  };
  
  const showNav = ![
      'Login', 'Register', 'ForgotPassword', 'OTPVerification'
  ].includes(screen);

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {renderScreen()}
      {showNav && <BottomNav navigate={navigate} activeScreen={screen} />}
      {showNav && <FloatingActionButtons />}
    </div>
  );
};

// --- Screen Components ---

const AuthScreen: React.FC<{ navigate: (s: Screen) => void, isLogin: boolean }> = ({ navigate, isLogin }) => {
    const title = isLogin ? "Welcome Back" : "Create Account";
    const subTitle = isLogin ? "Sign in to your account" : "Let's get you started";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm text-center mb-8">
                 <h1 className="text-4xl font-display font-bold text-primary">XTASS</h1>
            </div>
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold font-display text-gray-900 text-center">{title}</h2>
                <p className="text-center text-gray-500 mb-6">{subTitle}</p>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate(isLogin ? 'ServiceSelection' : 'OTPVerification'); }}>
                    {!isLogin && <Input id="fullname" label="Full Name" type="text" placeholder="John Doe" icon={<UserIcon className="w-5 h-5 text-gray-400" />} />}
                    <Input id="phone" label="Phone Number" type="tel" placeholder="024 123 4567" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} />
                    <Input id="password" label="Password" type="password" placeholder="••••••••" icon={<LockIcon className="w-5 h-5 text-gray-400" />} />
                    {!isLogin && <Input id="confirm-password" label="Confirm Password" type="password" placeholder="••••••••" icon={<LockIcon className="w-5 h-5 text-gray-400" />} />}
                    <div className="pt-2">
                        <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
                    </div>
                </form>
                <div className="text-sm text-center mt-4">
                    {isLogin ? (
                        <>
                        <a href="#" onClick={(e) => {e.preventDefault(); navigate('ForgotPassword')}} className="font-medium text-primary hover:text-primary-hover">Forgot password?</a>
                        <p className="mt-2 text-gray-600">Don't have an account? <a href="#" onClick={(e) => {e.preventDefault(); navigate('Register')}} className="font-medium text-primary hover:text-primary-hover">Sign up</a></p>
                        </>
                    ) : (
                        <p className="text-gray-600">Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); navigate('Login')}} className="font-medium text-primary hover:text-primary-hover">Log in</a></p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ForgotPasswordScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold font-display text-gray-900">Forgot Password</h2>
            <p className="text-gray-500 mt-2 mb-6">Enter your phone number to receive a reset code.</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('OTPVerification'); }}>
                <Input id="phone-reset" label="Phone Number" type="tel" placeholder="024 123 4567" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} />
                <div className="pt-2">
                    <Button type="submit">Send Code</Button>
                </div>
            </form>
             <button onClick={() => navigate('Login')} className="mt-4 text-sm font-medium text-primary hover:text-primary-hover">Back to Login</button>
        </div>
    </div>
);

const OTPScreen: React.FC<{ navigate: (s: Screen) => void, onVerify: () => void, onBack: () => void }> = ({ onVerify, onBack }) => (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold font-display text-gray-900">OTP Verification</h2>
            <p className="text-gray-500 mt-2 mb-6">Enter the 6-digit code sent to your phone.</p>
            <div className="flex justify-center space-x-2 mb-6">
                {[...Array(6)].map((_, i) => (
                    <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
                ))}
            </div>
            <Button onClick={onVerify}>Verify Account</Button>
            <div className="mt-4 flex justify-between items-center text-sm">
                <button onClick={onBack} className="font-medium text-primary hover:text-primary-hover">Back</button>
                <p className="text-gray-600">Didn't receive code? <a href="#" className="font-medium text-primary hover:text-primary-hover">Resend</a></p>
            </div>
        </div>
    </div>
);

const ServiceSelectionScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Book a Ride" />
        <div className="p-4 space-y-4">
            <div onClick={() => navigate('TripDetailsInput')} className="bg-primary text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-primary-hover transition-colors">
                <h3 className="text-2xl font-display font-bold">Instant Ride</h3>
                <p className="mt-1">Book the next available shuttle.</p>
            </div>
            <div onClick={() => navigate('ScheduleRide')} className="bg-gray-200 text-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300 transition-colors">
                 <h3 className="text-2xl font-display font-bold">Schedule Ride</h3>
                <p className="mt-1">Plan your trip in advance.</p>
            </div>
        </div>
    </ScreenContainer>
);

const TripDetailsInputScreen: React.FC<NavigationProps> = ({ navigate }) => (
     <ScreenContainer>
        <Header title="Trip Details" onBack={() => navigate('ServiceSelection')} />
        <div className="p-4 space-y-4">
            <Input id="pickup" label="Pickup Location" type="text" placeholder="Kotoka International Airport" defaultValue="Kotoka Int'l Airport, Terminal 3" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="destination" label="Destination" type="text" placeholder="Enter your destination" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="passengers" label="Passengers" type="number" placeholder="1" icon={<UsersIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="luggage" label="Luggage" type="number" placeholder="2" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} />
            <div className="pt-4">
                <Button onClick={() => navigate('CompatibleShuttlesList')}>Find Shuttles</Button>
            </div>
        </div>
     </ScreenContainer>
);

const ScheduleRideScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Schedule Ride" onBack={() => navigate('ServiceSelection')} />
        <div className="p-4 space-y-4">
            <Input id="date" label="Date" type="date" icon={<CalendarIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="time" label="Time" type="time" icon={<CalendarIcon className="w-5 h-5 text-gray-400" />} />
             <div className="pt-4">
                <Button onClick={() => navigate('TripDetailsInput')}>Next</Button>
            </div>
        </div>
    </ScreenContainer>
);

const CompatibleShuttlesListScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Available Shuttles" onBack={() => navigate('TripDetailsInput')} />
        <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
                <div key={i} onClick={() => navigate('ShuttleDriverDetails')} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow">
                    <img src={`https://picsum.photos/seed/${i}/80/80`} alt="shuttle" className="w-20 h-20 rounded-md object-cover" />
                    <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">Toyota Hiace</h4>
                        <p className="text-gray-600">Driver: Kofi Mensah</p>
                        <p className="text-sm text-gray-500">5 mins away</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-primary">$10.00</p>
                        <div className="flex items-center text-yellow-500">
                           <UserIcon className="w-4 h-4 mr-1" /> 4.8
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </ScreenContainer>
);

const ShuttleDriverDetailsScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Shuttle Details" onBack={() => navigate('CompatibleShuttlesList')} />
        <div className="p-4">
            <img src="https://picsum.photos/seed/1/400/200" alt="shuttle" className="w-full h-48 rounded-lg object-cover mb-4" />
            <h3 className="text-2xl font-bold font-display">Toyota Hiace - GT-1234-20</h3>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-lg mb-2">Driver: Kofi Mensah</h4>
                <div className="flex items-center text-gray-600">
                    <UserIcon className="w-5 h-5 mr-2 text-primary" />
                    <span>4.8 Rating</span>
                </div>
                 <p className="text-sm text-gray-500 mt-1">500+ trips completed</p>
            </div>
            <div className="mt-6">
                <Button onClick={() => navigate('BookingConfirmation')}>Book This Shuttle</Button>
            </div>
        </div>
    </ScreenContainer>
);


const BookingConfirmationScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Confirm Booking" onBack={() => navigate('ShuttleDriverDetails')} />
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-md border p-4">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Trip Summary</h3>
                <div className="space-y-2 text-gray-700">
                    <p><strong>From:</strong> Kotoka Int'l Airport, T3</p>
                    <p><strong>To:</strong> Accra Mall</p>
                    <p><strong>Passengers:</strong> 2</p>
                    <p><strong>Luggage:</strong> 3</p>
                    <p><strong>Vehicle:</strong> Toyota Hiace (GT-1234-20)</p>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Cost:</span>
                    <span className="text-2xl font-bold text-primary">$10.00</span>
                </div>
            </div>
             <div className="mt-4 flex items-start space-x-2">
                <input type="checkbox" id="terms" className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                <label htmlFor="terms" className="text-sm text-gray-600">I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Refund Policy</a>.</label>
            </div>
            <div className="mt-6">
                <Button onClick={() => navigate('PaymentSelection')}>Proceed to Payment</Button>
            </div>
        </div>
    </ScreenContainer>
);

const PaymentSelectionScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Select Payment" onBack={() => navigate('BookingConfirmation')} />
        <div className="p-4 space-y-4">
            <div onClick={() => navigate('PaymentProcessing')} className="p-4 border rounded-lg flex items-center justify-between cursor-pointer hover:border-primary">
                <span className="font-semibold">Mobile Money</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/MTN_Mobile_Money.svg/1200px-MTN_Mobile_Money.svg.png" alt="momo" className="h-8"/>
            </div>
            <div onClick={() => navigate('PaymentProcessing')} className="p-4 border rounded-lg flex items-center justify-between cursor-pointer hover:border-primary">
                <span className="font-semibold">Credit/Debit Card</span>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png" alt="visa" className="h-5"/>
            </div>
        </div>
    </ScreenContainer>
);

const PaymentProcessingScreen: React.FC<NavigationProps & { showToast: (msg: string, type?: 'success' | 'error') => void }> = ({ navigate, showToast }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            showToast("Payment Successful!");
            navigate('TripTracking');
        }, 3000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ScreenContainer>
            <Header title="Processing Payment" />
            <div className="flex flex-col items-center justify-center h-full p-4 mt-20">
                <div className="w-16 h-16 border-4 border-t-primary border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700">Securely processing your payment...</p>
                <p className="text-sm text-gray-500">Please do not close this window.</p>
            </div>
        </ScreenContainer>
    );
};

const TripTrackingScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Trip in Progress" onBack={() => navigate('ServiceSelection')} />
        <div className="relative h-[calc(100vh-120px)]">
             <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500 font-semibold">Map Placeholder</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <p className="text-center font-semibold text-lg mb-2">Driver is arriving in 5 minutes</p>
                    <div className="flex items-center space-x-4">
                        <img src="https://picsum.photos/seed/driver/64/64" alt="driver" className="w-16 h-16 rounded-full" />
                        <div>
                            <p className="font-bold">Kofi Mensah</p>
                            <p className="text-gray-600">Toyota Hiace - GT-1234-20</p>
                        </div>
                        <div className="flex-grow text-right">
                           <a href="tel:0241234567" className="bg-primary text-white p-3 rounded-full shadow-md"><PhoneIcon /></a>
                        </div>
                    </div>
                     <Button onClick={() => navigate('TripCompletionReceipt')} className="mt-4">Simulate Trip End</Button>
                </div>
            </div>
        </div>
    </ScreenContainer>
);

const TripCompletionReceiptScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Trip Completed" onBack={() => navigate('ServiceSelection')} />
        <div className="p-4 text-center">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold font-display">Thank You!</h2>
            <p className="text-lg text-gray-600">Your trip to Accra Mall is complete.</p>
            <div className="bg-gray-50 p-4 rounded-lg my-6 text-left">
                <h3 className="font-bold text-lg mb-2">Receipt</h3>
                <div className="flex justify-between"><span>Base Fare</span><span>$10.00</span></div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total Paid</span><span>$10.00</span></div>
            </div>
            <div className="my-6">
                <h3 className="font-bold text-lg mb-2">Rate Your Driver</h3>
                <div className="flex justify-center text-4xl text-gray-300 space-x-2">
                    {[...Array(5)].map((_, i) => <button key={i} className="hover:text-yellow-400">★</button>)}
                </div>
            </div>
            <Button onClick={() => navigate('ServiceSelection')}>Back to Home</Button>
        </div>
    </ScreenContainer>
);

const TripHistoryScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Trip History" />
        <div className="p-4 space-y-3">
             {[
                { status: 'Completed', color: 'green-500', icon: <CheckCircleIcon/> }, 
                { status: 'Completed', color: 'green-500', icon: <CheckCircleIcon/> }, 
                { status: 'Cancelled', color: 'red-500', icon: <XCircleIcon/> }
            ].map((trip, i) => (
                <div key={i} onClick={() => navigate('TripDetailsView')} className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center cursor-pointer hover:shadow-lg">
                    <div>
                        <p className="font-bold">Accra Mall</p>
                        <p className="text-sm text-gray-500">Oct 26, 2023</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-primary">$10.00</p>
                        <p className={`text-sm font-semibold text-${trip.color} flex items-center justify-end`}>{React.cloneElement(trip.icon, { className: 'w-4 h-4 mr-1' })} {trip.status}</p>
                    </div>
                </div>
            ))}
        </div>
    </ScreenContainer>
);

const TripDetailsViewScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Trip Details" onBack={() => navigate('TripHistory')} />
        <div className="p-4">
            <div className="bg-gray-300 h-40 rounded-lg mb-4 flex items-center justify-center font-semibold text-gray-500">Map Route Placeholder</div>
             <div className="bg-white rounded-lg shadow-md border p-4">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Trip Summary</h3>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Date:</strong> Oct 26, 2023</p>
                    <p><strong>From:</strong> Kotoka Int'l Airport, T3</p>
                    <p><strong>To:</strong> Accra Mall</p>
                    <p><strong>Driver:</strong> Kofi Mensah</p>
                    <p><strong>Vehicle:</strong> Toyota Hiace</p>
                    <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Completed</span></p>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Paid:</span>
                    <span className="text-2xl font-bold text-primary">$10.00</span>
                </div>
            </div>
             <div className="mt-4">
                <Button variant="secondary">Download Receipt</Button>
            </div>
        </div>
    </ScreenContainer>
);


const AccountProfileScreen: React.FC<NavigationProps> = ({ navigate, logout }) => (
    <ScreenContainer>
        <Header title="My Profile" />
        <div className="p-4">
             <div className="flex flex-col items-center mb-6">
                <img src="https://picsum.photos/seed/user/100/100" alt="profile" className="w-24 h-24 rounded-full mb-2" />
                <h2 className="text-xl font-bold">Ama Serwaa</h2>
                <p className="text-gray-500">+233 24 123 4567</p>
            </div>
            <div className="space-y-2">
                <button onClick={() => navigate('SavedPassengers')} className="w-full text-left bg-gray-100 p-4 rounded-lg flex justify-between items-center hover:bg-gray-200"><span>Saved Passengers</span> <ArrowRightIcon className="w-5 h-5" /></button>
                <button onClick={() => navigate('EmergencyContacts')} className="w-full text-left bg-gray-100 p-4 rounded-lg flex justify-between items-center hover:bg-gray-200"><span>Emergency Contacts</span> <ArrowRightIcon className="w-5 h-5" /></button>
                <button className="w-full text-left bg-gray-100 p-4 rounded-lg flex justify-between items-center hover:bg-gray-200"><span>Settings</span> <ArrowRightIcon className="w-5 h-5" /></button>
            </div>
             <div className="mt-8">
                <Button variant="secondary" onClick={logout}>Logout</Button>
            </div>
        </div>
    </ScreenContainer>
);

const SavedPassengersScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Saved Passengers" onBack={() => navigate('AccountProfile')} />
        <div className="p-4">
            <Button>Add New Passenger</Button>
            <div className="mt-4 space-y-2">
                <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Yaw Asare (Brother)</p>
                        <p className="text-sm text-gray-500">+233 55 987 6543</p>
                    </div>
                    <button className="text-primary">Edit</button>
                </div>
            </div>
        </div>
    </ScreenContainer>
);

const EmergencyContactsScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Emergency Contacts" onBack={() => navigate('AccountProfile')} />
        <div className="p-4">
            <Button>Add Emergency Contact</Button>
            <div className="mt-4 space-y-2">
                <div className="bg-red-50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold">Emergency Services</p>
                        <p className="text-sm text-gray-500">911</p>
                    </div>
                     <button className="text-red-500">Test</button>
                </div>
            </div>
        </div>
    </ScreenContainer>
);