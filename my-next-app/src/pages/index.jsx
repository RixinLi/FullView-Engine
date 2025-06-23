import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();
  useEffect(() => {
    router.push("auth/sign-in");
  }, [router]);

  return null; // 或者一个 Loading UI
}
