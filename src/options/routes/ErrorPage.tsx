import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error: any = useRouteError();
	console.error(error);
	return (
		<div className="flex justify-center items-center h-full text-center">
			<div>
				<h1 className="text-22px font-600 mb-8">Oops!</h1>
				<p className="mb-4 text-16px">Sorry, an unexpected error has occurred.</p>
				<p className="text-#ccc font-200 text-12px">
					<i>{error.statusText || error.message}</i>
				</p>
			</div>
		</div>
	);
}
