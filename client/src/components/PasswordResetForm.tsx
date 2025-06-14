import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const passwordResetSchema = z.object({
  email: z.string().email("Valid email required"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type PasswordResetForm = z.infer<typeof passwordResetSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface PasswordResetFormProps {
  onBack: () => void;
  onTokenReceived: (token: string) => void;
}

export default function PasswordResetForm({ onBack, onTokenReceived }: PasswordResetFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [resetToken, setResetToken] = useState("");

  const emailForm = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: "", newPassword: "" },
  });

  const requestResetMutation = useMutation({
    mutationFn: async (data: PasswordResetForm) => {
      const res = await apiRequest("POST", "/api/password-reset-request", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reset link sent",
        description: "Check your email for reset instructions",
      });
      if (data.resetToken) {
        setResetToken(data.resetToken);
        resetForm.setValue("token", data.resetToken);
        setStep("reset");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reset email",
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      const res = await apiRequest("POST", "/api/password-reset", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
      });
      onBack();
    },
    onError: () => {
      toast({
        title: "Reset failed",
        description: "Invalid or expired token",
        variant: "destructive",
      });
    },
  });

  if (step === "email") {
    return (
      <div className="space-y-4">
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit((data) => requestResetMutation.mutate(data))} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Back to Login
              </Button>
              <Button
                type="submit"
                disabled={requestResetMutation.isPending}
                className="flex-1"
              >
                {requestResetMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Reset Link
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit((data) => resetPasswordMutation.mutate(data))} className="space-y-4">
          <FormField
            control={resetForm.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reset Token</FormLabel>
                <FormControl>
                  <Input placeholder="Enter reset token" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={resetForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back to Login
            </Button>
            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="flex-1"
            >
              {resetPasswordMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}