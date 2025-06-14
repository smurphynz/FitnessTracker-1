import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const { user } = useAuth();
  const { toast } = useToast();
  const currentTheme = user?.theme || "light";

  const toggleThemeMutation = useMutation({
    mutationFn: async (newTheme: string) => {
      const res = await apiRequest("PATCH", "/api/user/preferences", { theme: newTheme });
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      document.documentElement.classList.toggle("dark", updatedUser.theme === "dark");
      toast({
        title: "Theme updated",
        description: `Switched to ${updatedUser.theme} mode`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to update theme",
        variant: "destructive",
      });
    },
  });

  const handleToggle = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    toggleThemeMutation.mutate(newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={toggleThemeMutation.isPending}
      className="bg-forest-800 bg-opacity-70 backdrop-blur-sm border border-[#FFEB3B]/10 hover:bg-forest-700"
    >
      {currentTheme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}