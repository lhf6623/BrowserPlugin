import useCurrRouters from "@/hooks/useCurrRouters";
import { NavLink, Outlet } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

export default function ImageProcessing() {
  const routers = useCurrRouters();
  const { t } = useTranslation();
  return (
    <div className='w-full h-full flex flex-col overflow-auto pt-40px'>
      <div className='border-b px-16px h-fit flex-shrink-0'>
        <ul role='tablist' className='tabs py-8px'>
          {routers.map((item) => {
            return (
              <li key={item.path} className='tab' role='tab'>
                <NavLink to={item.path} className={({ isActive }) => (isActive ? "tab text-info" : "tab")} end>
                  {t(item.name)}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='wfull flex-1 px-16px flex justify-center overflow-auto'>
        <DndContext>
          <Outlet />
        </DndContext>
      </div>
    </div>
  );
}
