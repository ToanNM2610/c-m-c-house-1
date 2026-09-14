"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import Atmosphere from "./Atmosphere";
import CoffeeCupPlaceholder from "./models/CoffeeCupPlaceholder";
import CoffeeShopPlaceholder from "./models/CoffeeShopPlaceholder";

export default function CoffeeScene() {
  const pathname = usePathname() || "";

  return (
    <>
      <CameraRig />
      <Lighting />
      <Atmosphere />

      {/* 
        Main Environment 
        It provides the background aesthetic for all pages
      */}
      <Suspense fallback={null}>
        <CoffeeShopPlaceholder position={[0, -0.5, 0]} />
      </Suspense>

      {/* 
        Hero/Menu Focus Object
        The coffee cup is placed on the table.
      */}
      <Suspense fallback={null}>
        <CoffeeCupPlaceholder position={[0, 0, 1]} />
      </Suspense>
    </>
  );
}
