import React, { useState } from "react";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import { Button } from "@/ui/button";
import { PlusIcon } from "lucide-react";

interface AccountAccessProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  serviceType: string;
}

export function AccountAccess({
  formData,
  handleChange,
  handleCheckboxChange,
  serviceType,
}: AccountAccessProps) {
  const [showAdditionalPlatform, setShowAdditionalPlatform] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-primary">Account Access Options</h4>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="needHelpCreating"
            checked={formData.needHelpCreating || false}
            onCheckedChange={(checked) => handleCheckboxChange("needHelpCreating", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="needHelpCreating" className="text-sm">
            I need help creating new accounts
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="doNotNeedAccountManagement"
            checked={formData.doNotNeedAccountManagement || false}
            onCheckedChange={(checked) => handleCheckboxChange("doNotNeedAccountManagement", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="doNotNeedAccountManagement" className="text-sm">
            I do not need account management
          </Label>
        </div>
        
        <div className="mt-2 text-xs text-primary/60">
          (When "need help creating" is checked, login fields will be hidden)
        </div>
      </div>
      
      {/* Adult Platforms */}
      <div className="space-y-4">
        <h4 className="font-medium text-primary">ADULT PLATFORMS</h4>
        
        {/* OnlyFans */}
        {(serviceType === "onlyfans" || serviceType === "both") && (
          <div className="space-y-2 p-3 border border-border rounded-md">
            <h5 className="font-medium">OnlyFans</h5>
            
            <div>
              <Label htmlFor="ofUsername" className="block text-sm font-medium text-primary/80">
                Handle/Username:
              </Label>
              <Input
                id="ofUsername"
                name="ofUsername"
                value={formData.ofUsername || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ofEmail" className="block text-sm font-medium text-primary/80">
                Email:
              </Label>
              <Input
                id="ofEmail"
                name="ofEmail"
                type="email"
                value={formData.ofEmail || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ofPassword" className="block text-sm font-medium text-primary/80">
                Password:
              </Label>
              <Input
                id="ofPassword"
                name="ofPassword"
                type="password"
                value={formData.ofPassword || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        )}
        
        {/* Rent.Men */}
        {(serviceType === "rentmen" || serviceType === "both") && (
          <div className="space-y-2 p-3 border border-border rounded-md">
            <h5 className="font-medium">Rent.Men</h5>
            
            <div>
              <Label htmlFor="rmUsername" className="block text-sm font-medium text-primary/80">
                Handle/Username:
              </Label>
              <Input
                id="rmUsername"
                name="rmUsername"
                value={formData.rmUsername || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="rmEmail" className="block text-sm font-medium text-primary/80">
                Email:
              </Label>
              <Input
                id="rmEmail"
                name="rmEmail"
                type="email"
                value={formData.rmEmail || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="rmPassword" className="block text-sm font-medium text-primary/80">
                Password:
              </Label>
              <Input
                id="rmPassword"
                name="rmPassword"
                type="password"
                value={formData.rmPassword || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Social Media Platforms */}
      <div className="space-y-4">
        <h4 className="font-medium text-primary">SOCIAL MEDIA PLATFORMS</h4>
        
        {/* Instagram */}
        <div className="space-y-2 p-3 border border-border rounded-md">
          <h5 className="font-medium">Instagram</h5>
          
          <div>
            <Label htmlFor="igUsername" className="block text-sm font-medium text-primary/80">
              Handle/Username:
            </Label>
            <Input
              id="igUsername"
              name="igUsername"
              value={formData.igUsername || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="igEmail" className="block text-sm font-medium text-primary/80">
              Email:
            </Label>
            <Input
              id="igEmail"
              name="igEmail"
              type="email"
              value={formData.igEmail || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="igPassword" className="block text-sm font-medium text-primary/80">
              Password:
            </Label>
            <Input
              id="igPassword"
              name="igPassword"
              type="password"
              value={formData.igPassword || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* TikTok */}
        <div className="space-y-2 p-3 border border-border rounded-md">
          <h5 className="font-medium">TikTok</h5>
          
          <div>
            <Label htmlFor="ttUsername" className="block text-sm font-medium text-primary/80">
              Handle/Username:
            </Label>
            <Input
              id="ttUsername"
              name="ttUsername"
              value={formData.ttUsername || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ttEmail" className="block text-sm font-medium text-primary/80">
              Email:
            </Label>
            <Input
              id="ttEmail"
              name="ttEmail"
              type="email"
              value={formData.ttEmail || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="ttPassword" className="block text-sm font-medium text-primary/80">
              Password:
            </Label>
            <Input
              id="ttPassword"
              name="ttPassword"
              type="password"
              value={formData.ttPassword || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Twitter/X */}
        <div className="space-y-2 p-3 border border-border rounded-md">
          <h5 className="font-medium">Twitter/X</h5>
          
          <div>
            <Label htmlFor="twUsername" className="block text-sm font-medium text-primary/80">
              Handle/Username:
            </Label>
            <Input
              id="twUsername"
              name="twUsername"
              value={formData.twUsername || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="twEmail" className="block text-sm font-medium text-primary/80">
              Email:
            </Label>
            <Input
              id="twEmail"
              name="twEmail"
              type="email"
              value={formData.twEmail || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="twPassword" className="block text-sm font-medium text-primary/80">
              Password:
            </Label>
            <Input
              id="twPassword"
              name="twPassword"
              type="password"
              value={formData.twPassword || ""}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Additional Platform Button */}
        {!showAdditionalPlatform ? (
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-1"
            onClick={() => setShowAdditionalPlatform(true)}
          >
            <PlusIcon className="h-4 w-4" />
            Add Additional Platform
          </Button>
        ) : (
          <div className="space-y-2 p-3 border border-border rounded-md">
            <div>
              <Label htmlFor="additionalPlatformName" className="block text-sm font-medium text-primary/80">
                Platform Name:
              </Label>
              <Input
                id="additionalPlatformName"
                name="additionalPlatformName"
                value={formData.additionalPlatformName || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="additionalPlatformUsername" className="block text-sm font-medium text-primary/80">
                Handle/Username:
              </Label>
              <Input
                id="additionalPlatformUsername"
                name="additionalPlatformUsername"
                value={formData.additionalPlatformUsername || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="additionalPlatformEmail" className="block text-sm font-medium text-primary/80">
                Email:
              </Label>
              <Input
                id="additionalPlatformEmail"
                name="additionalPlatformEmail"
                type="email"
                value={formData.additionalPlatformEmail || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="additionalPlatformPassword" className="block text-sm font-medium text-primary/80">
                Password:
              </Label>
              <Input
                id="additionalPlatformPassword"
                name="additionalPlatformPassword"
                type="password"
                value={formData.additionalPlatformPassword || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h5 className="font-medium text-yellow-800 mb-2">Security Note:</h5>
        <p className="text-sm text-yellow-700">
          Credentials are securely handled and encrypted. We implement industry-standard security measures to protect your account information.
        </p>
      </div>
    </div>
  );
}

