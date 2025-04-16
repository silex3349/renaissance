
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Linkedin, Twitter, Instagram, Link, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: React.ReactNode;
}

const SocialLinks = () => {
  const { toast } = useToast();
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const [links, setLinks] = useState<SocialLink[]>([]);

  const platformOptions = [
    { name: 'GitHub', icon: <Github className="h-4 w-4" /> },
    { name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
    { name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
    { name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    { name: 'Other', icon: <Link className="h-4 w-4" /> },
  ];

  const handleAddLink = () => {
    if (!newPlatform || !newUrl) {
      toast({
        title: "Missing information",
        description: "Please provide both platform and URL.",
        variant: "destructive"
      });
      return;
    }

    const platform = platformOptions.find(p => p.name === newPlatform);
    
    setLinks([
      ...links,
      {
        id: Date.now().toString(),
        platform: newPlatform,
        url: newUrl,
        icon: platform?.icon || <Link className="h-4 w-4" />
      }
    ]);
    
    setIsAddingLink(false);
    setNewPlatform('');
    setNewUrl('');
    
    toast({
      title: "Link added",
      description: `Your ${newPlatform} profile has been added.`
    });
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast({
      title: "Link removed",
      description: "Social link has been removed."
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm mb-2 text-muted-foreground">Social Profiles</h3>
      
      {links.length > 0 ? (
        <div className="space-y-2">
          {links.map(link => (
            <div key={link.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
              <div className="flex items-center gap-2">
                {link.icon}
                <span>{link.platform}</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline truncate max-w-[150px]"
                >
                  {link.url.replace(/^https?:\/\//, '')}
                </a>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveLink(link.id)}
                  className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      
      {isAddingLink ? (
        <div className="space-y-3 border p-3 rounded-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <select 
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a platform</option>
              {platformOptions.map(option => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input 
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/profile"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddingLink(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleAddLink}
            >
              Add Link
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-1"
          onClick={() => setIsAddingLink(true)}
        >
          <Plus className="h-4 w-4" />
          Add Social Profile
        </Button>
      )}
    </div>
  );
};

export default SocialLinks;
