
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Twitter, Instagram, Linkedin, Globe } from "lucide-react";

// Social profile type
interface SocialProfile {
  id: string;
  platform: "twitter" | "instagram" | "linkedin" | "website";
  url: string;
}

const platformIcons = {
  twitter: <Twitter className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

const platformLabels = {
  twitter: "Twitter Profile URL",
  instagram: "Instagram Profile URL",
  linkedin: "LinkedIn Profile URL",
  website: "Website URL",
};

interface SocialProfilesSectionProps {
  initialProfiles: SocialProfile[];
  onChange: (profiles: SocialProfile[]) => void;
}

const SocialProfilesSection = ({ initialProfiles, onChange }: SocialProfilesSectionProps) => {
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>(initialProfiles);

  const addSocialProfile = () => {
    const newProfiles: SocialProfile[] = [
      ...socialProfiles, 
      { 
        id: Date.now().toString(), 
        platform: "website", 
        url: "" 
      }
    ];
    setSocialProfiles(newProfiles);
    onChange(newProfiles);
  };

  const updateSocialProfile = (id: string, field: keyof SocialProfile, value: any) => {
    const updatedProfiles = socialProfiles.map(profile => 
      profile.id === id ? { ...profile, [field]: value } : profile
    );
    setSocialProfiles(updatedProfiles);
    onChange(updatedProfiles);
  };

  const removeSocialProfile = (id: string) => {
    const updatedProfiles = socialProfiles.filter(profile => profile.id !== id);
    setSocialProfiles(updatedProfiles);
    onChange(updatedProfiles);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-primary">Social Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your social media accounts to share them on your profile.
          </p>
          
          {socialProfiles.map((profile) => (
            <div key={profile.id} className="space-y-3 p-3 border rounded-lg hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted rounded-full p-1.5">
                    {platformIcons[profile.platform]}
                  </div>
                  <select
                    value={profile.platform}
                    onChange={(e) => updateSocialProfile(
                      profile.id, 
                      "platform", 
                      e.target.value as SocialProfile["platform"]
                    )}
                    className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  >
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="website">Website</option>
                  </select>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialProfile(profile.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Input
                value={profile.url}
                onChange={(e) => updateSocialProfile(profile.id, "url", e.target.value)}
                placeholder={platformLabels[profile.platform]}
                className="focus-visible:ring-primary/30 focus-visible:border-primary"
              />
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addSocialProfile}
            className="mt-2 w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Social Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialProfilesSection;
