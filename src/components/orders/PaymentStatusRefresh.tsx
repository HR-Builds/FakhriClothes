"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentStatusRefresh({
  paymentStatus,
}: {
  paymentStatus: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      return;
    }

    const interval = setInterval(() => {
      router.refresh();
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentStatus, router]);

  return null;
}