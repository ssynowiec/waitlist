import { WaitlistForm } from '@/components/waitlist-form';

const Home = () => {
	return (
		<main className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
			<h1 className="text-center text-4xl font-bold">Sign up to waitlist</h1>
			<WaitlistForm />
		</main>
	);
};

export default Home;
