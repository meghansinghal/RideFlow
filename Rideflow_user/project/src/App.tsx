import React, { useState, useEffect } from 'react';
import { MapPin, Clock, IndianRupee, Car, ChevronRight, X, AlertCircle, Navigation, ArrowRight } from 'lucide-react';
import { useRouteData } from './hooks/useRouteData';
import LocationAutocomplete from './LocationAutocomplete';

function App() {
  const [step, setStep] = useState<'home' | 'request' | 'accepted' | 'confirmation'>('home');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [acceptedWait, setAcceptedWait] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<null | {
    location: string;
    savings: number;
    timeReduction: number;
  }>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [driverDetails, setDriverDetails] = useState({
    name: 'Rajesh Kumar',
    rating: 4.8,
    vehicleNumber: 'KA 01 AB 1234',
    vehicleModel: 'Swift Dzire'
  });

  // Use the route data hook
  const { data: routeData, isLoading, isError } = useRouteData(pickup, dropoff);

  // Update price and wait time when route data changes
  const [price, setPrice] = useState({ min: 250, max: 300 });
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (routeData) {
      setPrice(routeData.price);
      setWaitTime(routeData.waitTime);
    }
  }, [routeData]);

  const handleProceed = () => {
    if (step === 'home' && pickup && dropoff) {
      setStep('request');
    } else if (step === 'request') {
      setStep('accepted');
    } else if (step === 'accepted' && acceptedWait) {
      setStep('confirmation');
    }
  };

  const handleCancel = () => {
    setStep('home');
    setAcceptedWait(false);
    setSelectedAlternative(null);
    setShowAlternatives(false);
  };

  const handleAlternativeSelect = (alternative: typeof selectedAlternative) => {
    setSelectedAlternative(alternative);
    if (alternative && routeData) {
      setPrice({
        min: Math.max(routeData.price.min - alternative.savings, 50),
        max: Math.max(routeData.price.max - alternative.savings, 60)
      });
      setWaitTime(Math.max(waitTime - alternative.timeReduction, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
  <img src="https://i.postimg.cc/bvwYh0cQ/Untitled-design-1.png" alt="RideFlow Icon" className="inline-block w-6 h-6 mr-2" />
  RideFlow
</h1>
            {step !== 'home' && (
              <button 
                onClick={handleCancel}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {isError && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-700">Error fetching route data. Please try again.</p>
          </div>
        )}

        {step === 'home' && (
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
              <img 
                src="https://i.postimg.cc/44cq2K7w/maps.jpg"
                alt="Bangalore Map"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Location inputs */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
              <LocationAutocomplete
                value={pickup}
                onChange={setPickup}
                placeholder="Pickup Location"
                icon={<MapPin className="w-5 h-5 text-blue-600" />}
              />
              <LocationAutocomplete
                value={dropoff}
                onChange={setDropoff}
                placeholder="Drop-off Location"
                icon={<MapPin className="w-5 h-5 text-red-600" />}
              />
              <button
                onClick={handleProceed}
                disabled={!pickup || !dropoff || isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Calculating Route...' : 'Book Ride'}
              </button>
            </div>
          </div>
        )}

        {step === 'request' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Pickup</p>
                  <p className="font-medium">{pickup}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-red-600 w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Drop-off</p>
                  <p className="font-medium">{selectedAlternative?.location || dropoff}</p>
                </div>
              </div>
            </div>

            {/* Alternative Drop-offs Section */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Navigation className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {showAlternatives ? 'Hide' : 'Show'} alternative drop-off points
                </span>
              </button>

              {showAlternatives && routeData?.alternatives && routeData.alternatives.length > 0 && (
                <div className="mt-4 space-y-3">
                  {routeData.alternatives.map((alt, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAlternative?.location === alt.location
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleAlternativeSelect(alt)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Navigation className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{alt.location}</p>
                            <p className="text-sm text-gray-500">
                              Save ₹{alt.savings} • {alt.timeReduction} min faster
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Live Price</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-blue-800">₹{price.min} - ₹{price.max}</span>
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Estimated Wait Time</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Current wait time: {waitTime} minutes
                </p>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors"
            >
              Search for Drivers
            </button>
          </div>
        )}

        {step === 'accepted' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Driver Found!</h2>
              <p className="text-gray-600 mt-1">Please confirm to proceed</p>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Driver</span>
                <span className="font-medium">{driverDetails.name} ({driverDetails.rating}⭐)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-medium">{driverDetails.vehicleModel} ({driverDetails.vehicleNumber})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Drop-off</span>
                <span className="font-medium">{selectedAlternative?.location || dropoff}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Fare</span>
                <span className="font-medium text-green-600">₹{price.min} - ₹{price.max}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Wait Time</span>
                <span className="font-medium">{waitTime} minutes</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={acceptedWait}
                  onChange={(e) => setAcceptedWait(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-yellow-800">
                  I accept the waiting time of {waitTime} minutes
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCancel}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                disabled={!acceptedWait}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Ride
              </button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Ride Confirmed!</h2>
              <p className="text-gray-600 mt-1">Your driver is on the way</p>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Driver</span>
                <span className="font-medium">{driverDetails.name} ({driverDetails.rating}⭐)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-medium">{driverDetails.vehicleModel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle Number</span>
                <span className="font-medium">{driverDetails.vehicleNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Drop-off</span>
                <span className="font-medium">{selectedAlternative?.location || dropoff}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Final Fare</span>
                <span className="font-medium text-green-600">₹{price.min} - ₹{price.max}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Arrival Time</span>
                <span className="font-medium">{waitTime} minutes</span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Track your ride and driver's location in real-time. Your driver will call you when nearby.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;