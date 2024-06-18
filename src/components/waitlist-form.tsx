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
import JSConfetti from 'js-confetti';
import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const waitlistFormSchema = z.object({
	first_name: z.string().min(2, { message: 'First name is too short' }),
	last_name: z.string().min(2, { message: 'Last name is too short' }),
	email: z.string().email(),
});

export const WaitlistForm = () => {
	const jsConfettiRef = useRef<JSConfetti>();

	useEffect(() => {
		jsConfettiRef.current = new JSConfetti();
	}, []);

	const { mutate, isPending, isSuccess } = useMutation({
		mutationFn: async (data: z.infer<typeof waitlistFormSchema>) => {
			const res = await fetch('https://api.getwaitlist.com/api/v1/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_WAITLIST_API_KEY}`,
				},
				body: JSON.stringify({
					...data,
					waitlist_id: process.env.NEXT_PUBLIC_WAITLIST_ID,
					referral_link: window.location.toString(),
				}),
			});

			if (res.ok) {
				if (jsConfettiRef.current) {
					await jsConfettiRef.current.addConfetti();
				}
			} else {
				throw new Error('Failed to sign up');
			}
		},
	});

	const form = useForm<z.infer<typeof waitlistFormSchema>>({
		resolver: zodResolver(waitlistFormSchema),
		defaultValues: {
			email: '',
			first_name: '',
			last_name: '',
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		mutate(data);
	});

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="w-1/5 space-y-4">
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
				<Button
					type="submit"
					variant={isSuccess ? 'secondary' : 'default'}
					className="w-full"
					disabled={isPending}
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Submitting
						</>
					) : isSuccess ? (
						'Submitted!'
					) : (
						'Submit'
					)}
				</Button>
			</form>
		</Form>
	);
};
