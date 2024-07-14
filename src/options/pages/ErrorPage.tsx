import { useRouteError, useNavigate } from "react-router-dom";

export default function ErrorPage() {
	const error: any = useRouteError();
	const navigate = useNavigate();
	console.error(error);

	function handleToHome() {
		navigate("/");
	}
	return (
		<div className='flex justify-center items-center h-full text-center'>
			<div>
				<h1 className='text-22px font-600 mb-8'>Oops!</h1>
				<p className='mb-4 text-16px'>抱歉，发生了意外错误。</p>
				<p className='text-#ccc font-200 text-12px mb4'>
					<i>{error.statusText || error.message}</i>
				</p>
				<button
					className='border px2 l-button'
					onClick={handleToHome}
				>
					返回主页
				</button>
			</div>
		</div>
	);
}
