import Image from "next/image";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-svh p-6 md:p-10 bg-muted">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <div className="flex items-center gap-2 self-center">
          <Image src={`/logos/logo.svg`} alt="Logo" width={30} height={30} />
          Workot
        </div>
        {children}
      </div>
    </div>
  );
};
