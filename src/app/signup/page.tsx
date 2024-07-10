"use client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/Loading/Loading";
import TypographyH1 from "@/components/ui/Typography/TypographyH1";
import { useToast } from "@/components/ui/use-toast";
import credentialsSignup from "@/features/Authentication/services/credentialsSignup";
import ILoginCredentials from "@/types/LoginCredentials.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export default function Signup() {
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const signupMutation = useMutation({
		mutationKey: ["signup"],
		mutationFn: (credentials: ILoginCredentials) => credentialsSignup(credentials),
		onSuccess: (data) => onSignupSuccess(data),
		onError: () => onSignupError(),
	});

	const onSignupSuccess = (data: AxiosResponse<any, any>) => {
		if (data.status === 201) {
			router.replace("/");
		}
	};

	const onSignupError = () => {
		toast({
			title: "Signup failed",
			description: "please check your internet connection and try again",
			duration: 7000,
			variant: "destructive",
		});
	};

	const handleOnSignupSubmit = (credentials: ILoginCredentials) => {
		signupMutation.mutate(credentials);
	};

	return (
		<>
			<section
				className={`flex flex-col gap-10 items-stretch justify-center max-w-sm h-screen mx-auto  ${
					signupMutation.isPending ? "pointer-events-none opacity-90" : ""
				}`}
			>
				<TypographyH1>Signup</TypographyH1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleOnSignupSubmit)}
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

						<Button disabled={signupMutation.isPending} type="submit">
							Signup
							{signupMutation.isPending && <Loading className="!border-r-white ml-2" />}
						</Button>
						<div className="text-with-lines-on-side text-[var(--color-label-tertiary)]">or</div>
						<div className="flex justify-start items-center self-center">
							<span>already have an account?</span>
							<Link href={"/login"}>
								<Button type="button" variant={"link"} size={"sm"} className="text-blue-500">
									Login
								</Button>
							</Link>
						</div>
					</form>
				</Form>
			</section>
		</>
	);
}
