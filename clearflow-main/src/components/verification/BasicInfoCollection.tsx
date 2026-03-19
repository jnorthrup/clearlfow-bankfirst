import React, { useState } from 'react';

interface BasicInfoCollectionProps {
  onComplete: (data: { name: string; email: string; useCase: string }) => void;
  isEmbedded?: boolean;
}

const USE_CASE_OPTIONS = [
  { value: 'business_banking', label: 'Business Banking', description: 'Manage business finances and payments' },
  { value: 'personal_finance', label: 'Personal Finance', description: 'Track personal income and expenses' },
  { value: 'investment', label: 'Investment Management', description: 'Manage investments and assets' },
  { value: 'accounting', label: 'Accounting & Bookkeeping', description: 'Professional accounting services' },
  { value: 'real_estate', label: 'Real Estate', description: 'Property management and transactions' },
  { value: 'other', label: 'Other', description: 'Other financial use case' },
];

export const BasicInfoCollection: React.FC<BasicInfoCollectionProps> = ({
  onComplete,
  isEmbedded = false,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; useCase?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!useCase) {
      newErrors.useCase = 'Please select a use case';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete({ name: name.trim(), email: email.trim(), useCase });
    }
  };

  const containerClass = isEmbedded
    ? ''
    : 'flex items-center justify-center min-h-screen';

  const cardClass = isEmbedded
    ? 'p-6'
    : 'p-8 bg-slate-800/50 rounded-lg shadow-2xl border border-slate-700 max-w-lg w-full';

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Welcome to ClearFlow</h1>
          <p className="text-slate-400 mt-2">Let's get started with some basic information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:outline-none focus:border-blue-500"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="useCase" className="block text-sm font-medium text-slate-300 mb-2">
              What will you use ClearFlow for?
            </label>
            <div className="space-y-2">
              {USE_CASE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-3 bg-slate-700/50 border rounded-md cursor-pointer transition-all ${
                    useCase === option.value
                      ? 'border-blue-500 bg-slate-700'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="useCase"
                    value={option.value}
                    checked={useCase === option.value}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="text-slate-100 font-medium">{option.label}</span>
                    <p className="text-xs text-slate-400">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.useCase && <p className="text-red-400 text-sm mt-1">{errors.useCase}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          By continuing, you agree to ClearFlow's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoCollection;
