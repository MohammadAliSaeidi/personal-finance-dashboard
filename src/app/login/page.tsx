"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import credentialsLogin from "@/features/Authentication/services/credentialsLogin";
import ILoginCredentials from "@/types/LoginCredentials.type";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TypographyH1 from "@/components/ui/Typography/TypographyH1";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	username: z
		.string()
		.min(6, {
			message: "Username must be at least 6 characters.",
		})
		.max(30, { message: "Username must be at most 30 characters" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(20, { message: "Password must be at most 20 characters" })
		.regex(/^[\sa-zA-Z\d!@#$%^&*()-_=+\[\]\{\};:'",<\.>/\?`\~\|]{8,20}$/, { message: "wrong password pattern" }),
});

export default function Login() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const loginMutation = useMutation({
		mutationKey: ["login"],
		mutationFn: (credentials: ILoginCredentials) => credentialsLogin(credentials),
		onSuccess: () => onLoginSuccess(),
	});

	const onLoginSuccess = () => {
		router.replace("/");
	};

	const handleOnLoginSubmit = (credentials: ILoginCredentials) => {
		loginMutation.mutate(credentials);
	};

	return (
		<>
			<section className="flex flex-col gap-10 items-stretch justify-center max-w-sm h-screen mx-auto">
				<TypographyH1>Login</TypographyH1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleOnLoginSubmit)}
						className="flex flex-col gap-6 justify-center"
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input {...field} />
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Login</Button>
					</form>
				</Form>
			</section>
		</>
	);
}
