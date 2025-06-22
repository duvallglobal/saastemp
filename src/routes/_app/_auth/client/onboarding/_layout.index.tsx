import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, convexMutation } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { Button } from "@/ui/button";
import { useState, useEffect, useCallback } from "react";
import { OnboardingCard } from "@/components/onboarding/OnboardingCard";
import { OnlyFansFields } from "@/components/onboarding/OnlyFansFields";
import { RentMenFields } from "@/components/onboarding/RentMenFields";
import { LegalAgreements } from "@/components/onboarding/LegalAgreements";
import { CommunicationPreferences } from "@/components/onboarding/CommunicationPreferences";
import { AccountAccess } from "@/components/onboarding/AccountAccess";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Checkbox } from "@/ui/checkbox";
import { debounce } from "lodash";
import { CheckIcon, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_app/_auth/client/onboarding/_layout/")({
  component: OnboardingForm,
});

function OnboardingForm() {
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  
  // Get existing onboarding data if available
  const { data: existingProfile } = useQuery(
    convexQuery(api.app.getClientProfile, {})
  );
  
  // Initialize form data with existing data if available
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
    needHelpCreating: false,
    doNotNeedAccountManagement: false,
    
    // OnlyFans specific
    ofUsername: "",
    ofEmail: "",
    ofPassword: "",
    ofCreatorHandle: "",
    ofExperience: "",
    ofObjectiveGrowth: false,
    ofObjectiveBrand: false,
    ofObjectiveDMs: false,
    ofObjectiveOther: false,
    ofObjectiveOtherText: "",
    ofContentPhotos: false,
    ofContentVideos: false,
    ofContentPPV: false,
    ofContentCustom: false,
    ofContentLive: false,
    ofContentOther: false,
    ofContentOtherText: "",
    ofContentSchedule: "",
    ofTargetAudience: "",
    ofPrimaryGoals: "",
    ofContentUnwilling: "",
    ofBrandDescription: "",
    ofDoNotSay: "",
    ofContentEditor: "client",
    
    // Rent.Men specific
    rmUsername: "",
    rmEmail: "",
    rmPassword: "",
    rmProfileUrl: "",
    rmPrimaryServices: "",
    rmRateHourly: false,
    rmRateHourlyAmount: "",
    rmRateOvernight: false,
    rmRateOvernightAmount: "",
    rmRateTravel: false,
    rmRateTravelAmount: "",
    rmAvailability: "",
    rmGeographicAvailability: "",
    rmWillingToTravel: false,
    rmTravelRegions: "",
    rmCallType: "",
    rmIncallLocation: "",
    rmClientPreferences: "",
    rmServiceLimits: "",
    rmScreeningID: false,
    rmScreeningVideoCall: false,
    rmScreeningDeposit: false,
    rmScreeningOther: false,
    rmScreeningOtherText: "",
    rmApprovalProcess: "",
    rmRepeatClients: "",
    rmPaymentMethod: "",
    rmDepositRequirements: "",
    
    // Communication preferences
    communicationMethod: "",
    bestContactMethod: "",
    safetyRequirements: "",
    
    // Legal agreements
    authorizeAccess: false,
    backupResponsibility: false,
    termsAgreement: false,
    confirmInformation: false,
    
    // Social media
    igUsername: "",
    igEmail: "",
    igPassword: "",
    ttUsername: "",
    ttEmail: "",
    ttPassword: "",
    twUsername: "",
    twEmail: "",
    twPassword: "",
    additionalPlatformName: "",
    additionalPlatformUsername: "",
    additionalPlatformEmail: "",
    additionalPlatformPassword: "",
  });
  
  // Load existing data if available
  useEffect(() => {
    if (existingProfile) {
      // Map the profile data to the form data
      const mappedData: any = {
        serviceType: existingProfile.serviceType || "",
        legalFullName: existingProfile.legalFullName || "",
        preferredName: existingProfile.preferredName || "",
        phone: existingProfile.phone || "",
        dateOfBirth: existingProfile.dateOfBirth || "",
        location: `${existingProfile.city || ""}, ${existingProfile.state || ""}, ${existingProfile.country || ""}`,
        hasOnlinePersona: existingProfile.hasOnlinePersona || false,
        stageNames: existingProfile.stageNames || "",
        facialVisibility: existingProfile.facialVisibility || "face-okay",
        privacyConcerns: existingProfile.privacyConcerns || "",
        // Add more mappings as needed
      };
      
      // Update form data with existing data
      setFormData(prev => ({
        ...prev,
        ...mappedData,
      }));
      
      // Mark steps as completed based on existing data
      const completed = [];
      if (mappedData.serviceType) completed.push(1);
      if (mappedData.legalFullName && mappedData.phone) completed.push(2);
      // Add more conditions for other steps
      
      setCompletedSteps(completed);
    }
  }, [existingProfile]);
  
  // Mutation for saving onboarding data
  const saveOnboardingMutation = useMutation(
    convexMutation(api.app.submitClientOnboardingPartial)
  );
  
  // Function to save form data
  const saveFormData = async (data: any, stepCompleted?: number) => {
    setIsSaving(true);
    setSaveStatus("saving");
    
    try {
      // Prepare data for saving
      const dataToSave = {
        ...data,
        stepCompleted,
      };
      
      // Call the API to save the data
      await saveOnboardingMutation.mutateAsync(dataToSave);
      
      // Update completed steps
      if (stepCompleted && !completedSteps.includes(stepCompleted)) {
        setCompletedSteps(prev => [...prev, stepCompleted]);
      }
      
      setSaveStatus("success");
    } catch (error) {
      console.error("Error saving form data:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
      // Reset save status after a delay
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };
  
  // Debounced save for when user is typing
  const debouncedSave = useCallback(
    debounce((data) => saveFormData(data), 2000),
    []
  );
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    debouncedSave(updatedData);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    debouncedSave(updatedData);
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    const updatedData = { ...formData, [name]: checked };
    setFormData(updatedData);
    debouncedSave(updatedData);
  };
  
  // Handle step navigation
  const goToStep = (step: number) => {
    if (step <= activeStep || completedSteps.includes(step - 1)) {
      setActiveStep(step);
    }
  };
  
  const nextStep = () => {
    // Save current step data
    saveFormData(formData, activeStep);
    // Move to next step
    setActiveStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Handle final submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Call the API to submit the complete onboarding data
      await saveOnboardingMutation.mutateAsync({
        ...formData,
        isComplete: true,
      });
      
      // Show success message
      alert("Onboarding completed successfully! Your information has been submitted for review.");
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      alert("There was an error submitting your onboarding information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Onboarding Questionnaire</h1>
        <p className="text-primary/60 mb-6">
          This onboarding process includes conditional logic for relevant questions,
          identity verification, service-specific inquiries, and legal agreements.
        </p>
        
        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map(step => (
              <button
                key={step}
                onClick={() => goToStep(step)}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all
                  ${activeStep === step 
                    ? "bg-primary text-white ring-4 ring-primary/20" 
                    : completedSteps.includes(step)
                      ? "bg-green-500 text-white"
                      : "bg-primary/10 text-primary/60"
                  }
                  ${(step <= activeStep || completedSteps.includes(step - 1)) ? "cursor-pointer hover:bg-primary/80 hover:text-white" : "cursor-not-allowed"}
                `}
                disabled={!(step <= activeStep || completedSteps.includes(step - 1))}
              >
                {completedSteps.includes(step) ? <CheckIcon className="h-5 w-5" /> : step}
              </button>
            ))}
          </div>
          <div className="h-2 w-full rounded-full bg-primary/10">
            <div 
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${(activeStep / 6) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-primary/60">
            <span>Service</span>
            <span>Basic Info</span>
            <span>Identity</span>
            <span>Privacy</span>
            <span>Accounts</span>
            <span>Legal</span>
          </div>
        </div>
        
        {/* Auto-save indicator */}
        <div className="flex items-center justify-end gap-2 text-sm text-primary/60 mb-4">
          <Save className="h-4 w-4" />
          <span>Auto-saving enabled</span>
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saveStatus === "success" && <span className="text-green-500">Saved</span>}
          {saveStatus === "error" && <span className="text-red-500">Error saving</span>}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Service Selection */}
        <OnboardingCard
          title="1. Welcome & Service Selection"
          isActive={activeStep === 1}
          isCompleted={completedSteps.includes(1)}
          isSaving={isSaving && activeStep === 1}
          saveStatus={activeStep === 1 ? saveStatus : "idle"}
          onClick={() => goToStep(1)}
        >
          <div className="space-y-4">
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
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.serviceType}
              >
                Next Step
              </Button>
            </div>
          </div>
        </OnboardingCard>
        
        {/* Step 2: Basic Information */}
        <OnboardingCard
          title="2. Basic Information"
          isActive={activeStep === 2}
          isCompleted={completedSteps.includes(2)}
          isSaving={isSaving && activeStep === 2}
          saveStatus={activeStep === 2 ? saveStatus : "idle"}
          onClick={() => goToStep(2)}
        >
          <div className="space-y-4">
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
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.legalFullName || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.location}
              >
                Next Step
              </Button>
            </div>
          </div>
        </OnboardingCard>
        
        {/* Step 3: Identity Verification */}
        <OnboardingCard
          title="3. Identity Verification"
          isActive={activeStep === 3}
          isCompleted={completedSteps.includes(3)}
          isSaving={isSaving && activeStep === 3}
          saveStatus={activeStep === 3 ? saveStatus : "idle"}
          onClick={() => goToStep(3)}
        >
          <div className="space-y-4">
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
                className="mt-1"
              />
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
              <h5 className="font-medium text-yellow-800 mb-2">Security Note:</h5>
              <p className="text-sm text-yellow-700">
                Your ID verification documents are securely stored with encryption and are only used for verification purposes. We follow strict data protection guidelines to ensure your information remains private.
              </p>
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
        </OnboardingCard>
        
        {/* Step 4: Privacy & Persona */}
        <OnboardingCard
          title="4. Privacy & Persona"
          isActive={activeStep === 4}
          isCompleted={completedSteps.includes(4)}
          isSaving={isSaving && activeStep === 4}
          saveStatus={activeStep === 4 ? saveStatus : "idle"}
          onClick={() => goToStep(4)}
        >
          <div className="space-y-4">
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
            
            {/* Service-specific fields */}
            {formData.serviceType === "onlyfans" || formData.serviceType === "both" ? (
              <OnlyFansFields
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            ) : null}
            
            {formData.serviceType === "rentmen" || formData.serviceType === "both" ? (
              <RentMenFields
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            ) : null}
            
            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        </OnboardingCard>
        
        {/* Step 5: Account Access & Social Media */}
        <OnboardingCard
          title="5. Account Access & Social Media"
          isActive={activeStep === 5}
          isCompleted={completedSteps.includes(5)}
          isSaving={isSaving && activeStep === 5}
          saveStatus={activeStep === 5 ? saveStatus : "idle"}
          onClick={() => goToStep(5)}
        >
          <AccountAccess
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            serviceType={formData.serviceType}
          />
          
          <CommunicationPreferences
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
          
          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous Step
            </Button>
            <Button type="button" onClick={nextStep}>
              Next Step
            </Button>
          </div>
        </OnboardingCard>
        
        {/* Step 6: Legal Agreements & Final Submission */}
        <OnboardingCard
          title="6. Legal Agreements & Final Submission"
          isActive={activeStep === 6}
          isCompleted={completedSteps.includes(6)}
          isSaving={isSaving && activeStep === 6}
          saveStatus={activeStep === 6 ? saveStatus : "idle"}
          onClick={() => goToStep(6)}
        >
          <div className="space-y-6">
            <LegalAgreements
              formData={formData}
              handleCheckboxChange={handleCheckboxChange}
            />
            
            {/* Summary of all provided information */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium text-primary mb-4">Summary of all provided information</h4>
              
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(step => (
                  <div key={step} className="flex justify-between items-center">
                    <span className="font-medium">
                      {step === 1 && "Service Selection"}
                      {step === 2 && "Basic Information"}
                      {step === 3 && "Identity Verification"}
                      {step === 4 && "Privacy & Persona"}
                      {step === 5 && "Account Access & Social Media"}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => goToStep(step)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button 
                type="submit"
                disabled={
                  isSaving || 
                  !formData.authorizeAccess || 
                  !formData.backupResponsibility || 
                  !formData.termsAgreement || 
                  !formData.confirmInformation
                }
                className="px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Onboarding Information"
                )}
              </Button>
            </div>
          </div>
        </OnboardingCard>
      </form>
    </div>
  );
}

