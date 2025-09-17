"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ClientWrapper({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false); // user not logged in, no redirect needed
      return;
    }

    // const checkPersonalDetail = async () => {
    //   try {
    //     const res = await fetch(`/api/personal-detail?userId=${user.id}`);
    //     const data = await res.json();

    //     if (!data.exists) {
    //       router.push("/personal-detail");
    //     }
    //   } catch (err) {
    //     console.error("Error checking personal details:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // checkPersonalDetail();
  }, [user, router]);

  if (loading) return <div>Loading...</div>;
  return children;
}
