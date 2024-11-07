export default function ImageProcessing() {
  const routers = useCurrRouters();
  // @unocss-include
  return (
    <div className="w-full h-full flex flex-col overflow-auto max-sm:pt-40px">
      <div className="border-b px-16px h-fit flex-shrink-0">
        <ul className="py-16px">
          {routers.map((item) => {
            return (
              <li key={item.path} className="inline-block mr2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "text-#18a058" : "")}
                  end
                >
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="wfull flex-1 px-16px flex justify-center overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
