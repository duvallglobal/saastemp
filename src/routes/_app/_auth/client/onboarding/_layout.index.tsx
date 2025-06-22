import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Checkbox } from "@/ui/checkbox";

export const Route = createFileRoute("/_app/_auth/client/onboarding/_layout/")({
  component: OnboardingForm,
});

function OnboardingForm() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Service Selection
    serviceType: "",
    
    // Basic Information
    legalFullName: "",
    preferredName: "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    location: "",
    
    // Identity Verification
    frontIdImage: null,
    backIdImage: null,
    selfieWithId: null,
    
    // Privacy & Persona
    hasOnlinePersona: false,
    stageNames: "",
    facialVisibility: "face-okay",
    privacyConcerns: "",
    
    // Account Access
    accountCreationOption: "",
    
    // Additional fields can be added as needed
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">Onboarding Questionnaire</h1>
        <p className="text-primary/60 mb-4">
          This onboarding process includes conditional logic for relevant questions,
          identity verification, service-specific inquiries, and legal agreements.
        </p>
        
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4, 5].map(num => (
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
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-lg p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">1. Welcome & Service Selection</h2>
            <p className="text-primary/60">Which service are you signing up for?</p>
            
            <RadioGroup 
              value={formData.serviceType} 
              onValueChange={(value) => handleSelectChange("serviceType", value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onlyfans" id="onlyfans" />
                <Label htmlFor="onlyfans">OnlyFans Management</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rentmen" id="rentmen" />
                <Label htmlFor="rentmen">Rent.Men Concierge Service</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Both</Label>
              </div>
            </RadioGroup>
            
            <div className="pt-4 flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">2. Basic Information</h2>
            
            <div>
              <Label htmlFor="legalFullName" className="block text-sm font-medium text-primary/80">
                Legal Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="legalFullName"
                name="legalFullName"
                value={formData.legalFullName}
                onChange={handleChange}
                placeholder="Enter your legal full name"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="preferredName" className="block text-sm font-medium text-primary/80">
                Preferred Name/Alias (if different)
              </Label>
              <Input
                id="preferredName"
                name="preferredName"
                value={formData.preferredName}
                onChange={handleChange}
                placeholder="Enter your preferred name or alias"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-primary/80">
                Email Address <span className="text-red-500">*</span>
              </Label>
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
              <Label htmlFor="phone" className="block text-sm font-medium text-primary/80">
                Phone Number <span className="text-red-500">*</span>
              </Label>
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
            
            <div>
              <Label htmlFor="dateOfBirth" className="block text-sm font-medium text-primary/80">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="location" className="block text-sm font-medium text-primary/80">
                Current Location (City, State/Country) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your current location"
                required
                className="mt-1"
              />
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
            <h2 className="text-xl font-semibold text-primary">3. Identity Verification</h2>
            <p className="text-primary/60 mb-4">
              To comply with platform policies and ensure your security, we require ID verification.
            </p>
            
            <div>
              <Label htmlFor="frontIdImage" className="block text-sm font-medium text-primary/80">
                Upload a clear photo of the front of your government-issued ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="frontIdImage"
                name="frontIdImage"
                type="file"
                accept="image/*"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="backIdImage" className="block text-sm font-medium text-primary/80">
                Upload a clear photo of the back of your government-issued ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="backIdImage"
                name="backIdImage"
                type="file"
                accept="image/*"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="selfieWithId" className="block text-sm font-medium text-primary/80">
                Upload a selfie holding your ID next to your face <span className="text-red-500">*</span>
              </Label>
              <Input
                id="selfieWithId"
                name="selfieWithId"
                type="file"
                accept="image/*"
                required
                className="mt-1"
              />
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
        
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">4. Privacy & Persona</h2>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="hasOnlinePersona" 
                  checked={formData.hasOnlinePersona}
                  onCheckedChange={(checked) => handleCheckboxChange("hasOnlinePersona", checked as boolean)}
                />
                <Label htmlFor="hasOnlinePersona" className="text-sm font-medium text-primary/80">
                  Do you have an established online persona or stage name? <span className="text-red-500">*</span>
                </Label>
              </div>
              
              {formData.hasOnlinePersona && (
                <div className="ml-6 mt-2">
                  <Label htmlFor="stageNames" className="block text-sm font-medium text-primary/80">
                    Please provide your stage name(s)
                  </Label>
                  <Input
                    id="stageNames"
                    name="stageNames"
                    value={formData.stageNames}
                    onChange={handleChange}
                    placeholder="Enter your stage name(s)"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-primary/80 mb-2">
                How public do you want your persona to be regarding facial visibility? <span className="text-red-500">*</span>
              </Label>
              <RadioGroup 
                value={formData.facialVisibility} 
                onValueChange={(value) => handleSelectChange("facialVisibility", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="face-okay" id="face-okay" />
                  <Label htmlFor="face-okay">Face is okay</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-face" id="no-face" />
                  <Label htmlFor="no-face">No face preferred</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masked-face" id="masked-face" />
                  <Label htmlFor="masked-face">Masked/Obscured face</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other-face" />
                  <Label htmlFor="other-face">Other (please specify)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="privacyConcerns" className="block text-sm font-medium text-primary/80">
                Are there any specific privacy concerns or boundaries we should be aware of?
              </Label>
              <Textarea
                id="privacyConcerns"
                name="privacyConcerns"
                value={formData.privacyConcerns}
                onChange={handleChange}
                placeholder="Enter any privacy concerns or boundaries"
                className="mt-1"
                rows={3}
              />
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
        
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">5. Account Access & Social Media</h2>
            <p className="text-primary/60 mb-4">
              Fields display/hide based on selected platforms
            </p>
            
            <div>
              <Label className="block text-sm font-medium text-primary/80 mb-2">
                Account Creation Options:
              </Label>
              <Select 
                value={formData.accountCreationOption} 
                onValueChange={(value) => handleSelectChange("accountCreationOption", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create-new">Create new accounts for me</SelectItem>
                  <SelectItem value="use-existing">Use my existing accounts</SelectItem>
                  <SelectItem value="mix">Mix of new and existing accounts</SelectItem>
                </SelectContent>
              </Select>
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

