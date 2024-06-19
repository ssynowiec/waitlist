import Link from 'next/link';

const currentYear = new Date().getFullYear();

export const Footer = () => {
	return (
		<footer className="mx-auto flex max-w-3xl justify-between">
			<p>&copy; {currentYear} Stanisław Synowiec. All rights reserved.</p>
			<Link href="/privacy-policy" className="font-semibold underline">
				Privacy policy
			</Link>
		</footer>
	);
};
