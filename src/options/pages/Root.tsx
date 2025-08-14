import useCurrRouters from "@/hooks/useCurrRouters";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import themes from "../../assets/themes.json";
import { CacheProvider, useCacheContext } from "@/hooks/CacheContext";

export default function Layout() {
  const [isSm, setIsSm] = useState(false);
  const routerList = useCurrRouters("/");

  return (
    <CacheProvider>
      <div className='flex h-100vh bg-base-300 border-base-300 text-base-content'>
        <div className='absolute flex items-center top-0 z-6 h-40px !w-full b-b bg-base-300 flex justify-between'>
          <div>
            <button
              title='打开菜单'
              className='i-mdi:menu h-full text-26px mx-16px sm:hidden'
              type='button'
              onClick={() => setIsSm(true)}
            ></button>
          </div>
          <div className='flex items-center'>
            <ThemeButton></ThemeButton>
          </div>
        </div>
        {isSm && <div onClick={() => setIsSm(false)} className='fixed top-0 left-0 w-full h-full z-20'></div>}
        <div
          className={clsx(
            "py-39px px-0px h-full w-240px flex-shrink-0 max-sm:fixed max-sm:left-0 max-sm:top-0 z-90 max-sm:translate-x--100% transition-all",
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
    </CacheProvider>
  );
}

function ThemeButton() {
  const [systemTheme, setSystemTheme] = useState("light");
  const { systemConfig, setSystemConfig } = useCacheContext();

  function handleThemeChange(_theme: string) {
    setSystemConfig({
      ...systemConfig,
      theme: _theme,
    });
  }

  useEffect(() => {
    document.startViewTransition(changeSystemTheme);
  }, [systemConfig]);

  function changeSystemTheme() {
    let { theme } = systemConfig;
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setSystemTheme(theme);
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("class", theme);
  }
  useEffect(() => {
    // 监听系统主题变化
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", changeSystemTheme);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", changeSystemTheme);
    };
  }, []);
  return (
    <div className='dropdown dropdown-end dropdown-bottom'>
      <div tabIndex={0} className='btn m-1 btn-xs btn-ghost' style={{ textTransform: "none" }}>
        <span className='w-20px h-20px inline-block flex flex-wrap gap-2px bg-base-100 b-base-content/10 b rounded p-2px'>
          <span className='bg-primary w-6px h-6px inline-block rounded flex-shrink-0'></span>
          <span className='bg-secondary w-6px h-6px inline-block rounded flex-shrink-0'></span>
          <span className='bg-accent w-6px h-6px inline-block rounded flex-shrink-0'></span>
          <span className='bg-neutral w-6px h-6px inline-block rounded flex-shrink-0'></span>
        </span>
        <i className='i-ep-arrow-down'></i>
      </div>
      <div
        tabIndex={0}
        className='dropdown-content grid grid-cols-1 gap-3 p-3 z-[1]  p-2 shadow bg-base-200 rounded-box max-h-300px overflow-auto w-56 h-[70vh] max-h-96'
      >
        <button
          title='主题跟随系统'
          data-theme={systemTheme}
          className='flex items-center justify-center rounded-md p-2 gap-2 bg-base-100'
          onClick={() => handleThemeChange("system")}
          type='button'
        >
          <span className='w-10 h-full rounded-full inline-block'>
            {systemConfig.theme === "system" && <i className='i-ep-select'></i>}
          </span>
          <span className='flex-1 h-full rounded-full'>system</span>
          <span className='h-full w-10 rounded-full flex items-center justify-center *:h-full *:w-2 *:inline-block *:rounded gap-1px'>
            <span className='bg-primary'></span>
            <span className='bg-secondary'></span>
            <span className='bg-accent'></span>
            <span className='bg-neutral'></span>
          </span>
        </button>
        {themes.map((item) => {
          return (
            <button
              title={`切换到 ${item} 主题`}
              data-theme={item}
              key={item}
              className='flex items-center justify-center rounded-md p-2 gap-2 bg-base-100'
              onClick={() => handleThemeChange(item)}
              type='button'
            >
              <span className='w-10 h-full rounded-full inline-block'>
                {systemConfig.theme === item && <i className='i-ep-select'></i>}
              </span>
              <span className='flex-1 h-full rounded-full'>{item}</span>
              <span className='h-full w-10 rounded-full flex items-center justify-center *:h-full *:w-2 *:inline-block *:rounded gap-1px'>
                <span className='bg-primary'></span>
                <span className='bg-secondary'></span>
                <span className='bg-accent'></span>
                <span className='bg-neutral'></span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
