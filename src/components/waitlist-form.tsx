'use client';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const waitlistFormSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	email: z.string().email(),
});

export const WaitlistForm = () => {
	const form = useForm<z.infer<typeof waitlistFormSchema>>({
		resolver: zodResolver(waitlistFormSchema),
		defaultValues: {
			email: '',
			first_name: '',
			last_name: '',
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		const res = await fetch('https://api.getwaitlist.com/api/v1/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_WAITLIST_API_KEY}`,
			},
			body: JSON.stringify({
				...data,
				waitlist_id: process.env.NEXT_PUBLIC_WAITLIST_ID,
			}),
		});

		if (res.ok) {
			console.log('Success');
		}
	});

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="space-y-8">
				<FormField
					control={form.control}
					name="first_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First name</FormLabel>
							<FormControl>
								<Input placeholder="John" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="last_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last name</FormLabel>
							<FormControl>
								<Input placeholder="Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="john@doe.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};
