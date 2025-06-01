"use client";
import React from "react";
import DashboardHeader from "./components/dashboard-header";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import SignupButton from "@/components/signup-button";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useDynamicContext();

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-[#121212]">
        <DashboardHeader />

        <Card className="border-dashed border-zinc-800 bg-zinc-900 max-w-screen-md mx-auto h-96 w-full mt-10 md:mt-28">
          <CardContent className="flex flex-col items-center justify-center h-full py-8">
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">+</span>
            </div>
            <p className="text-zinc-400 mb-4 text-center text-2xl">
              Sign up to manage your squads
            </p>
            <SignupButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#121212]">
      <DashboardHeader />
      {children}
    </div>
  );
};

export default DashboardLayout;
