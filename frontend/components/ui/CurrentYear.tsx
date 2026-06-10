"use client";

import { useEffect, useState } from "react";

interface CurrentYearProps {
  defaultYear?: number;
}

export function CurrentYear({ defaultYear = 2026 }: CurrentYearProps) {
  const [year, setYear] = useState<number | string>(defaultYear);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
