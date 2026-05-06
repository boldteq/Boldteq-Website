"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string) {
  return (notify: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", notify);
    return () => mql.removeEventListener("change", notify);
  };
}

function getSnapshot(query: string) {
  return () => window.matchMedia(query).matches;
}

const getServerSnapshot = () => false;

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(subscribe(query), getSnapshot(query), getServerSnapshot);
}
