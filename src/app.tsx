import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import Rojo from "./components/Rojo/Rojo";

//Default Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const App = () => {
  return (
    <div className="app">
      {/* <StrictMode> */}
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <header>
            <Link to="/">Vermelho Game</Link>
          </header>
          <Routes>
            <Route path="/" element={<Rojo />} />
            {/* <Route path="/somePage/:id" element={<SomePageContainer />} /> */}
          </Routes>
          {/* <TestPage /> */}
        </QueryClientProvider>
      </BrowserRouter>
      {/* </StrictMode> */}
    </div>
  );
};

const container = document.getElementById("root");

if (!container) {
  throw new Error("No container to render to. Location App.tsx");
}

const root = createRoot(container);
root.render(<App />);
