import { WaitlistForm } from '@/components/waitlist-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Waitlist | Voting System',
	description: 'Join to the waitlist for the voting system.',
};

const Home = () => {
	return (
		<main className="flex min-h-full flex-1 flex-col items-center justify-center gap-12">
			<h1 className="text-center text-4xl font-bold">Join to waitlist</h1>
			<WaitlistForm />
		</main>
	);
};

export default Home;
