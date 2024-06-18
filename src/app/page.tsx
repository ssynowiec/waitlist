import { WaitlistForm } from '@/components/waitlist-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Waitlist | Voting System',
	description: 'Sign up to the waitlist for the voting system.',
};

const Home = () => {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-12">
			<h1 className="text-center text-4xl font-bold">Sign up to waitlist</h1>
			<WaitlistForm />
		</main>
	);
};

export default Home;
