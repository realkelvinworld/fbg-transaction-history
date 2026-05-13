"use client";

import Image from "next/image";

import { useUserStore } from "@/store/user";

export default function ProfileBanner() {
  // state
  const user = useUserStore((s) => s.user);

  // variables
  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const maskedAccount = user?.accountNumber
    ? `*** *** ${user.accountNumber.slice(-4)}`
    : null;

  return (
    <div className=" sticky top-10 w-full z-50 overflow-hidden rounded-2xl  bg-brand px-6 pt-6 pb-12 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 rounded-full bg-white/15 px-2 py-1.5 backdrop-blur-sm">
          <div className="relative size-7 overflow-hidden rounded-full ring-2 ring-white/40">
            <Image
              src="/images/kelvin.JPG"
              alt={user?.fullName ?? "User"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium leading-none px-2">
            {user?.fullName ?? "—"}
          </span>
        </div>

        {maskedAccount && (
          <span className="font-mono text-sm font-bold mt-3 lg:m-0 tracking-wider text-white">
            {maskedAccount}
          </span>
        )}
      </div>

      <div className="mt-8">
        <p className="text-3xl font-bold tracking-tight">Hi {firstName},</p>
        <p className="text-3xl font-semibold text-white">Welcome back</p>
      </div>

      {user?.branch && (
        <p className="mt-4 text-sm font-medium text-white">
          {user.branch} Branch
        </p>
      )}
    </div>
  );
}
