import useCurrRouters from "@/hooks/useCurrRouters";
import clsx from "clsx";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const [isSm, setIsSm] = useState(false);
  const routerList = useCurrRouters("/");
  return (
    <>
      <div className='flex h-100vh'>
        <div className=' absolute flex items-center top-0 z-6 h-40px !w-full b-b sm:h-0 '>
          <button className='i-mdi:menu h-full text-26px mx-16px' onClick={() => setIsSm(true)}></button>
        </div>
        {isSm && <div onClick={() => setIsSm(false)} className='fixed top-0 left-0 w-full h-full z-20'></div>}
        <div
          className={clsx(
            "py-48px px-0px h-full w-240px flex-shrink-0 bg-base-300 border-base-300 text-base-content max-sm:fixed max-sm:left-0 max-sm:top-0 z-90 max-sm:translate-x--100% transition-all",
            {
              "!translate-x-0%": isSm,
            }
          )}
        >
          <nav onClick={() => setIsSm(false)} className='p-0 flex flex-col items-start z-30'>
            {routerList.map(({ path, name }) => {
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => {
                    return clsx("py-16px px-32px line-height-20px cursor-pointer w-full my-1px", {
                      "bg-base-100 font-600": isActive,
                    });
                  }}
                >
                  {name}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className='transition-all flex-1 h-full relative flex flex-col items-center justify-between overflow-auto'>
          <Outlet />
        </div>
      </div>
    </>
  );
}
