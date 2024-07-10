"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { RegisterExpenseFormSchema, RegisterExpenseFormSchemaType } from "@/features/RegisterExpense/formSchema";
import registerExpense from "@/features/RegisterExpense/services/registerExpense";

export default function Home() {
	const form = useForm<RegisterExpenseFormSchemaType>({
		resolver: zodResolver(RegisterExpenseFormSchema),
		defaultValues: {
			amount: 0,
		},
	});
	const registerExpenseMutation = useMutation({
		mutationKey: ["registerExpense"],
		mutationFn: (expenseData: RegisterExpenseFormSchemaType) => registerExpense(expenseData),
	});

	const handleOnExpenseSubmit = (expenseData: RegisterExpenseFormSchemaType) => {
		registerExpenseMutation.mutate(expenseData);
	};

	return (
		<main className="max-w-sm p-6 mx-auto">
			<Form {...form}>
				<form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleOnExpenseSubmit)}>
					<FormField
						control={form.control}
						name={"amount"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"category"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={"description"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea maxLength={100} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" />
				</form>
			</Form>
		</main>
	);
}
