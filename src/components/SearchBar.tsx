"use client";

import React, {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "./ui/button";
import { IoSearch } from "react-icons/io5";
import { cn } from "@/lib/utils";
import shops from "@/data/shops.json";

type SearchBarProps = {
  setIsSearchOpen?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  useSelect?: boolean;
};

const SearchBarForm = ({
  setIsSearchOpen,
  className,
  useSelect,
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectedShop, setSelectedShop] = useState<undefined | string>(
    undefined
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchValue) return;

    if (selectedShop === "Select Shop" || !selectedShop) {
      return;
    } else {
      router.push(`/shops/${selectedShop}?q=${searchValue}`);
      if (setIsSearchOpen) setIsSearchOpen(false);
    }
  };

  const handleSelectShop = useCallback((shop?: string) => {
    if (shop) setSelectedShop(shop);
  }, []);

  useEffect(() => {
    handleSelectShop(selectedShop);
  }, [selectedShop, handleSelectShop]);

  useEffect(() => {
    handleSelectShop(undefined);
  }, [pathname, handleSelectShop]);

  return (
    <form
      className={cn(
        "searchBar flex items-center border-input border rounded-lg focus-within:border-blue-600 overflow-hidden bg-secondary shadow-sm transition-all",
        className
      )}
      onSubmit={handleSubmit}
    >
      {/* Shop Selector Dropdown */}
      {useSelect && (
        <Select onValueChange={handleSelectShop} value={selectedShop}>
          <SelectTrigger className="min-w-[110px] max-w-fit border-none rounded-none bg-accent text-sm">
            <SelectValue placeholder="Select Shop" className="capitalize" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-muted-foreground">Shops</SelectLabel>
              {shops.map((shop, index) => (
                <SelectItem
                  value={shop.title}
                  key={index}
                  className="px-4 [&>.indicator]:hidden capitalize"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={shop.icon}
                      width={30}
                      height={30}
                      alt={shop.title}
                      className="rounded"
                    />
                    <span>{shop.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      {/* Search Input */}
      <Input
        placeholder="Search products"
        className="border-none rounded-none text-sm flex-1 bg-secondary focus:ring-0"
        type="text"
        onChange={(e) => setSearchValue(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />

      {/* SEARCH BUTTON — UPDATED BLUE UI */}
      <Button
        className="text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-none h-full px-6 flex items-center justify-center
        transition-all duration-200 active:scale-95 shadow-md"
        type="submit"
      >
        <IoSearch />
      </Button>
    </form>
  );
};

const SearchBar = ({
  setIsSearchOpen,
  className,
  useSelect = true,
}: SearchBarProps) => {
  return (
    <Suspense>
      <SearchBarForm
        setIsSearchOpen={setIsSearchOpen}
        className={className}
        useSelect={useSelect}
      />
    </Suspense>
  );
};

export default SearchBar;