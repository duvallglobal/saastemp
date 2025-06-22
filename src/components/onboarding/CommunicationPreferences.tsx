import React from "react";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Input } from "@/ui/input";

interface CommunicationPreferencesProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function CommunicationPreferences({
  formData,
  handleChange,
  handleSelectChange,
}: CommunicationPreferencesProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-primary">Communication & Approvals</h4>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          How would you like to receive updates, approvals, or alerts?
        </Label>
        <RadioGroup
          value={formData.communicationMethod || ""}
          onValueChange={(value) => handleSelectChange("communicationMethod", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="comm-email" />
            <Label htmlFor="comm-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sms" id="comm-sms" />
            <Label htmlFor="comm-sms">SMS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portal" id="comm-portal" />
            <Label htmlFor="comm-portal">Portal</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Best contact method:
        </Label>
        <RadioGroup
          value={formData.bestContactMethod || ""}
          onValueChange={(value) => handleSelectChange("bestContactMethod", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="best-email" />
            <Label htmlFor="best-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="best-phone" />
            <Label htmlFor="best-phone">Phone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="best-text" />
            <Label htmlFor="best-text">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="whatsapp" id="best-whatsapp" />
            <Label htmlFor="best-whatsapp">WhatsApp</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="best-other" />
            <Label htmlFor="best-other">Other</Label>
          </div>
        </RadioGroup>
        
        {formData.bestContactMethod === "other" && (
          <Input
            name="bestContactMethodOther"
            value={formData.bestContactMethodOther || ""}
            onChange={handleChange}
            placeholder="Please specify"
            className="mt-2"
          />
        )}
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Special safety or privacy requirements for bookings?
        </Label>
        <Input
          id="safetyRequirements"
          name="safetyRequirements"
          value={formData.safetyRequirements || ""}
          onChange={handleChange}
          placeholder="Any special requirements"
          className="mt-1"
        />
      </div>
    </div>
  );
}

