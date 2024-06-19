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
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const waitlistFormSchema = z.object({
	first_name: z.string().min(2, { message: 'First name is too short' }),
	last_name: z.string().min(2, { message: 'Last name is too short' }),
	email: z.string().email(),
	agreement: z.literal(true, {
		message: 'You must agree to the privacy policy',
	}),
});

const successSubmitResponseSchema = z.object({
	amount_referred: z.number(),
	created_at: z.string(),
	email: z.string().email(),
	priority: z.number(),
	referral_link: z.string(),
	referral_token: z.string(),
	referred_by_signup_token: z.string(),
	removed_date: z.date(),
	removed_priority: z.string(),
	uuid: z.string(),
	verified: z.boolean(),
	answers: z
		.object({
			question_value: z.string(),
			optional: z.boolean(),
			answer_value: z.string(),
		})
		.array(),
	phone: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	metadata: z.object({}),
	waitlist_id: z.number(),
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

			if (!res.ok) {
				throw new Error('Failed to sign up');
			}

			const res2 = await fetch(
				'https://connect.mailerlite.com/api/subscribers',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAILERLITE_API_TOKEN}`,
					},
					body: JSON.stringify({
						email: data.email,
						fields: {
							name: data.first_name,
							last_name: data.last_name,
						},
						groups: [process.env.NEXT_PUBLIC_MAILERLITE_GROUP_ID],
					}),
				},
			);

			if (!res2.ok) {
				throw new Error('Failed to sign up to Mailerlite');
			}

			return successSubmitResponseSchema.parse(await res.json());
		},
		onSuccess: async () => {
			if (jsConfettiRef.current) {
				await jsConfettiRef.current.addConfetti();
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

				<FormField
					control={form.control}
					name="agreement"
					render={({ field }) => (
						<FormItem className="flex flex-col items-start space-x-3 space-y-0">
							<div className="flex space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="flex items-center justify-center space-y-1 leading-none">
									<FormLabel>
										I have read the{' '}
										<Link
											href={{ pathname: '/privacy-policy' }}
											className="font-semibold"
										>
											privacy policy
										</Link>
									</FormLabel>
								</div>
							</div>
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
