import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download } from "lucide-react";
import { WorkoutTemplateDB } from "@shared/schema";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
});

type TemplateForm = z.infer<typeof templateSchema>;

interface WorkoutTemplatesProps {
  onLoadTemplate: (template: WorkoutTemplateDB) => void;
  currentWorkout: any;
  onSaveAsTemplate: () => void;
}

export default function WorkoutTemplates({ onLoadTemplate, currentWorkout, onSaveAsTemplate }: WorkoutTemplatesProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: templates = [], isLoading } = useQuery<WorkoutTemplateDB[]>({
    queryKey: ["/api/workout-templates"],
  });

  const form = useForm<TemplateForm>({
    resolver: zodResolver(templateSchema),
    defaultValues: { name: "" },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/workout-templates", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-templates"] });
      toast({
        title: "Template saved",
        description: "Workout template created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/workout-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-templates"] });
      toast({
        title: "Template deleted",
        description: "Workout template removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TemplateForm) => {
    const templateData = {
      name: data.name,
      mobility_day: currentWorkout.mobility?.dayNumber || null,
      mobility_completion: currentWorkout.mobility?.completion || null,
      handstand_exercises: currentWorkout.handstand?.exercises || [],
      strength_day: currentWorkout.strength?.dayNumber || null,
      strength_exercises: currentWorkout.strength?.exercises || [],
    };
    createTemplateMutation.mutate(templateData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Workout Templates</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Save Current</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Workout Template</DialogTitle>
              <DialogDescription>
                Save your current workout as a template for quick reuse
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Morning Routine, Full Body" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTemplateMutation.isPending} className="flex-1">
                    Save Template
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading templates...</div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No templates saved yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.mobility_day && `Mobility Day ${template.mobility_day}`}
                  {template.mobility_day && template.strength_day && " • "}
                  {template.strength_day && `Strength Day ${template.strength_day}`}
                  {(template.handstand_exercises && template.handstand_exercises.length > 0) && ` • ${template.handstand_exercises.length} handstand exercises`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadTemplate(template)}
                    className="flex items-center space-x-1 flex-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Load</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTemplateMutation.mutate(template.id)}
                    disabled={deleteTemplateMutation.isPending}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}