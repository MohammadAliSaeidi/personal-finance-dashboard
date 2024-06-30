"use client";
import credentialsSignup from "@/features/Authentication/services/credentialsSignup";
import ILoginCredentials from "@/types/LoginCredentials.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Signup() {
	const router = useRouter();

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<ILoginCredentials>();

	const signupMutation = useMutation({
		mutationKey: ["signup"],
		mutationFn: (credentials: ILoginCredentials) => credentialsSignup(credentials),
		onSuccess: (data) => onSignupSuccess(data),
	});

	const onSignupSuccess = (data: AxiosResponse<any, any>) => {
		if (data.status === 201) {
			router.replace("/");
		}
	};

	const handleOnSignupSubmit = (credentials: ILoginCredentials) => {
		signupMutation.mutate(credentials);
	};

	return (
		<form
			className="flex flex-col gap-6 mx-auto max-w-xs min-h-screen justify-center items-stretch"
			onSubmit={handleSubmit(handleOnSignupSubmit)}
		>
			<div className="flex flex-col gap-2">
				<label htmlFor="username">Username</label>
				<input
					id="username"
					type="text"
					className="border border-gray-400 rounded-md"
					{...register("username", {
						required: "Please enter your username",
					})}
				/>
				{errors?.username && <span className="text-red-600">{errors.username.message}</span>}
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="password">Password</label>
				<input
					id="passsord"
					type="password"
					className="border border-gray-400 rounded-md"
					{...register("password", {
						minLength: {
							value: 8,
							message: "the password must be at least 8 characters",
						},
						maxLength: {
							value: 20,
							message: "the password must be at most 20 characters",
						},
						pattern: {
							value: /^[\sa-zA-Z\d!@#$%^&*()-_=+\[\]\{\};:'",<\.>/\?`\~\|]{8,20}$/,
							message: "wrong pattern",
						},
						required: "Please enter your password",
					})}
				/>
				{errors?.password && <span className="text-red-600">{errors.password.message}</span>}
			</div>

			<button type="submit" className="bg-blue-400 text-white h-11 rounded-md hover:bg-blue-500">
				Signup
			</button>
		</form>
	);
}
