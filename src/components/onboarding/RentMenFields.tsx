import React from "react";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Checkbox } from "@/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

interface RentMenFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export function RentMenFields({
  formData,
  handleChange,
  handleSelectChange,
  handleCheckboxChange,
}: RentMenFieldsProps) {
  return (
    <div className="space-y-4 mt-4 p-4 bg-primary/5 rounded-lg">
      <h4 className="font-medium text-primary">Rent.Men Specific Information</h4>
      
      <div>
        <Label htmlFor="rmProfileUrl" className="block text-sm font-medium text-primary/80">
          Current Rent.Men profile URL (if any)
        </Label>
        <Input
          id="rmProfileUrl"
          name="rmProfileUrl"
          value={formData.rmProfileUrl || ""}
          onChange={handleChange}
          placeholder="https://rent.men/your-profile"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="rmPrimaryServices" className="block text-sm font-medium text-primary/80">
          Describe the primary services you offer <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="rmPrimaryServices"
          name="rmPrimaryServices"
          value={formData.rmPrimaryServices || ""}
          onChange={handleChange}
          placeholder="e.g., massage types, companionship focus"
          className="mt-1"
          rows={3}
          required
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Standard rates and durations <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmRateHourly"
              checked={formData.rmRateHourly || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmRateHourly", checked as boolean)}
            />
            <Label htmlFor="rmRateHourly">Hourly</Label>
            {formData.rmRateHourly && (
              <Input
                name="rmRateHourlyAmount"
                value={formData.rmRateHourlyAmount || ""}
                onChange={handleChange}
                placeholder="Amount"
                className="w-24 ml-2"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmRateOvernight"
              checked={formData.rmRateOvernight || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmRateOvernight", checked as boolean)}
            />
            <Label htmlFor="rmRateOvernight">Overnight</Label>
            {formData.rmRateOvernight && (
              <Input
                name="rmRateOvernightAmount"
                value={formData.rmRateOvernightAmount || ""}
                onChange={handleChange}
                placeholder="Amount"
                className="w-24 ml-2"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmRateTravel"
              checked={formData.rmRateTravel || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmRateTravel", checked as boolean)}
            />
            <Label htmlFor="rmRateTravel">Travel</Label>
            {formData.rmRateTravel && (
              <Input
                name="rmRateTravelAmount"
                value={formData.rmRateTravelAmount || ""}
                onChange={handleChange}
                placeholder="Amount"
                className="w-24 ml-2"
              />
            )}
          </div>
        </div>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          General availability (days/times)
        </Label>
        <Textarea
          id="rmAvailability"
          name="rmAvailability"
          value={formData.rmAvailability || ""}
          onChange={handleChange}
          placeholder="e.g., Weekdays 10am-8pm, Weekends by appointment"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Geographic availability (cities/regions)
        </Label>
        <Textarea
          id="rmGeographicAvailability"
          name="rmGeographicAvailability"
          value={formData.rmGeographicAvailability || ""}
          onChange={handleChange}
          placeholder="e.g., Manhattan, Brooklyn, Queens"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id="rmWillingToTravel"
            checked={formData.rmWillingToTravel || false}
            onCheckedChange={(checked) => handleCheckboxChange("rmWillingToTravel", checked as boolean)}
          />
          <Label htmlFor="rmWillingToTravel" className="text-sm font-medium text-primary/80">
            Are you willing to travel?
          </Label>
        </div>
        
        {formData.rmWillingToTravel && (
          <div className="ml-6 mt-2">
            <Label htmlFor="rmTravelRegions" className="block text-sm font-medium text-primary/80">
              If yes: specify regions/countries
            </Label>
            <Textarea
              id="rmTravelRegions"
              name="rmTravelRegions"
              value={formData.rmTravelRegions || ""}
              onChange={handleChange}
              placeholder="Enter regions or countries you're willing to travel to"
              className="mt-1"
              rows={2}
            />
          </div>
        )}
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Do you offer Incall, Outcall, or both?
        </Label>
        <RadioGroup
          value={formData.rmCallType || ""}
          onValueChange={(value) => handleSelectChange("rmCallType", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="incall" id="incall" />
            <Label htmlFor="incall">Incall</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outcall" id="outcall" />
            <Label htmlFor="outcall">Outcall</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both-calls" id="both-calls" />
            <Label htmlFor="both-calls">Both</Label>
          </div>
        </RadioGroup>
      </div>
      
      {(formData.rmCallType === "incall" || formData.rmCallType === "both-calls") && (
        <div>
          <Label htmlFor="rmIncallLocation" className="block text-sm font-medium text-primary/80">
            If Incall: general area/type of location
          </Label>
          <Input
            id="rmIncallLocation"
            name="rmIncallLocation"
            value={formData.rmIncallLocation || ""}
            onChange={handleChange}
            placeholder="e.g., Midtown apartment, hotel"
            className="mt-1"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="rmClientPreferences" className="block text-sm font-medium text-primary/80">
          What kind of clients do you not want to deal with?
        </Label>
        <Textarea
          id="rmClientPreferences"
          name="rmClientPreferences"
          value={formData.rmClientPreferences || ""}
          onChange={handleChange}
          placeholder="Any client types you prefer not to work with"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="rmServiceLimits" className="block text-sm font-medium text-primary/80">
          Hard limits regarding services or activities? <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="rmServiceLimits"
          name="rmServiceLimits"
          value={formData.rmServiceLimits || ""}
          onChange={handleChange}
          placeholder="Services or activities you will not provide"
          className="mt-1"
          rows={2}
          required
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Screening preferences (ID, video call, deposit required?)
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmScreeningID"
              checked={formData.rmScreeningID || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmScreeningID", checked as boolean)}
            />
            <Label htmlFor="rmScreeningID">ID verification</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmScreeningVideoCall"
              checked={formData.rmScreeningVideoCall || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmScreeningVideoCall", checked as boolean)}
            />
            <Label htmlFor="rmScreeningVideoCall">Video call</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmScreeningDeposit"
              checked={formData.rmScreeningDeposit || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmScreeningDeposit", checked as boolean)}
            />
            <Label htmlFor="rmScreeningDeposit">Deposit required</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rmScreeningOther"
              checked={formData.rmScreeningOther || false}
              onCheckedChange={(checked) => handleCheckboxChange("rmScreeningOther", checked as boolean)}
            />
            <Label htmlFor="rmScreeningOther">Other</Label>
          </div>
          
          {formData.rmScreeningOther && (
            <Input
              name="rmScreeningOtherText"
              value={formData.rmScreeningOtherText || ""}
              onChange={handleChange}
              placeholder="Please specify"
              className="mt-1 ml-6"
            />
          )}
        </div>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Approval process for bookings:
        </Label>
        <RadioGroup
          value={formData.rmApprovalProcess || ""}
          onValueChange={(value) => handleSelectChange("rmApprovalProcess", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auto-confirm" id="auto-confirm" />
            <Label htmlFor="auto-confirm">Auto-confirm</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual-approve" id="manual-approve" />
            <Label htmlFor="manual-approve">I must approve each booking</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Repeat clients allowed?
        </Label>
        <RadioGroup
          value={formData.rmRepeatClients || ""}
          onValueChange={(value) => handleSelectChange("rmRepeatClients", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="repeat-yes" />
            <Label htmlFor="repeat-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="repeat-no" />
            <Label htmlFor="repeat-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="case-by-case" id="repeat-case" />
            <Label htmlFor="repeat-case">Case-by-case</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="rmPaymentMethod" className="block text-sm font-medium text-primary/80">
          Preferred payment method for bookings
        </Label>
        <Input
          id="rmPaymentMethod"
          name="rmPaymentMethod"
          value={formData.rmPaymentMethod || ""}
          onChange={handleChange}
          placeholder="e.g., Cash, Venmo, CashApp"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="rmDepositRequirements" className="block text-sm font-medium text-primary/80">
          Upfront deposit requirements for new clients?
        </Label>
        <Input
          id="rmDepositRequirements"
          name="rmDepositRequirements"
          value={formData.rmDepositRequirements || ""}
          onChange={handleChange}
          placeholder="e.g., 25% deposit required"
          className="mt-1"
        />
      </div>
    </div>
  );
}

