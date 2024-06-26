import type { Metadata } from 'next';
import './globals.scss';
import type { ReactNode } from 'react';
import { Provider } from '@/components/provider';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

const RootLayout = ({
	children,
}: Readonly<{
	children: ReactNode;
}>) => {
	return (
		<html lang="en">
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
};

export default RootLayout;
