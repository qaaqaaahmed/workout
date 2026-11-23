import { CredentialView } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";

interface Props {
  params: Promise<{
    credentialId: string;
  }>;
}
const Page = async ({ params }: Props) => {
  await requireAuth();
  const { credentialId } = await params;
  return (
    <div className="p-4 md:px-10 md:py-6 h-full flex flex-col gap-y-8">
      <div className="max-w-screen-md mx-auto w-full h-full">
        <CredentialView credentialId={credentialId} />
      </div>
    </div>
  );
};

export default Page;
