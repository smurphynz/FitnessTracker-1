import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Loader2, ArrowLeft, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const preferencesSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
  show_mobility: z.boolean(),
  show_handstand: z.boolean(),
  app_title: z.string().optional(),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      display_name: user?.display_name || "",
      show_mobility: user?.show_mobility ?? true,
      show_handstand: user?.show_handstand ?? true,
      app_title: user?.app_title || "",
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: PreferencesForm) => {
      const res = await apiRequest("PATCH", "/api/user/preferences", preferences);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PreferencesForm) => {
    updatePreferencesMutation.mutate(data);
  };

  const getAppTitle = () => {
    const customTitle = form.watch("app_title");
    const displayName = form.watch("display_name");
    
    if (customTitle && customTitle.trim()) {
      return customTitle;
    }
    return `${displayName}'s Fitness Tracker`;
  };

  return (
    <div className="container mx-auto px-4 pt-6 pb-24 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
        <div className="w-16"></div> {/* Spacer for alignment */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personalization</CardTitle>
          <CardDescription>
            Customize your fitness tracking experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Display Name */}
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* App Title Preview */}
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-sm font-medium">App Title Preview</Label>
                <p className="text-lg font-bold text-primary mt-1">{getAppTitle()}</p>
              </div>

              {/* Custom App Title */}
              <FormField
                control={form.control}
                name="app_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom App Title (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Leave blank for default" />
                    </FormControl>
                    <FormDescription>
                      Leave blank to use "{form.watch("display_name")}'s Fitness Tracker"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Section Toggles */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Workout Sections</Label>
                
                <FormField
                  control={form.control}
                  name="show_mobility"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                      <div>
                        <FormLabel className="font-medium">Mobility Training</FormLabel>
                        <FormDescription>
                          Show Calimove mobility exercises and day tracking
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="show_handstand"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 p-3 border rounded-lg">
                      <div>
                        <FormLabel className="font-medium">Handstand Practice</FormLabel>
                        <FormDescription>
                          Show handstand exercises and progression tracking
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={updatePreferencesMutation.isPending}
              >
                {updatePreferencesMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}