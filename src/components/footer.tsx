const currentYear = new Date().getFullYear();

export const Footer = () => {
	return (
		<footer>
			<p>&copy; {currentYear}</p>
		</footer>
	);
};
