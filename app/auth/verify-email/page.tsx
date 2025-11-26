import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We've sent you a confirmation link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              Please check your email and click the confirmation link to activate
              your account. You can close this page once you've confirmed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
