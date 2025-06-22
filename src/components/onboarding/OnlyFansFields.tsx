import React from "react";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Checkbox } from "@/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

interface OnlyFansFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export function OnlyFansFields({
  formData,
  handleChange,
  handleSelectChange,
  handleCheckboxChange,
}: OnlyFansFieldsProps) {
  return (
    <div className="space-y-4 mt-4 p-4 bg-primary/5 rounded-lg">
      <h4 className="font-medium text-primary">OnlyFans Specific Information</h4>
      
      <div>
        <Label htmlFor="ofCreatorHandle" className="block text-sm font-medium text-primary/80">
          Current OnlyFans handle or brand name (if any)
        </Label>
        <Input
          id="ofCreatorHandle"
          name="ofCreatorHandle"
          value={formData.ofCreatorHandle || ""}
          onChange={handleChange}
          placeholder="Your OnlyFans handle"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="ofExperience" className="block text-sm font-medium text-primary/80">
          How long have you been active on OnlyFans?
        </Label>
        <Select
          value={formData.ofExperience || ""}
          onValueChange={(value) => handleSelectChange("ofExperience", value)}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New to OnlyFans</SelectItem>
            <SelectItem value="less-than-6mo">Less than 6 months</SelectItem>
            <SelectItem value="6mo-1yr">6 months to 1 year</SelectItem>
            <SelectItem value="1-2yrs">1-2 years</SelectItem>
            <SelectItem value="2-plus">2+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          What are your primary objectives for this service?
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofObjectiveGrowth"
              checked={formData.ofObjectiveGrowth || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofObjectiveGrowth", checked as boolean)}
            />
            <Label htmlFor="ofObjectiveGrowth">Subscriber growth</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofObjectiveBrand"
              checked={formData.ofObjectiveBrand || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofObjectiveBrand", checked as boolean)}
            />
            <Label htmlFor="ofObjectiveBrand">Brand visibility</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofObjectiveDMs"
              checked={formData.ofObjectiveDMs || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofObjectiveDMs", checked as boolean)}
            />
            <Label htmlFor="ofObjectiveDMs">More DMs/sales</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofObjectiveOther"
              checked={formData.ofObjectiveOther || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofObjectiveOther", checked as boolean)}
            />
            <Label htmlFor="ofObjectiveOther">Other</Label>
          </div>
          
          {formData.ofObjectiveOther && (
            <Input
              name="ofObjectiveOtherText"
              value={formData.ofObjectiveOtherText || ""}
              onChange={handleChange}
              placeholder="Please specify"
              className="mt-1 ml-6"
            />
          )}
        </div>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          What types of content do you produce or plan to produce? <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofContentPhotos"
              checked={formData.ofContentPhotos || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofContentPhotos", checked as boolean)}
            />
            <Label htmlFor="ofContentPhotos">Photos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofContentVideos"
              checked={formData.ofContentVideos || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofContentVideos", checked as boolean)}
            />
            <Label htmlFor="ofContentVideos">Videos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofContentPPV"
              checked={formData.ofContentPPV || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofContentPPV", checked as boolean)}
            />
            <Label htmlFor="ofContentPPV">PPV</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofContentCustom"
              checked={formData.ofContentCustom || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofContentCustom", checked as boolean)}
            />
            <Label htmlFor="ofContentCustom">Custom requests</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofContentLive"
              checked={formData.ofContentLive || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofContentLive", checked as boolean)}
            />
            <Label htmlFor="ofContentLive">Live streams</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ofContentOther"
              checked={formData.ofContentOther || false}
              onCheckedChange={(checked) => handleCheckboxChange("ofContentOther", checked as boolean)}
            />
            <Label htmlFor="ofContentOther">Other</Label>
          </div>
          
          {formData.ofContentOther && (
            <Input
              name="ofContentOtherText"
              value={formData.ofContentOtherText || ""}
              onChange={handleChange}
              placeholder="Please specify"
              className="mt-1 ml-6"
            />
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="ofContentSchedule" className="block text-sm font-medium text-primary/80">
          Content creation schedule/frequency
        </Label>
        <Input
          id="ofContentSchedule"
          name="ofContentSchedule"
          value={formData.ofContentSchedule || ""}
          onChange={handleChange}
          placeholder="How often do you create content?"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="ofTargetAudience" className="block text-sm font-medium text-primary/80">
          Describe your target audience or niche
        </Label>
        <Textarea
          id="ofTargetAudience"
          name="ofTargetAudience"
          value={formData.ofTargetAudience || ""}
          onChange={handleChange}
          placeholder="Describe your target audience"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="ofPrimaryGoals" className="block text-sm font-medium text-primary/80">
          Primary goals for your OnlyFans page <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="ofPrimaryGoals"
          name="ofPrimaryGoals"
          value={formData.ofPrimaryGoals || ""}
          onChange={handleChange}
          placeholder="What are your main goals?"
          className="mt-1"
          rows={2}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="ofContentUnwilling" className="block text-sm font-medium text-primary/80">
          Content types you are unwilling to produce?
        </Label>
        <Textarea
          id="ofContentUnwilling"
          name="ofContentUnwilling"
          value={formData.ofContentUnwilling || ""}
          onChange={handleChange}
          placeholder="Any content types you don't want to create"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="ofBrandDescription" className="block text-sm font-medium text-primary/80">
          How would you describe your brand in 3 words?
        </Label>
        <Input
          id="ofBrandDescription"
          name="ofBrandDescription"
          value={formData.ofBrandDescription || ""}
          onChange={handleChange}
          placeholder="Three words to describe your brand"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="ofDoNotSay" className="block text-sm font-medium text-primary/80">
          Do you have any do-not-say terms or triggers?
        </Label>
        <Textarea
          id="ofDoNotSay"
          name="ofDoNotSay"
          value={formData.ofDoNotSay || ""}
          onChange={handleChange}
          placeholder="Terms or topics to avoid"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-primary/80 mb-2">
          Who is responsible for content editing?
        </Label>
        <RadioGroup
          value={formData.ofContentEditor || "client"}
          onValueChange={(value) => handleSelectChange("ofContentEditor", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="client" id="client-edit" />
            <Label htmlFor="client-edit">Client</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="managethefans" id="mtf-edit" />
            <Label htmlFor="mtf-edit">ManageTheFans</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="collaborative" id="collab-edit" />
            <Label htmlFor="collab-edit">Collaborative</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

