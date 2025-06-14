import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Camera } from "lucide-react";
import { ProgressPhotoDB } from "@shared/schema";

const photoSchema = z.object({
  photo_url: z.string().url("Valid URL required"),
  caption: z.string().optional(),
  weight: z.string().optional(),
});

type PhotoForm = z.infer<typeof photoSchema>;

export default function ProgressPhotos() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: photos = [], isLoading } = useQuery<ProgressPhotoDB[]>({
    queryKey: ["/api/progress-photos"],
  });

  const form = useForm<PhotoForm>({
    resolver: zodResolver(photoSchema),
    defaultValues: { photo_url: "", caption: "", weight: "" },
  });

  const createPhotoMutation = useMutation({
    mutationFn: async (data: PhotoForm) => {
      const res = await apiRequest("POST", "/api/progress-photos", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress-photos"] });
      toast({
        title: "Photo added",
        description: "Progress photo saved successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save photo",
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/progress-photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress-photos"] });
      toast({
        title: "Photo deleted",
        description: "Progress photo removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PhotoForm) => {
    createPhotoMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Progress Photos</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>Add Photo</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Progress Photo</DialogTitle>
              <DialogDescription>
                Track your fitness journey with progress photos
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="photo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your progress..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="70kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createPhotoMutation.isPending} className="flex-1">
                    Add Photo
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading photos...</div>
      ) : photos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No progress photos yet</p>
              <p className="text-sm text-muted-foreground">Start tracking your fitness journey</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={photo.photo_url}
                  alt={photo.caption || "Progress photo"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/api/placeholder/300/300";
                  }}
                />
              </div>
              <CardContent className="p-4">
                {photo.caption && (
                  <p className="text-sm text-muted-foreground mb-2">{photo.caption}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {photo.weight && <span>Weight: {photo.weight}</span>}
                    {photo.weight && <span className="mx-2">•</span>}
                    <span>{new Date(photo.taken_at).toLocaleDateString()}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePhotoMutation.mutate(photo.id)}
                    disabled={deletePhotoMutation.isPending}
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