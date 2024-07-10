"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import credentialsLogin from "@/features/Authentication/services/credentialsLogin";
import ILoginCredentials from "@/types/LoginCredentials.type";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TypographyH1 from "@/components/ui/Typography/TypographyH1";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/ui/Loading/Loading";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { formSchema, formSchemaType } from "@/features/Authentication/formSchema";

export default function Login() {
	const { toast } = useToast();
	const router = useRouter();
	const form = useForm<formSchemaType>({
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
		onError: (error) => onLoginError(error),
	});

	const onLoginSuccess = () => {
		router.replace("/");
	};

	const onLoginError = (error: any) => {
		let title = "";
		let description = "";
		if (error.response.status === 401) {
			title = "Wrong username or password";
			description = "maybe you don't have an account";
		} else {
			title = "Login failed";
			description = "Please check your internet connection and try again";
		}

		toast({
			title: title,
			description: description,
			duration: 7000,
			variant: "destructive",
		});
	};

	const handleOnLoginSubmit = (credentials: ILoginCredentials) => {
		loginMutation.mutate(credentials);
	};

	return (
		<>
			<section
				className={`flex flex-col gap-10 items-stretch justify-center max-w-sm h-screen mx-auto  ${
					loginMutation.isPending ? "pointer-events-none opacity-40" : ""
				}`}
			>
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
						<Button disabled={loginMutation.isPending} type="submit">
							Login
							{loginMutation.isPending && <Loading className="!border-r-white ml-2" />}
						</Button>
						<div className="text-with-lines-on-side text-[var(--color-label-tertiary)]">or</div>
						<div className="flex justify-start items-center self-center">
							<span>don&#39;t you have an account?</span>
							<Link href={"/signup"}>
								<Button type="button" variant={"link"} size={"sm"} className="text-blue-500">
									Register one
								</Button>
							</Link>
						</div>
					</form>
				</Form>
			</section>
			<Toaster />
		</>
	);
}
