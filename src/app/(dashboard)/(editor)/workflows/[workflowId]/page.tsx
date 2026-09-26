interface Props {
  params: Promise<{
    workflowId: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { workflowId } = await params;
  return <div>Workflow Id: {workflowId}</div>;
};

export default Page;
