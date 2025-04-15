
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Interest } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { INTERESTS } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Lock, Users, ArrowLeft, Tag, Info } from "lucide-react";
import InterestSelector from "@/components/profile/InterestSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormValues {
  name: string;
  description: string;
  isPrivate: boolean;
  interests: string[];
  maxMembers?: number;
}

const CreateGroupDialog = ({ open, onOpenChange }: CreateGroupDialogProps) => {
  const { user, createGroup } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      interests: [],
      maxMembers: undefined
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // This would call an API in a real app
    setTimeout(() => {
      createGroup({
        name: data.name,
        description: data.description,
        isPrivate: data.isPrivate,
        interestIds: data.interests,
      });
      
      // Show success message
      toast({
        title: "Group created",
        description: `Your group "${data.name}" has been created successfully.`,
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      setIsSubmitting(false);
    }, 800);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 h-[85vh] max-h-[700px] overflow-hidden flex flex-col">
        <div className="flex items-center p-4 border-b">
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </DialogClose>
          <DialogTitle className="text-xl font-bold ml-4">Create Group</DialogTitle>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Group name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Group Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter group name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What is this group about?"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <FormField
                    control={form.control}
                    name="interests"
                    rules={{ required: "Select at least one interest" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Interests
                        </FormLabel>
                        <FormControl>
                          <div className="bg-background rounded-md p-2 border">
                            <InterestSelector
                              selectedInterests={field.value}
                              onInterestsChange={field.onChange}
                              availableInterests={INTERESTS}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Select interests relevant to your group
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="maxMembers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Maximum Members
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="Leave empty for unlimited" 
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === "" ? undefined : Number(value));
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Limit the number of people who can join
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <Label className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Private Group
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Private groups require admin approval to join
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Group..." : "Create Group"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
