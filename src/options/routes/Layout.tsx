import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { routes } from "@/options/routes";

export default function Layout() {
	const [isSm, setIsSm] = useState(false);

	const location = useLocation();
	let { pathname } = location;

	const routerList = routes[0].children;

	// @unocss-include
	const active = "bg-#fff font-600";
	const showMenu = "!translate-x-0%";
	return (
		<div className='flex h-full'>
			<div className='block fixed top-0 z-6 h-40px w-full text-14px shadow-md sm:h-0 bg-white'>
				<button
					className='i-gg:menu h-full text-26px ml-16px'
					onClick={() => setIsSm(true)}
				></button>
			</div>
			{isSm && (
				<div
					onClick={() => setIsSm(false)}
					className='fixed top-0 left-0 w-full h-full z-20 bg-#00000033'
				></div>
			)}
			<div
				className={`py-48px px-0px h-full w-240px flex-shrink-0 bg-#f3f3f3 max-sm:fixed max-sm:left-0 max-sm:top-0 z-90 max-sm:translate-x--100% transition-all ${
					isSm ? showMenu : ""
				}`}
			>
				<nav
					onClick={() => setIsSm(false)}
					className='p-0 flex flex-col items-start z-30'
				>
					{routerList.map(({ path, name }) => {
						return (
							<Link
								key={path}
								to={path}
								className={`py-16px px-32px line-height-20px cursor-pointer w-full hover:bg-#fff ${
									path === pathname && active
								}`}
							>
								{name}
							</Link>
						);
					})}
				</nav>
			</div>
			<div className='transition-all flex-1 relative flex flex-col items-center justify-between'>
				<Outlet />
			</div>
		</div>
	);
}
