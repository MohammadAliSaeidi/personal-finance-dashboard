"use client";
import { FormEvent } from "react";

export default function Login() {
	const handleOnLoginSubmit = (event?: FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		console.log(event);
	};

	return (
		<form
			className="flex flex-col gap-6 mx-auto max-w-xs min-h-screen justify-center items-stretch"
			onSubmit={handleOnLoginSubmit}
		>
			<div className="flex flex-col gap-2">
				<label htmlFor="username">Username</label>
				<input
					id="username"
					type="text"
					className="border border-gray-400 rounded-md"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="password">Password</label>
				<input
					id="passsord"
					type="password"
					className="border border-gray-400 rounded-md"
				/>
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
