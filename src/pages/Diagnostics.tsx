
import React from "react";
import { Header } from "@/components/Header";
import { DiagnosticTool } from "@/components/diagnostic/DiagnosticTool";

const Diagnostics = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold exo-2-heading">System Diagnostics</h1>
          <p className="text-gray-600 mt-2">Run tests to identify and resolve system issues</p>
        </div>

        <DiagnosticTool />
      </main>
    </div>
  );
};

export default Diagnostics;
