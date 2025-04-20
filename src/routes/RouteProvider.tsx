
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

export function RouteProvider() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <Routes>
        {routes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element}
            errorElement={route.errorElement}
          />
        ))}
      </Routes>
    </Suspense>
  );
}
