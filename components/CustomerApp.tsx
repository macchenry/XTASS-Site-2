import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Screen, NavigationProps } from '../types';
import { Button, Input, Header, BottomNav, FloatingActionButtons, ScreenContainer, Toast, Modal } from './shared/UI';
import { UserIcon, LockIcon, PhoneIcon, MapPinIcon, UsersIcon, BriefcaseIcon, CalendarIcon, CreditCardIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon, ChevronLeftIcon, EyeIcon, EyeOffIcon, MailIcon, CameraIcon, ChevronDownIcon, ShieldIcon, GoogleIcon, UploadCloudIcon, CarIcon, BabyIcon, BusIcon, SnowflakeIcon } from './Icons';

interface CustomerAppProps extends NavigationProps {
  screen: Screen;
}

// Define the Car type for better type safety
interface Car {
  class: string;
  driver: string;
  price: number;
  seed: string;
  description: string;
}

// Define Vehicle Class Info type
interface VehicleClassInfo {
    name: string;
    baseRate: number;
}

function usePrevious(value: Screen): Screen | undefined {
    // FIX: The `useRef` hook requires an initial value. It is initialized here with `undefined`.
    const ref = useRef<Screen | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ screen, navigate, logout }) => {
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [otpOrigin, setOtpOrigin] = useState<Screen>('Register');
  const [phoneForOTP, setPhoneForOTP] = useState({ phone: '241234567', code: '+233' });
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedVehicleClassInfo, setSelectedVehicleClassInfo] = useState<VehicleClassInfo | null>(null);
  const [rentalDuration, setRentalDuration] = useState(0);
  const [currentFlow, setCurrentFlow] = useState<'shuttle' | 'rental' | null>(null);
  const previousScreen = usePrevious(screen);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };
    
  const renderScreen = () => {
    switch (screen) {
      case 'Login':
        return <AuthScreen navigate={navigate} isLogin logout={logout} />;
      case 'Register':
        return <AuthScreen 
            navigate={(nextScreen: Screen) => {
                if (nextScreen === 'OTPVerification') {
                    setOtpOrigin('Register');
                }
                navigate(nextScreen);
            }} 
            isLogin={false} 
            logout={logout}
        />;
      case 'ForgotPassword':
          return <ForgotPasswordScreen 
              navigate={(nextScreen: Screen) => {
                  if (nextScreen === 'OTPVerification') {
                      setOtpOrigin('ForgotPassword');
                  }
                  navigate(nextScreen);
              }}
              setPhoneForOTP={setPhoneForOTP}
          />;
      case 'OTPVerification':
          return <OTPScreen 
            navigate={navigate} 
            onBack={() => navigate(otpOrigin)} 
            showToast={(msg) => showToast(msg)}
            phoneDetails={phoneForOTP}
          />;
      case 'LivePhotoLogin':
          return <LivePhotoLoginScreen navigate={navigate} />;
      case 'PostLoginVerification':
          return <PostLoginVerificationScreen navigate={navigate} logout={logout} />;
      case 'ServiceSelection':
          return <ServiceSelectionScreen navigate={navigate} logout={logout} setFlow={setCurrentFlow} />;
      case 'TripDetailsInput':
          return <TripDetailsInputScreen navigate={navigate} />;
      case 'ScheduleRide':
          return <ScheduleRideScreen navigate={navigate} />;
      case 'CarRental':
          return <CarRentalScreen navigate={navigate} setVehicleTypeForFilter={setSelectedVehicleClassInfo} setRentalDuration={setRentalDuration} />;
      case 'AvailableCarsForRent':
          return <AvailableCarsForRentScreen navigate={navigate} onBack={() => navigate('CarRental')} onCarSelect={setSelectedCar} selectedClassInfo={selectedVehicleClassInfo} />;
      case 'CarRentDetails':
          return <CarRentDetailsScreen navigate={navigate} car={selectedCar} onBack={() => navigate('AvailableCarsForRent')} rentalDuration={rentalDuration} />;
      case 'CompatibleShuttlesList':
          const backTarget = previousScreen === 'ScheduleRide' ? 'ScheduleRide' : 'TripDetailsInput';
          return <CompatibleShuttlesListScreen navigate={navigate} onBack={() => navigate(backTarget)} />;
      case 'ShuttleDriverDetails':
          return <ShuttleDriverDetailsScreen navigate={navigate} />;
      case 'BookingConfirmation':
          return <BookingConfirmationScreen navigate={navigate} />;
      case 'PaymentSelection':
          const paymentBackTarget = currentFlow === 'rental' ? 'CarRentDetails' : 'BookingConfirmation';
          return <PaymentSelectionScreen navigate={navigate} onBack={() => navigate(paymentBackTarget)} />;
      case 'PaymentProcessing':
          return <PaymentProcessingScreen navigate={navigate} showToast={showToast} flow={currentFlow} />;
      case 'TripTracking':
          return <TripTrackingScreen navigate={navigate} />;
      case 'TripCompletionReceipt':
          return <TripCompletionReceiptScreen navigate={navigate} flow={currentFlow} car={selectedCar} duration={rentalDuration} />;
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
        return <AuthScreen navigate={navigate} isLogin logout={logout} />;
    }
  };
  
  const showNav = ![
      'Login', 'Register', 'ForgotPassword', 'OTPVerification', 'LivePhotoLogin', 'PostLoginVerification'
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

const PasswordInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    showStrength?: boolean;
    getStrengthColor?: () => string;
    passwordStrength?: number;
}> = ({ id, label, value, onChange, placeholder="••••••••", showStrength, getStrengthColor, passwordStrength }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>
            {showStrength && getStrengthColor && passwordStrength !== undefined && (
                 <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded">
                        <div className={`h-2 rounded transition-all duration-300 ${getStrengthColor()}`} style={{width: `${passwordStrength * 20}%`}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password strength indicator</p>
                </div>
            )}
        </div>
    );
};

const countryCodes = [
    { code: '+233', name: 'GH' },
    { code: '+234', name: 'NG' },
    { code: '+1', name: 'US' },
    { code: '+44', name: 'UK' },
];

const AuthScreen: React.FC<{ navigate: (s: Screen) => void, isLogin: boolean, logout?: () => void }> = ({ navigate, isLogin, logout }) => {
    const title = isLogin ? "Welcome to XTASS" : "Create Account";
    const subTitle = isLogin ? "Sign in to your account" : "Let's get you started";
    
    // State for multi-step registration
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        countryCode: '+233',
        phone: '241234567',
        email: 'customer@xtass.com',
        password: '',
        confirmPassword: '',
        agreedToTerms: false,
    });
    const [errors, setErrors] = useState({ email: '', passwordMatch: '' });
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // State for live photo capture
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateEmail = (email: string) => {
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email format.' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    };

    useEffect(() => {
        if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, passwordMatch: 'Passwords do not match.' }));
        } else {
            setErrors(prev => ({ ...prev, passwordMatch: '' }));
        }
    }, [formData.password, formData.confirmPassword]);
    
    const checkPasswordStrength = useCallback((pass: string) => {
        let score = 0;
        if (pass.length > 8) score++;
        if (pass.match(/[a-z]/)) score++;
        if (pass.match(/[A-Z]/)) score++;
        if (pass.match(/[0-9]/)) score++;
        if (pass.match(/[^a-zA-Z0-9]/)) score++;
        setPasswordStrength(score);
        handleInputChange('password', pass);
    }, []);

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 0: case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-blue-500';
            case 5: return 'bg-green-500';
            default: return 'bg-gray-200';
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    // Camera setup for registration step
    useEffect(() => {
        let stream: MediaStream | null = null;
        
        async function setupCamera() {
            if (step === 4 && !capturedImage) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera: ", err);
                    alert("Camera access is required for this step. Please grant permission and try again.");
                    setStep(3); // Go back to previous step
                }
            }
        }

        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [step, capturedImage]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                setCapturedImage(dataUrl);
                setIsVerifying(true);
                // Simulate verification
                setTimeout(() => {
                    setIsVerifying(false);
                }, 1500);

                // Stop camera stream
                if (video.srcObject) {
                    (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                }
            }
        }
    };
    
    const retakePhoto = () => {
        setCapturedImage(null);
        setIsVerifying(false);
    };


    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms & Conditions">
                <div className="space-y-4 text-sm text-gray-600">
                    <p>Welcome to XTASS. These terms and conditions outline the rules and regulations for the use of our services.</p>
                    <p>By accessing this app we assume you accept these terms and conditions. Do not continue to use XTASS if you do not agree to take all of the terms and conditions stated on this page.</p>
                    <h4 className="font-semibold text-gray-800">1. Bookings</h4>
                    <p>All bookings are subject to vehicle availability. We reserve the right to decline any booking at our discretion.</p>
                    <h4 className="font-semibold text-gray-800">2. Payments</h4>
                    <p>Payments must be made in full at the time of booking through our available payment gateways. All payments are processed securely.</p>
                    <h4 className="font-semibold text-gray-800">3. Cancellations and Refunds</h4>
                    <p>Cancellations made 24 hours before the scheduled trip are eligible for a full refund. Cancellations made less than 24 hours may incur a fee.</p>
                </div>
            </Modal>
            
            <button onClick={() => navigate('Login')} className="absolute top-4 left-4 text-primary p-2 rounded-full hover:bg-gray-200 z-10" aria-label="Go back">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg mt-12">
                <h2 className="text-2xl font-bold font-display text-gray-900 text-center">{title}</h2>
                <p className="text-center text-gray-500 mb-6">{subTitle}</p>
                
                {isLogin ? (
                    <>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('PostLoginVerification'); }}>
                            <Input id="email-phone" label="Email or Phone Number" type="text" placeholder="customer@xtass.com" icon={<MailIcon className="w-5 h-5 text-gray-400" />} defaultValue="customer@xtass.com" />
                            <PasswordInput id="password-login" label="Password" value="password123" onChange={() => {}} />
                            <div className="pt-2">
                                <Button type="submit">Login</Button>
                            </div>
                        </form>
                        <div className="flex items-center justify-center my-4">
                            <div className="border-t border-gray-300 flex-grow"></div>
                            <span className="px-4 text-gray-500 text-sm">OR</span>
                            <div className="border-t border-gray-300 flex-grow"></div>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => navigate('PostLoginVerification')} className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <GoogleIcon className="w-5 h-5"/>
                                <span>Login with Gmail</span>
                            </button>
                            <button onClick={() => navigate('LivePhotoLogin')} className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <CameraIcon className="w-5 h-5 text-primary"/>
                                <span>Login with Live Photo Capture</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            {[1, 2, 3, 4, 5].map(num => (
                                <React.Fragment key={num}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {num}
                                    </div>
                                    {num < 5 && <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${step > num ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        
                        {step === 1 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">Enter your phone number</h3>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-1 h-full bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3">
                                            <span>{formData.countryCode}</span>
                                            <ChevronDownIcon className="w-4 h-4 text-gray-600"/>
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute bottom-full mb-1 w-24 bg-white border rounded-md shadow-lg z-10">
                                                {countryCodes.map(c => (
                                                    <div key={c.code} onClick={() => { handleInputChange('countryCode', c.code); setIsDropdownOpen(false); }} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">{c.name} ({c.code})</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="block w-full px-4 py-3 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">Enter your email (optional)</h3>
                                <Input id="email" label="Email" type="email" placeholder="you@example.com" value={formData.email} onChange={e => { handleInputChange('email', e.target.value); validateEmail(e.target.value); }} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        )}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-2 text-center">Create your password</h3>
                                <PasswordInput id="password" label="Password" value={formData.password} onChange={e => checkPasswordStrength(e.target.value)} showStrength getStrengthColor={getStrengthColor} passwordStrength={passwordStrength}/>
                                <PasswordInput id="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} />
                                {errors.passwordMatch && <p className="text-red-500 text-xs mt-1">{errors.passwordMatch}</p>}
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">Live Photo Verification</h3>
                                <p className="text-center text-sm text-gray-500 mb-4">Position your face in the frame.</p>
                                <div className="w-full aspect-square bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${capturedImage ? 'hidden' : ''}`}></video>
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                    {capturedImage && <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />}
                                    
                                    {isVerifying && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-t-white border-gray-500 rounded-full animate-spin"></div>
                                            <p className="text-white font-semibold mt-2">Verifying...</p>
                                        </div>
                                    )}
                                    {!isVerifying && capturedImage && (
                                         <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                                            <CheckCircleIcon className="w-16 h-16 text-white mb-2" />
                                            <p className="text-white font-semibold">Photo Verified!</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    {!capturedImage ? (
                                        <Button type="button" onClick={handleCapture}>Capture Photo</Button>
                                    ) : (
                                        <Button type="button" variant="secondary" onClick={retakePhoto}>Retake Photo</Button>
                                    )}
                                </div>
                            </div>
                        )}
                        {step === 5 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-center">Agree to our terms</h3>
                                <div className="flex items-start p-3 bg-gray-50 rounded-md">
                                    <input type="checkbox" id="terms" checked={formData.agreedToTerms} onChange={e => handleInputChange('agreedToTerms', e.target.checked)} className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded mt-0.5" />
                                    <label htmlFor="terms" className="ml-3 text-sm text-gray-600">I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="font-medium text-primary hover:underline">Terms and Conditions</button>.</label>
                                </div>
                            </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                            {step > 1 && <Button type="button" variant="secondary" onClick={prevStep}>Back</Button>}
                            {step < 5 && <Button type="button" onClick={nextStep} disabled={(step === 3 && (!!errors.passwordMatch || !formData.password)) || (step === 4 && (!capturedImage || isVerifying))}>Next</Button>}
                            {step === 5 && <Button type="button" onClick={() => navigate('OTPVerification')} disabled={!formData.agreedToTerms} className="disabled:bg-gray-400 disabled:cursor-not-allowed hover:animate-pulse">Create Account</Button>}
                        </div>
                         {step === 2 && <button onClick={nextStep} className="w-full text-center text-primary font-medium mt-2 text-sm hover:underline">Skip for now</button>}
                    </div>
                )}

                <div className="text-sm text-center mt-4">
                    {isLogin ? (
                        <>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('ForgotPassword'); }} className="font-medium text-primary hover:text-primary-hover">Forgot password?</a>
                            <p className="mt-2 text-gray-600">Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('Register'); }} className="font-medium text-primary hover:text-primary-hover">Register</a></p>
                        </>
                    ) : (
                        <p className="text-gray-600">Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); navigate('Login')}} className="font-medium text-primary hover:text-primary-hover">Log in</a></p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-4 right-4 flex space-x-3">
                 <a href="https://wa.me/233000000000" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l-.219.324-1.123 4.144 4.224-1.105.327-.224z"/></svg>
                </a>
                <a href="tel:911" className="bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700">
                    <PhoneIcon className="w-7 h-7" />
                </a>
            </div>
        </div>
    );
};

const ForgotPasswordScreen: React.FC<NavigationProps & { setPhoneForOTP: (details: {phone: string, code: string}) => void }> = ({ navigate, setPhoneForOTP }) => {
    const [countryCode, setCountryCode] = useState('+233');
    const [phone, setPhone] = useState('241234567');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <button onClick={() => navigate('Login')} className="absolute top-4 left-4 text-primary p-2 rounded-full hover:bg-gray-200 z-10" aria-label="Back to Login">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-bold font-display text-gray-900">Forgot Password</h2>
                <p className="text-gray-500 mt-2 mb-6">Enter your phone number to receive a reset code.</p>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setPhoneForOTP({ phone, code: countryCode }); navigate('OTPVerification'); }}>
                    <div>
                        <label htmlFor="phone-reset" className="block text-sm font-medium text-gray-700 mb-1 text-left">Phone Number</label>
                        <div className="flex items-center">
                            <div className="relative">
                                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-1 h-full bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3">
                                    <span>{countryCode}</span>
                                    <ChevronDownIcon className="w-4 h-4 text-gray-600"/>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute bottom-full mb-1 w-24 bg-white border rounded-md shadow-lg z-10">
                                        {countryCodes.map(c => (
                                            <div key={c.code} onClick={() => { setCountryCode(c.code); setIsDropdownOpen(false); }} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">{c.name} ({c.code})</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                id="phone-reset"
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="24 123 4567"
                                required
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <Button type="submit">Send Code</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OTPScreen: React.FC<{ navigate: (s: Screen) => void, onBack: () => void, showToast: (msg: string) => void, phoneDetails: { phone: string; code: string } }> = ({ navigate, onBack, showToast, phoneDetails }) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [countdown]);

    useEffect(() => {
        if (!isVerifying) {
            inputRefs.current[0]?.focus();
        }
    }, [isVerifying]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    
    const handleVerify = () => {
        setMessage(null);
        setIsVerifying(true);
        const code = otp.join("");

        setTimeout(() => {
            if (code === "235777") {
                setMessage({ text: 'Redirecting you to the login page…', type: 'success' });
                setTimeout(() => {
                    navigate('Login');
                }, 2500);
            } else {
                setMessage({ text: '❌ The code you entered is incorrect or has expired. Please request a new one.', type: 'error' });
                setIsVerifying(false);
            }
        }, 1500);
    };

    const handleResend = () => {
        if (countdown > 0) return;
        showToast("A new code has been sent.");
        setOtp(new Array(6).fill(""));
        setMessage(null);
        setCountdown(60);
        inputRefs.current[0]?.focus();
    };

    const maskPhoneNumber = (code: string, phone: string) => {
        const lastFour = phone.slice(-4);
        return `${code} *** *** ${lastFour}`;
    };

    const isSuccess = message?.type === 'success';
    const messageColor = message?.type === 'error' ? 'text-red-600' : '';

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <button onClick={onBack} className="absolute top-4 left-4 text-primary p-2 rounded-full hover:bg-gray-100 z-10" aria-label="Go back">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
             <div className="text-center mb-6">
                <h1 className="text-3xl font-display font-bold text-primary">XTASS</h1>
            </div>
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
                {isSuccess ? (
                    <div className="animate-fade-in">
                        <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto animate-pulse" />
                        <h2 className="text-2xl font-bold font-display text-gray-900 mt-4">Verification Successful!</h2>
                        <p className="text-gray-600 mt-2">{message.text}</p>
                    </div>
                ) : (
                    <>
                        <ShieldIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold font-display text-gray-900">OTP Verification</h2>
                        <p className="text-gray-500 mt-2 mb-4">Enter the code sent to</p>
                        <div className="flex items-center justify-center font-semibold text-gray-800 bg-gray-100 py-2 px-4 rounded-lg mb-6">
                           <span>{maskPhoneNumber(phoneDetails.code, phoneDetails.phone)}</span>
                           <button onClick={onBack} className="ml-3 text-primary text-sm font-medium hover:underline">Edit</button>
                        </div>
                        
                        <div className="flex justify-center space-x-2 mb-6">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    maxLength={1}
                                    // FIX: Changed ref callback to not return a value to fix TypeScript error.
                                    ref={el => { inputRefs.current[index] = el; }}
                                    className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                                    disabled={isVerifying}
                                />
                            ))}
                        </div>

                        {message && (
                            <div className={`mt-4 text-sm font-semibold ${messageColor}`}>
                                {message.text}
                            </div>
                        )}
                        
                        <div className="mt-4">
                            <Button onClick={handleVerify} disabled={isVerifying || otp.join("").length !== 6}>
                                {isVerifying ? 'Verifying...' : 'Verify Account'}
                            </Button>
                        </div>
                        
                        <div className="mt-6 text-sm text-center text-gray-600">
                           <p>Didn't receive the code?</p>
                           <button 
                                onClick={handleResend} 
                                disabled={countdown > 0 || isVerifying}
                                className="font-medium text-primary hover:text-primary-hover disabled:text-gray-400 disabled:cursor-not-allowed"
                           >
                                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                           </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const LivePhotoLoginScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [captured, setCaptured] = React.useState(false);

    useEffect(() => {
        let stream: MediaStream;
        async function setupCamera() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera: ", err);
                    alert("Could not access the camera. Please ensure permissions are granted.");
                    navigate('Login');
                }
            }
        }
        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [navigate]);

    const handleCapture = () => {
        setCaptured(true);
        // Simulate login process
        setTimeout(() => {
            navigate('PostLoginVerification');
        }, 1500);
    };

    return (
        <ScreenContainer>
            <Header title="Live Photo Login" onBack={() => navigate('Login')} />
            <div className="p-4 flex flex-col items-center">
                <p className="text-gray-600 text-center mb-4">Position your face within the frame and capture a photo to log in.</p>
                <div className="w-full aspect-square bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    {captured && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                            <CheckCircleIcon className="w-16 h-16 text-white mb-2" />
                            <p className="text-white font-semibold">Verifying...</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 w-full max-w-xs">
                     <Button onClick={handleCapture} disabled={captured}>
                        {captured ? 'Verifying...' : 'Capture Photo & Login'}
                    </Button>
                </div>
            </div>
        </ScreenContainer>
    );
};

const PostLoginVerificationScreen: React.FC<NavigationProps> = ({ navigate, logout }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [captured, setCaptured] = React.useState(false);

    useEffect(() => {
        let stream: MediaStream;
        async function setupCamera() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera: ", err);
                    if(logout) logout();
                }
            }
        }
        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [logout]);

    const handleCapture = () => {
        setCaptured(true);
        // Simulate verification process
        setTimeout(() => {
            navigate('ServiceSelection');
        }, 1500);
    };

    return (
        <ScreenContainer>
            <Header title="Security Verification" onBack={logout} />
            <div className="p-4 flex flex-col items-center">
                <p className="text-gray-600 text-center mb-4">For your security, please capture a live photo to complete your login.</p>
                <div className="w-full aspect-square bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    {captured && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                            <CheckCircleIcon className="w-16 h-16 text-white mb-2" />
                            <p className="text-white font-semibold">Verified! Redirecting...</p>
                        </div>
                    )}
                </div>
                <div className="mt-6 w-full max-w-xs">
                     <Button onClick={handleCapture} disabled={captured}>
                        {captured ? 'Verifying...' : 'Capture Photo'}
                    </Button>
                </div>
            </div>
        </ScreenContainer>
    );
};


const ServiceSelectionScreen: React.FC<NavigationProps & { setFlow: (flow: 'shuttle' | 'rental') => void }> = ({ navigate, logout, setFlow }) => (
    <ScreenContainer>
        <Header title="Book a Ride" onBack={logout} />
        <div className="p-4 space-y-4">
            <div onClick={() => { setFlow('shuttle'); navigate('TripDetailsInput'); }} className="bg-primary text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-primary-hover transition-colors">
                <h3 className="text-2xl font-display font-bold">Instant Ride</h3>
                <p className="mt-1">Book the next available shuttle.</p>
            </div>
            <div onClick={() => { setFlow('shuttle'); navigate('ScheduleRide'); }} className="bg-accent text-[#660032] p-6 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400 transition-colors">
                 <h3 className="text-2xl font-display font-bold">Schedule Ride</h3>
                <p className="mt-1">Plan your trip in advance.</p>
            </div>
            <div onClick={() => { setFlow('rental'); navigate('CarRental'); }} style={{backgroundColor: '#660032'}} className="text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-opacity-90 transition-all">
                <h3 className="text-2xl font-display font-bold">Car Rental</h3>
                <p className="mt-1">Your personal ride for the day.</p>
            </div>
        </div>
    </ScreenContainer>
);

const TripDetailsInputScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [childSeat, setChildSeat] = useState(false);
    const [wheelchairAccess, setWheelchairAccess] = useState(false);
    const [luggagePhotos, setLuggagePhotos] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setLuggagePhotos(prev => [...prev, ...newFiles]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };
    
    const removePhoto = (indexToRemove: number) => {
        setLuggagePhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    return (
        <ScreenContainer>
            <Header title="Instant Ride" onBack={() => navigate('ServiceSelection')} />
            <div className="p-4 space-y-4">
                <Input id="pickup" label="Pickup Location" type="text" placeholder="Kotoka International Airport" defaultValue="Kotoka Int'l Airport, Terminal 3" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
                <Input id="destination" label="Destination" type="text" placeholder="Enter your destination" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
                <Input id="passengers" label="Passengers" type="number" placeholder="1" icon={<UsersIcon className="w-5 h-5 text-gray-400" />} />
                <Input id="luggage" label="Luggage" type="number" placeholder="2" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} />
                
                <div>
                    <h3 className="block text-sm font-medium text-gray-700 mb-2">Other Requirements</h3>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                            <input id="child-seat" name="child-seat" type="checkbox" checked={childSeat} onChange={e => setChildSeat(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                            <label htmlFor="child-seat" className="ml-3 block text-sm text-gray-900">Child Seat</label>
                        </div>
                        <div className="flex items-center">
                            <input id="wheelchair-access" name="wheelchair-access" type="checkbox" checked={wheelchairAccess} onChange={e => setWheelchairAccess(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                            <label htmlFor="wheelchair-access" className="ml-3 block text-sm text-gray-900">Wheelchair Access</label>
                        </div>
                    </div>
                </div>

                <div>
                     <label className="block text-sm font-medium text-gray-700">Upload Luggage Photo (Optional)</label>
                     <div
                         onDragOver={handleDragOver}
                         onDragLeave={handleDragLeave}
                         onDrop={handleDrop}
                         onClick={() => fileInputRef.current?.click()}
                         className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-dashed'} rounded-md cursor-pointer transition-colors`}
                     >
                         <div className="space-y-1 text-center">
                             <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                             <div className="flex text-sm text-gray-600">
                                 <span className="relative bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none">
                                     <span>Upload files</span>
                                 </span>
                                 <p className="pl-1">or drag and drop</p>
                             </div>
                             <p className="text-xs text-gray-500">JPG, PNG, HEIC</p>
                         </div>
                         <input
                             ref={fileInputRef}
                             id="file-upload"
                             name="file-upload"
                             type="file"
                             className="sr-only"
                             multiple
                             accept="image/jpeg,image/png,image/heic,.heic"
                             onChange={(e) => handleFileSelect(e.target.files)}
                         />
                     </div>
                     {luggagePhotos.length > 0 && (
                         <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                             {luggagePhotos.map((file, index) => (
                                 <div key={index} className="relative group">
                                     <img
                                         src={URL.createObjectURL(file)}
                                         alt={`luggage preview ${index}`}
                                         className="h-24 w-full object-cover rounded-md"
                                         onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                     />
                                     <button
                                         onClick={() => removePhoto(index)}
                                         className="absolute top-1 right-1 bg-red-600/75 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                         aria-label="Remove image"
                                     >
                                        &#x2715;
                                     </button>
                                 </div>
                             ))}
                         </div>
                     )}
                </div>
                
                <div className="pt-2">
                    <Button onClick={() => navigate('CompatibleShuttlesList')}>Find A Ride</Button>
                </div>
            </div>
        </ScreenContainer>
    );
};

const ScheduleRideScreen: React.FC<NavigationProps> = ({ navigate }) => {
    const [childSeat, setChildSeat] = useState(false);
    const [wheelchairAccess, setWheelchairAccess] = useState(false);
    const [luggagePhotos, setLuggagePhotos] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setLuggagePhotos(prev => [...prev, ...newFiles]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };
    
    const removePhoto = (indexToRemove: number) => {
        setLuggagePhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
    <ScreenContainer>
        <Header title="Schedule Ride" onBack={() => navigate('ServiceSelection')} />
        <div className="p-4 space-y-4">
            <Input id="date" label="Date" type="date" icon={<CalendarIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="time" label="Time" type="time" icon={<CalendarIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="pickup" label="Pickup Location" type="text" placeholder="Kotoka International Airport" defaultValue="Kotoka Int'l Airport, Terminal 3" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="destination" label="Destination" type="text" placeholder="Enter your destination" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="passengers" label="Passengers" type="number" placeholder="1" icon={<UsersIcon className="w-5 h-5 text-gray-400" />} />
            <Input id="luggage" label="Luggage" type="number" placeholder="2" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} />
            
            <div>
                <h3 className="block text-sm font-medium text-gray-700 mb-2">Other Requirements</h3>
                <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                        <input id="child-seat" name="child-seat" type="checkbox" checked={childSeat} onChange={e => setChildSeat(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="child-seat" className="ml-3 block text-sm text-gray-900">Child Seat</label>
                    </div>
                    <div className="flex items-center">
                        <input id="wheelchair-access" name="wheelchair-access" type="checkbox" checked={wheelchairAccess} onChange={e => setWheelchairAccess(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                        <label htmlFor="wheelchair-access" className="ml-3 block text-sm text-gray-900">Wheelchair Access</label>
                    </div>
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700">Upload Luggage Photo (Optional)</label>
                 <div
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                     onClick={() => fileInputRef.current?.click()}
                     className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-dashed'} rounded-md cursor-pointer transition-colors`}
                 >
                     <div className="space-y-1 text-center">
                         <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                         <div className="flex text-sm text-gray-600">
                             <span className="relative bg-white rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none">
                                 <span>Upload files</span>
                             </span>
                             <p className="pl-1">or drag and drop</p>
                         </div>
                         <p className="text-xs text-gray-500">JPG, PNG, HEIC</p>
                     </div>
                     <input
                         ref={fileInputRef}
                         id="file-upload-scheduled"
                         name="file-upload-scheduled"
                         type="file"
                         className="sr-only"
                         multiple
                         accept="image/jpeg,image/png,image/heic,.heic"
                         onChange={(e) => handleFileSelect(e.target.files)}
                     />
                 </div>
                 {luggagePhotos.length > 0 && (
                     <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                         {luggagePhotos.map((file, index) => (
                             <div key={index} className="relative group">
                                 <img
                                     src={URL.createObjectURL(file)}
                                     alt={`luggage preview ${index}`}
                                     className="h-24 w-full object-cover rounded-md"
                                     onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                 />
                                 <button
                                     onClick={() => removePhoto(index)}
                                     className="absolute top-1 right-1 bg-red-600/75 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                     aria-label="Remove image"
                                 >
                                    &#x2715;
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
            
            <div className="pt-2">
                <Button onClick={() => navigate('CompatibleShuttlesList')}>Find A Ride</Button>
            </div>
        </div>
    </ScreenContainer>
    )
};

const CarRentalScreen: React.FC<NavigationProps & { setVehicleTypeForFilter: (info: VehicleClassInfo | null) => void; setRentalDuration: (duration: number) => void; }> = ({ navigate, setVehicleTypeForFilter, setRentalDuration }) => {
    const [vehicleType, setVehicleType] = useState<string | null>(null);
    const [pickupDateTime, setPickupDateTime] = useState('');
    const [returnDateTime, setReturnDateTime] = useState('');
    const [duration, setDuration] = useState(0);
    const [passengers, setPassengers] = useState('1');
    const [luggage, setLuggage] = useState('2');
    const [addons, setAddons] = useState({
        childSeat: false,
    });

    useEffect(() => {
        let calculatedDuration = 0;
        if (pickupDateTime && returnDateTime) {
            const start = new Date(pickupDateTime);
            const end = new Date(returnDateTime);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
                const diffTime = end.getTime() - start.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                calculatedDuration = diffDays;
            }
        }
        setDuration(calculatedDuration);
        setRentalDuration(calculatedDuration); // Also update parent state in real-time
    }, [pickupDateTime, returnDateTime, setRentalDuration]);

    const vehicleTypes = {
        'Business Class': { name: 'Business Class', icon: <CarIcon/>, baseRate: 150 },
        'Economy Class': { name: 'Economy Class', icon: <CarIcon/>, baseRate: 80 },
        'Ordinary Class': { name: 'Ordinary Class', icon: <CarIcon/>, baseRate: 50 },
    };
    
    const toggleAddon = (addon: keyof typeof addons) => {
        setAddons(prev => ({...prev, [addon]: !prev[addon]}));
    }

    const CheckboxOption: React.FC<{ id: string, label: string, icon: React.ReactElement<{ className?: string }>, checked: boolean, onChange: () => void }> = ({ id, label, icon, checked, onChange }) => (
         <div className="flex items-center justify-between">
            <div className="flex items-center">
                {React.cloneElement(icon, { className: 'w-5 h-5 mr-3 text-gray-500' })}
                <label htmlFor={id} className="block text-sm text-gray-900">{label}</label>
            </div>
            <input id={id} name={id} type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded" />
        </div>
    );

    return (
        <ScreenContainer>
            <Header title="Car Rental" onBack={() => navigate('ServiceSelection')} />
            <div className="p-4 space-y-6">
                {/* Vehicle Type Selector */}
                <div>
                    <h3 className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle Type</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.values(vehicleTypes).map(v => (
                            <button key={v.name} onClick={() => setVehicleType(v.name)} className={`p-3 border rounded-lg text-center transition-colors ${vehicleType === v.name ? 'bg-primary text-white border-primary' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                {React.cloneElement(v.icon, {className: 'w-8 h-8 mx-auto mb-1'})}
                                <span className="text-sm font-semibold">{v.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Date & Time Selector */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input id="pickup-datetime" label="Pick-up Date & Time" type="datetime-local" value={pickupDateTime} onChange={e => setPickupDateTime(e.target.value)} />
                        <Input id="return-datetime" label="Return Date & Time" type="datetime-local" value={returnDateTime} onChange={e => setReturnDateTime(e.target.value)} />
                    </div>
                    <div className="mt-4 space-y-4">
                        <Input id="passengers-rental" label="Passengers" type="number" placeholder="1" icon={<UsersIcon className="w-5 h-5 text-gray-400" />} value={passengers} onChange={e => setPassengers(e.target.value)} />
                        <Input id="luggage-rental" label="Luggage" type="number" placeholder="2" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} value={luggage} onChange={e => setLuggage(e.target.value)} />
                    </div>
                    {duration > 0 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Rental Duration</label>
                            <div className="mt-1 bg-gray-100 p-3 rounded-md text-center">
                                <p className="font-bold text-lg text-gray-800">{duration} Day{duration > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Location Inputs */}
                <div className="space-y-4">
                    <Input id="pickup-location" label="Pick-up Location (Optional)" type="text" placeholder="e.g., Airport Terminal 3" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
                    <Input id="dropoff-location" label="Drop-off Location (Optional)" type="text" placeholder="e.g., Same as pick-up" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
                </div>
                
                {/* Base Rate */}
                <div>
                    <h3 className="block text-sm font-medium text-gray-700 mb-2">Car Rental Base Rate per Day</h3>
                    <div className="flex items-center bg-gray-50 p-3 rounded-md">
                        <label htmlFor="base-rate" className="block text-sm text-gray-900 mr-2">Minimum Base Rate:</label>
                        <span id="base-rate" className="font-semibold text-gray-800">
                           {vehicleType ? `$${vehicleTypes[vehicleType as keyof typeof vehicleTypes].baseRate.toFixed(2)}` : '---'}
                        </span>
                    </div>
                </div>

                {/* Optional Add-ons */}
                <div>
                    <h3 className="block text-sm font-medium text-gray-700 mb-2">Optional Add-ons</h3>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                        <CheckboxOption id="child-seat" label="Child Seat" icon={<BabyIcon/>} checked={addons.childSeat} onChange={() => toggleAddon('childSeat')} />
                    </div>
                </div>
                
                {/* Action Button */}
                <div className="pt-2">
                    <Button
                        onClick={() => {
                            if (!vehicleType) return;
                            const selectedVehicle = vehicleTypes[vehicleType as keyof typeof vehicleTypes];
                            setVehicleTypeForFilter({ name: selectedVehicle.name, baseRate: selectedVehicle.baseRate });
                            navigate('AvailableCarsForRent');
                        }}
                        className="hover:animate-pulse disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!vehicleType}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </ScreenContainer>
    );
};

const AvailableCarsForRentScreen: React.FC<NavigationProps & { onBack: () => void; onCarSelect: (car: Car) => void; selectedClassInfo: VehicleClassInfo | null; }> = ({ navigate, onBack, onCarSelect, selectedClassInfo }) => {
    const cars: Car[] = [
        { class: 'Economy Class', driver: 'John Doe', price: 80.00, seed: 'car1', description: 'Comfortable 4-seater with A/C.' },
        { class: 'Business Class', driver: 'Jane Smith', price: 150.00, seed: 'car2', description: 'Luxury sedan with premium features.' },
        { class: 'Ordinary Class', driver: 'Kwame Nkrumah', price: 50.00, seed: 'car3', description: 'A reliable and affordable option.' },
        { class: 'Business Class', driver: 'Adwoa Williams', price: 155.00, seed: 'car4', description: 'Spacious and elegant for business.' },
        { class: 'Economy Class', driver: 'Kojo Antwi', price: 85.00, seed: 'car5', description: 'Fuel-efficient and easy to park.' },
        { class: 'Economy Class', driver: 'Abena Yeboah', price: 82.00, seed: 'car6', description: 'Modern compact, great for city driving.' },
    ];
    
    useEffect(() => {
        if (!selectedClassInfo) {
            onBack();
        }
    }, [selectedClassInfo, onBack]);

    if (!selectedClassInfo) {
        return null; // or a loading spinner, or redirect immediately
    }

    const filteredCars = cars.filter(car => car.class === selectedClassInfo.name);

    const handleSelect = (car: Car) => {
        onCarSelect(car);
        navigate('CarRentDetails');
    };

    return (
        <ScreenContainer>
            <Header title="Cars for Rent" onBack={onBack} />
             <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold font-display text-primary">{selectedClassInfo.name}</h2>
                <p className="text-md font-semibold text-gray-700">Base Rate: ${selectedClassInfo.baseRate.toFixed(2)}<span className="text-sm font-normal text-gray-500">/day</span></p>
            </div>
            <div className="p-4">
                {filteredCars.length > 0 ? (
                     <div className="grid grid-cols-2 gap-4">
                        {filteredCars.map((car, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleSelect(car)} 
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                            >
                                <img src={`https://picsum.photos/seed/${car.seed}/200/150`} alt="car" className="w-full h-32 object-cover" />
                                <div className="p-3">
                                    <p className="text-sm text-gray-600 truncate group-hover:text-primary">{car.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <CarIcon className="w-16 h-16 mx-auto text-gray-300" />
                        <p className="mt-2 font-semibold">No cars available</p>
                        <p className="text-sm">Please try a different vehicle class.</p>
                    </div>
                )}
            </div>
        </ScreenContainer>
    );
};

const CarRentDetailsScreen: React.FC<NavigationProps & { car: Car | null; onBack: () => void; rentalDuration: number }> = ({ navigate, car, onBack, rentalDuration }) => {
    if (!car) {
        useEffect(() => {
            onBack();
        }, [onBack]);
        return null;
    }

    const features = [
        { name: "Air Conditioning", icon: <SnowflakeIcon className="w-6 h-6 text-primary"/> },
        { name: "GPS Tracking", icon: <MapPinIcon className="w-6 h-6 text-primary"/> },
        { name: "24/7 Support", icon: <PhoneIcon className="w-6 h-6 text-primary"/> },
        { name: "Free Cancellation", icon: <CheckCircleIcon className="w-6 h-6 text-primary"/> },
    ];
    
    const totalPrice = rentalDuration > 0 ? car.price * rentalDuration : car.price;

    return (
        <ScreenContainer>
            <Header title="Car Rent Details" onBack={onBack} />
            <div>
                <img src={`https://picsum.photos/seed/${car.seed}/400/200`} alt={car.class} className="w-full h-48 object-cover" />
                
                <div className="p-4">
                    {/* Car Info Card */}
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 -mt-16 relative z-10">
                        <h3 className="text-2xl font-bold font-display text-primary">{car.class}</h3>
                        <p className="text-md text-gray-600 mt-1">Driver: {car.driver}</p>
                        <p className="text-lg font-semibold text-gray-800 mt-2">Base Rate: <span className="text-primary font-bold">${car.price.toFixed(2)}/day</span></p>
                        <p className="text-sm text-gray-500 mt-2">{car.description}</p>
                    </div>

                    {/* Features Section */}
                    <div className="mt-6">
                        <h4 className="font-bold text-lg text-gray-800 mb-3">Features</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {features.map(feature => (
                                <div key={feature.name} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                                    {feature.icon}
                                    <span className="font-semibold text-sm text-gray-700">{feature.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="mt-6 bg-white p-4 rounded-lg shadow-md border">
                        <h4 className="font-bold text-lg text-gray-800 mb-3">Pricing</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Base Rate:</span>
                                <span className="font-semibold text-gray-800">${car.price.toFixed(2)}/day</span>
                            </div>
                            {rentalDuration > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Duration:</span>
                                    <span className="font-semibold text-gray-800">{rentalDuration} Day{rentalDuration > 1 ? 's' : ''}</span>
                                </div>
                            )}
                             <div className="flex justify-between items-center pt-3 border-t mt-3">
                                <span className="text-lg font-bold text-gray-800">Total Price:</span>
                                <span className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                 <div className="p-4 mt-2">
                    <Button onClick={() => navigate('PaymentSelection')}>Book Car Now</Button>
                </div>
            </div>
        </ScreenContainer>
    );
};


const CompatibleShuttlesListScreen: React.FC<NavigationProps & { onBack: () => void }> = ({ navigate, onBack }) => {
    const shuttles = [
        { class: 'Economy Shuttle', name: 'Toyota Hiace', driver: 'Kofi Mensah', price: 100.00, distance: 50, seed: 'shuttle1' },
        { class: 'Business Shuttle', name: 'Hyundai H1', driver: 'Ama Serwaa', price: 180.00, distance: 75, seed: 'shuttle2' },
        { class: 'Ordinary Shuttle', name: 'Mercedes Sprinter', driver: 'Yaw Boateng', price: 120.00, distance: 60, seed: 'shuttle3' },
    ];

    // Find the cheapest shuttle to display its info in the header as a feature
    const featuredShuttle = [...shuttles].sort((a, b) => a.price - b.price)[0];

    return (
        <ScreenContainer>
            {/* Custom Header with specific title color */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                    <button onClick={onBack} className="text-primary p-2 -ml-2">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-display font-bold text-[#660032] text-center">Available Shuttles</h1>
                    <div className="w-8"></div>
                </div>
            </header>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold font-display text-primary">{featuredShuttle.class}</h2>
                <p className="text-md font-semibold text-gray-700">Base Rate: ${featuredShuttle.price.toFixed(2)}<span className="text-sm font-normal text-gray-500">/{featuredShuttle.distance}km</span></p>
            </div>
            <div className="p-4">
                {shuttles.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {shuttles.map((shuttle, i) => (
                            <div 
                                key={i} 
                                onClick={() => navigate('ShuttleDriverDetails')} 
                                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
                            >
                                <img src={`https://picsum.photos/seed/${shuttle.seed}/200/150`} alt="shuttle" className="w-full h-32 object-cover" />
                                <div className="p-3">
                                    <p className="text-md font-semibold text-gray-800 truncate group-hover:text-primary">{shuttle.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <BusIcon className="w-16 h-16 mx-auto text-gray-300" />
                        <p className="mt-2 font-semibold">No shuttles available</p>
                        <p className="text-sm">Please try adjusting your search.</p>
                    </div>
                )}
            </div>
        </ScreenContainer>
    );
};

const ShuttleDriverDetailsScreen: React.FC<NavigationProps> = ({ navigate }) => (
    <ScreenContainer>
        <Header title="Shuttle Details" onBack={() => navigate('CompatibleShuttlesList')} />
        <div className="p-4">
            <img src="https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400&h=200&fit=crop&q=80" alt="Passenger with her luggage at the airport" className="w-full h-48 rounded-lg object-cover mb-4" />
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

const PaymentSelectionScreen: React.FC<NavigationProps & { onBack: () => void }> = ({ navigate, onBack }) => (
    <ScreenContainer>
        <Header title="Select Payment" onBack={onBack} />
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

const PaymentProcessingScreen: React.FC<NavigationProps & { showToast: (msg: string, type?: 'success' | 'error') => void; flow: 'shuttle' | 'rental' | null; }> = ({ navigate, showToast, flow }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            showToast("Payment Successful!");
            if (flow === 'rental') {
                navigate('TripCompletionReceipt');
            } else {
                navigate('TripTracking');
            }
        }, 3000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flow, navigate, showToast]);

    return (
        <ScreenContainer>
            <Header title="Processing Payment" onBack={() => navigate('PaymentSelection')} />
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

const TripCompletionReceiptScreen: React.FC<NavigationProps & { flow: 'shuttle' | 'rental' | null; car: Car | null; duration: number }> = ({ navigate, flow, car, duration }) => {
    const isRental = flow === 'rental' && car && duration > 0;
    const total = isRental ? car.price * duration : 10.00;
    
    return (
        <ScreenContainer>
            <Header title={isRental ? "Booking Confirmed" : "Trip Completed"} onBack={() => navigate('ServiceSelection')} />
            <div className="p-4 text-center">
                <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display">Thank You!</h2>
                <p className="text-lg text-gray-600">{isRental ? 'Your car rental is confirmed.' : 'Your trip to Accra Mall is complete.'}</p>
                <div className="bg-gray-50 p-4 rounded-lg my-6 text-left">
                    <h3 className="font-bold text-lg mb-2">Receipt</h3>
                    {isRental ? (
                        <>
                            <div className="flex justify-between"><span>Car Model</span><span>{car.class}</span></div>
                            <div className="flex justify-between"><span>Daily Rate</span><span>${car.price.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Duration</span><span>{duration} Day{duration > 1 ? 's' : ''}</span></div>
                        </>
                    ) : (
                        <div className="flex justify-between"><span>Base Fare</span><span>$10.00</span></div>
                    )}
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total Paid</span><span>${total.toFixed(2)}</span></div>
                </div>
                {!isRental && (
                    <div className="my-6">
                        <h3 className="font-bold text-lg mb-2">Rate Your Driver</h3>
                        <div className="flex justify-center text-4xl text-gray-300 space-x-2">
                            {[...Array(5)].map((_, i) => <button key={i} className="hover:text-yellow-400">★</button>)}
                        </div>
                    </div>
                )}
                <Button onClick={() => navigate('ServiceSelection')}>Back to Home</Button>
            </div>
        </ScreenContainer>
    );
};

const TripHistoryScreen: React.FC<NavigationProps> = ({ navigate }) => {
    // FIX: Typed icon as React.ReactElement to allow cloning with props and resolve the JSX namespace error.
    // FIX: Explicitly type the icon prop to include `className` for React.cloneElement.
    const trips: { status: string; color: string; icon: React.ReactElement<{ className?: string }> }[] = [
        { status: 'Completed', color: 'green-500', icon: <CheckCircleIcon/> }, 
        { status: 'Completed', color: 'green-500', icon: <CheckCircleIcon/> }, 
        { status: 'Cancelled', color: 'red-500', icon: <XCircleIcon/> }
    ];
    
    return (
        <ScreenContainer>
            <Header title="Trip History" onBack={() => navigate('ServiceSelection')} />
            <div className="p-4 space-y-3">
                {trips.map((trip, i) => (
                    <div key={i} onClick={() => navigate('TripDetailsView')} className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center cursor-pointer hover:shadow-lg">
                        <div>
                            <p className="font-bold">Accra Mall</p>
                            <p className="text-sm text-gray-500">Oct 26, 203</p>
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
};

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
        <Header title="My Profile" onBack={() => navigate('ServiceSelection')} />
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