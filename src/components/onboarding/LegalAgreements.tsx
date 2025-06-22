import React from "react";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";

interface LegalAgreementsProps {
  formData: any;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export function LegalAgreements({
  formData,
  handleCheckboxChange,
}: LegalAgreementsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-primary">Legal Agreements & Consent</h4>
      <p className="text-sm text-primary/60">
        Please confirm the following to complete your onboarding:
      </p>
      
      <div className="space-y-4 mt-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="authorizeAccess"
            checked={formData.authorizeAccess || false}
            onCheckedChange={(checked) => handleCheckboxChange("authorizeAccess", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="authorizeAccess" className="text-sm">
            I authorize ManageTheFans to access, manage, and upload content to all profiles listed above <span className="text-red-500">*</span>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="backupResponsibility"
            checked={formData.backupResponsibility || false}
            onCheckedChange={(checked) => handleCheckboxChange("backupResponsibility", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="backupResponsibility" className="text-sm">
            I understand that I am responsible for keeping backup access to my accounts <span className="text-red-500">*</span>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="termsAgreement"
            checked={formData.termsAgreement || false}
            onCheckedChange={(checked) => handleCheckboxChange("termsAgreement", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="termsAgreement" className="text-sm">
            I agree to the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="confirmInformation"
            checked={formData.confirmInformation || false}
            onCheckedChange={(checked) => handleCheckboxChange("confirmInformation", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="confirmInformation" className="text-sm">
            I confirm that all information provided is accurate and complete <span className="text-red-500">*</span>
          </Label>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <h5 className="font-medium text-primary mb-2">Important Notes:</h5>
        <ul className="list-disc list-inside space-y-2 text-sm text-primary/80">
          <li>Clear explanations: Sensitive questions include rationale, building trust</li>
          <li>Grouped, themed sections: Improves flow and reduces perceived length</li>
          <li>Optional uploads and open-text fields: Allow flexibility for unique needs</li>
          <li>Security notes: Reassure clients about data handling for credentials and ID uploads</li>
        </ul>
      </div>
    </div>
  );
}

