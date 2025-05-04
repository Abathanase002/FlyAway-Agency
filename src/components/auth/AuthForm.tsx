import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Upload } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'Customer',
    photoURL: '',
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Update form data
    setFormData(prev => ({ ...prev, photoURL: file.name }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (type === 'register') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (type === 'login') {
      const success = await login({
        email: formData.email,
        password: formData.password
      });
      if (success) {
        navigate('/');
      }
    } else {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        photoURL: previewImage || '', // Use preview image if available
      };

      const success = await register(userData);
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'register' && (
        <>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={triggerFileInput}>
                {previewImage ? (
                  <AvatarImage src={previewImage} alt="Profile preview" />
                ) : (
                  <AvatarFallback className="bg-gray-100 text-gray-800 text-2xl">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0) || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute -bottom-2 -right-2 bg-travel-600 text-white p-2 rounded-full hover:bg-travel-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <span className="text-sm text-red-500">{errors.firstName}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <span className="text-sm text-red-500">{errors.lastName}</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <span className="text-sm text-red-500">{errors.password}</span>
        )}
      </div>

      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-500">{errors.confirmPassword}</span>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="userType">I am a</Label>
        <Select value={formData.userType} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-travel-600 hover:bg-travel-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === 'login' ? 'Logging in...' : 'Registering...'}
          </span>
        ) : (
          <>{type === 'login' ? 'Login' : 'Register'}</>
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
