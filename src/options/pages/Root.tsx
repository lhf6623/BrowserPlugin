import useCurrRouters from "@/hooks/useCurrRouters";
import clsx from "clsx";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import themes from "../../assets/themes.json";
import { CacheProvider } from "@/hooks/CacheContext";
import { useTranslation } from "react-i18next";
import { langList } from "@/assets/language";
import { useLanguageSwitcher } from "@/hooks/useLanguageSwitcher";
import { useThemeSwitcher } from "@/hooks/useThemeSwitcher";

export default function Layout() {
  const [isSm, setIsSm] = useState(false);
  const routerList = useCurrRouters("/");
  const { t } = useTranslation();

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
            <ThemeButton />
            <LanguageButton />
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
                  {t(name)}
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

function LanguageButton() {
  const { systemConfig, applyLanguage } = useLanguageSwitcher();
  const { t } = useTranslation();

  return (
    <div className='dropdown dropdown-end dropdown-bottom'>
      <div tabIndex={0} className='btn m-1 btn-xs btn-ghost' style={{ textTransform: "none" }}>
        <i className='i-mdi-translate'></i>
        <i className='i-ep-arrow-down'></i>
      </div>
      <div
        tabIndex={0}
        className='dropdown-content grid grid-cols-1 gap-1 p-3 shadow bg-base-200 rounded-sm w-20 h-fit max-h-96'
      >
        {langList.map((item) => {
          const text = item.label;
          return (
            <button
              title={t("language.switchTo", { language: text })}
              key={item.value}
              className={clsx("btn btn-xs btn-icon-info", {
                "!bg-base-100 !text-base-content": item.value === systemConfig.language,
              })}
              onClick={() => applyLanguage(item.value)}
              type='button'
              style={{ textTransform: "none" }}
            >
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ThemeButton() {
  const { systemConfig, systemAutoTheme, setTheme } = useThemeSwitcher();
  const { t } = useTranslation();

  const localThemes = Object.entries(themes);

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
        className='dropdown-content shadow bg-base-200 rounded-box overflow-hidden w-56 h-[70vh] max-h-96'
      >
        <div className='h-full overflow-auto grid grid-cols-1 gap-3 p-3 z-[1] p-2'>
          <button
            title={t("theme.followSystem")}
            data-theme={systemAutoTheme}
            className='flex items-center justify-center rounded-md p-2 gap-2 bg-base-100'
            onClick={() => setTheme("system")}
            type='button'
          >
            <span className='w-10 h-full rounded-full inline-block'>
              {systemConfig.theme === "system" && <i className='i-ep-select'></i>}
            </span>
            <span className='flex-1 h-full rounded-full text-ellipsis overflow-hidden whitespace-nowrap'>
              {t("theme.followSystem")}
            </span>
            <span className='h-full w-10 rounded-full flex items-center justify-center *:h-full *:w-2 *:inline-block *:rounded gap-1px'>
              <span className='bg-primary'></span>
              <span className='bg-secondary'></span>
              <span className='bg-accent'></span>
              <span className='bg-neutral'></span>
            </span>
          </button>
          {localThemes.map(([key, item]) => {
            const text = item[systemConfig.language];
            return (
              <button
                title={t("theme.switchTo", { theme: text })}
                data-theme={key}
                key={key}
                className='flex items-center justify-center rounded-md p-2 gap-2 bg-base-100'
                onClick={() => setTheme(key)}
                type='button'
              >
                <span className='w-10 h-full rounded-full inline-block'>
                  {systemConfig.theme === key && <i className='i-ep-select'></i>}
                </span>
                <span className='flex-1 h-full rounded-full'>{text}</span>
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
    </div>
  );
}
