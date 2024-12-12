"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

import DefaultUserIcon from '../../../../public/default_user';  // Adjust the import path as needed

const TopbarUser: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full p-0 border-gray-700 hover:bg-gray-800"
        >
          <DefaultUserIcon width={36} height={36} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-brand-dark border-gray-800">
        <DropdownMenuLabel className="text-brand-light">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem asChild className="text-brand-light hover:bg-gray-800 focus:bg-gray-800">
          <Link href="/app/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-brand-light hover:bg-gray-800 focus:bg-gray-800">
          <Link href="/app/settings/support">Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-800" />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-brand-light hover:bg-gray-800 focus:bg-gray-800">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TopbarUser;