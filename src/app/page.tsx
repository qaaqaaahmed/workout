import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {JSON.stringify(users)}
    </div>
  );
}
