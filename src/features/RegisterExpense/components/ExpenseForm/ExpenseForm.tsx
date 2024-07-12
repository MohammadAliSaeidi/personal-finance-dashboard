"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { RegisterExpenseFormSchema, RegisterExpenseFormSchemaType } from "@/features/RegisterExpense/formSchema";
import registerExpense from "@/features/RegisterExpense/services/registerExpense";
import Loading from "@/components/ui/Loading/Loading";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { CommandList } from "cmdk";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

type ExpenseFormProps = {
	expenseCategories: string[];
};

export default function ExpenseForm({ expenseCategories }: ExpenseFormProps) {
	const form = useForm<RegisterExpenseFormSchemaType>({
		resolver: zodResolver(RegisterExpenseFormSchema),
		defaultValues: {
			amount: 0,
		},
	});

	const { fields, append } = useFieldArray({ name: "category", control: form.control });

	useEffect(() => {
		expenseCategories.map((category) => append({ category: category }));
	}, [expenseCategories, append]);

	const onRegisterExpenseSuccess = () => {
		form.reset();
	};

	const registerExpenseMutation = useMutation({
		mutationKey: ["registerExpense"],
		mutationFn: (expenseData: RegisterExpenseFormSchemaType) => registerExpense(expenseData),
		onSuccess: () => onRegisterExpenseSuccess(),
	});

	const handleOnExpenseSubmit = (expenseData: RegisterExpenseFormSchemaType) => {
		registerExpenseMutation.mutate(expenseData);
	};

	return (
		<Form {...form}>
			<form
				className={`flex flex-col gap-6 justify-center items-stretch ${
					registerExpenseMutation.isPending ? "pointer-events-none" : ""
				}`}
				onSubmit={form.handleSubmit(handleOnExpenseSubmit)}
			>
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
				{expenseCategories.map((expenseCategory) => {
					return <input type="checkbox" key={expenseCategory} {...form.register} />;
				})}
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
												"pl-3 text-left font-normal",
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

				<Button type="submit">
					Save
					{registerExpenseMutation.isPending && <Loading />}
				</Button>
			</form>
		</Form>
	);
}

{
	/* <FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Language</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn("justify-between", !field.value && "text-muted-foreground")}
										>
											{field.value
												? expenseCategories.find((category) => category === field.value)
												: "Select category"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="p-0">
									<Command>
										<CommandInput placeholder="Search Categories..." />
										<CommandList>
											<CommandEmpty>No language found.</CommandEmpty>
											<CommandGroup>
												{expenseCategories.map((category) => {
													console.log(category);
													return (
														<CommandItem
															value={category}
															key={category}
															onSelect={() => {
																form.setValue("category", category);
															}}
														>
															<Check
																className={cn(
																	"mr-2 h-4 w-4",
																	category === field.value
																		? "opacity-100"
																		: "opacity-0"
																)}
															/>
															{category}
														</CommandItem>
													);
												})}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/> */
}
