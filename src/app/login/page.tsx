"use client";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
	username: string;
	password: string;
};

export default function Login() {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<Inputs>();
	const handleOnLoginSubmit = (formData: Inputs) => {
		console.log(formData);
	};

	return (
		<form
			className="flex flex-col gap-6 mx-auto max-w-xs min-h-screen justify-center items-stretch"
			onSubmit={handleSubmit(handleOnLoginSubmit)}
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
				{errors?.username && (
					<span className="text-red-600">
						{errors.username.message}
					</span>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="password">Password</label>
				<input
					id="passsord"
					type="password"
					className="border border-gray-400 rounded-md"
					{...register("password", {
						required: "Please enter your password",
					})}
				/>
				{errors?.password && (
					<span className="text-red-600">
						{errors.password.message}
					</span>
				)}
			</div>

			<button
				type="submit"
				className="bg-blue-400 text-white h-11 rounded-md hover:bg-blue-500"
			>
				login
			</button>
		</form>
	);
}
