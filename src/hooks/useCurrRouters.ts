import { routes } from "@/options/routes";
import { useState, useEffect } from "react";
import { RouteObject, useLocation } from "react-router-dom";

type CurrRouters = RouteObject & {
  name: string;
  path: string;
};
export default function useCurrRouter(path?: string) {
  const { pathname } = useLocation();
  const [routers, setRouters] = useState<CurrRouters[]>([]);

  function getCurrRouter(_routes: RouteObject[]) {
    let currRouter: RouteObject[] = [];
    for (let i = 0; i < _routes.length; i++) {
      const { path: _path, children } = _routes[i];
      if (_path === path) return children || [];
      if (_path === pathname) {
        return children ? children : _routes;
      }
      currRouter = [...currRouter, ...(children || [])];
    }

    return getCurrRouter(currRouter);
  }

  useEffect(() => {
    const _routerList = getCurrRouter(routes);
    setRouters(_routerList as CurrRouters[]);
  }, [pathname]);

  return routers;
}
