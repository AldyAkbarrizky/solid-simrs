"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormData } from "@/schemas/login";
import { setCookie } from "cookies-next";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    // DEMO LOGIN (FOR SIMULATION ONLY)
    // setTimeout(() => {
    //   if (data.username === "admin" && data.password === "admin123") {
    //     setCookie("isLoggedIn", "true", { path: "/" });

    //     localStorage.setItem(
    //       "userInfo",
    //       JSON.stringify({
    //         name: "Dr. Admin",
    //         email: "admin@rumahsakit.com",
    //         role: "Administrator",
    //       })
    //     );

    //     router.push("/");
    //   } else {
    //     setError(
    //       "Username atau password salah. Gunakan admin/admin123 untuk demo."
    //     );
    //   }
    //   setIsLoading(false);
    // }, 1000);

    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data.data;
      login(token, user);
      router.push("/");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Terjadi kesalahan pada server.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <Card className="w-full max-w-md shadow-card border-border bg-card/95 backdrop-blur-sm py-6">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-medical">
            <Stethoscope className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              SIMRS Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sistem Informasi Manajemen Rumah Sakit
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Username / Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan username atau email"
                        className="bg-input border-border focus:ring-primary focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          className="bg-input border-border focus:ring-primary focus:border-primary pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 shadow-medical transition-all duration-300"
              >
                {isLoading ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p className="font-medium">Demo Credentials:</p>
            <p>
              Username:{" "}
              <code className="bg-card px-1 py-0.5 rounded">admin</code>
            </p>
            <p>
              Password:{" "}
              <code className="bg-card px-1 py-0.5 rounded">admin123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
