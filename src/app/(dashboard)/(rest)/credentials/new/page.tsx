import { CredentialForm } from "@/features/credentials/components/credential";

const Page = () => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="max-w-screen-md mx-auto w-full h-full flex flex-col gap-y-8">
        <CredentialForm />
      </div>{" "}
    </div>
  );
};

export default Page;
