"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ClientWrapper({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(null);

  // Check flow
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; // not signed in yet
    }

    const checkFlow = async () => {
      try {
        const personalRes = await fetch(`/api/personal-detail?userId=${user.id}`);
        const personalData = await personalRes.json();

        if (!personalData.exists) {
          setRedirect("/personal-detail");
        } else {
          const assessRes = await fetch(`/api/assessment?userId=${user.id}`);
          const assessData = await assessRes.json();

          if (!assessData.exists) {
            setRedirect("/assessment");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkFlow();
  }, [user]);

  // Redirect effect
  useEffect(() => {
    if (redirect) {
      router.push(redirect);
    }
  }, [redirect, router]);

  if (loading) return <div>Loading...</div>;
  return children;
}
