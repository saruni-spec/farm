"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { countryData, CountryInfo } from "@/lib/countries";

const FarmerSignUp = () => {
  const [countriesList, setCountriesList] = useState<CountryInfo[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(
    null
  );
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const data = countryData();
    setCountriesList(data);

    const initialCountry = data.find((c) => c.code === "KE");
    if (initialCountry) {
      setSelectedCountry(initialCountry);
    } else {
      setSelectedCountry(data[0] || null);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCountry) return;

    // Construct the full phone number with the primary prefix
    const prefix = selectedCountry.phone.split(",")[0];
    const fullPhoneNumber = `+${prefix}${localPhoneNumber}`;

    console.log({
      countryCode: selectedCountry.code,
      phonePrefix: `+${prefix}`,
      localPhoneNumber: localPhoneNumber,
      fullPhoneNumber: fullPhoneNumber,
      fullName: fullName,
    });
    //
  };

  // Get the primary phone prefix for the selected country
  const getSelectedPrefix = () => {
    if (
      !selectedCountry ||
      typeof selectedCountry.phone !== "string" ||
      selectedCountry.phone.length === 0
    ) {
      return "N/A";
    }
    return selectedCountry.phone.split(",")[0];
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-gray-200 rounded-lg">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
              <Link href="/get_started">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold text-center flex-1 pr-8">
              Signup as a Farmer
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* --- Phone Number Input with Country Selector --- */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  {/* --- Country Selector Button --- */}
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={isPopoverOpen}
                        className="w-[130px] h-10 bg-yellow-400 border-yellow-400 text-black flex justify-between items-center px-3 hover:bg-yellow-500"
                      >
                        {selectedCountry ? (
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-xl">
                              {selectedCountry.flagEmoji}
                            </span>
                            <span>+{getSelectedPrefix()}</span>
                          </div>
                        ) : (
                          "Select..."
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList>
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {countriesList.map((country) => {
                              const displayPrefix =
                                typeof country.phone === "string" &&
                                country.phone.length > 0
                                  ? country.phone.split(",")[0]
                                  : "N/A";

                              return (
                                <CommandItem
                                  key={country.code}
                                  value={`${country.name} ${country.code} +${displayPrefix}`}
                                  onSelect={() => {
                                    setSelectedCountry(country);
                                    setIsPopoverOpen(false);
                                  }}
                                  className="flex items-center justify-between cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">
                                      {country.flagEmoji}
                                    </span>

                                    <span className="truncate">
                                      {country.name} (+{displayPrefix})
                                    </span>
                                  </div>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCountry?.code === country.code
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Input
                    id="phone"
                    type="tel"
                    value={localPhoneNumber}
                    onChange={(e) =>
                      setLocalPhoneNumber(e.target.value.replace(/\D/g, ""))
                    }
                    className="flex-1 h-10 bg-yellow-400 text-black placeholder-gray-700 border-none"
                    placeholder="712 345 678"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-yellow-400 text-black placeholder-gray-700 border-none"
                  placeholder="John Robert Williams"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6"
                disabled={!selectedCountry || !localPhoneNumber || !fullName}
              >
                Sign Up
              </Button>

              <div className="text-center mt-4">
                <span className="text-gray-700">Already registered? </span>
                <Link href="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerSignUp;
