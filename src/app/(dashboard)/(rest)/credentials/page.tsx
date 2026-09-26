import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return <div>Crdentials</div>;
};

export default Page;
