import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/_app/_auth/client/onboarding/_layout/")({
  component: OnboardingForm,
});

function OnboardingForm() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    businessDescription: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would submit the data to the server
    alert("Onboarding form submitted! This is a placeholder.");
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map(num => (
            <div 
              key={num}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= num ? "bg-primary text-white" : "bg-primary/10 text-primary/60"
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="h-2 w-full rounded-full bg-primary/10">
          <div 
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Personal Information</h2>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-primary/80">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary/80">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary/80">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="mt-1"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Address Information</h2>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-primary/80">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-primary/80">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-primary/80">
                  State/Province
                </label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-primary/80">
                  ZIP/Postal Code
                </label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter your ZIP code"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-primary/80">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Business Information</h2>
            
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-primary/80">
                Business Name
              </label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-primary/80">
                Business Description
              </label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                placeholder="Describe your business"
                required
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={4}
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button type="submit">
                Complete Onboarding
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

