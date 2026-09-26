import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{
    credentialId: string;
  }>;
}
const Page = async ({ params }: Props) => {
  await requireAuth();
  const { credentialId } = await params;
  return <div>Credential ID: {credentialId}</div>;
};

export default Page;
