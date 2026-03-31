import { getCustomersByStage } from "@/lib/queries";
import { PassBoard } from "@/components/the-pass/PassBoard";

export const dynamic = "force-dynamic";

export default function ThePassPage() {
  const data = getCustomersByStage();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl">The Pass</h1>
        <p className="text-text-muted text-sm">What&apos;s cooking at Sauce</p>
      </div>
      <PassBoard data={data} />
    </div>
  );
}
