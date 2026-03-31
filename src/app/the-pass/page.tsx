import { getCustomersByStage } from "@/lib/queries";
import { getAllUsers } from "@/lib/dish-queries";
import { PassBoard } from "@/components/the-pass/PassBoard";

export const dynamic = "force-dynamic";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function ThePassPage() {
  const data = serialize(await getCustomersByStage());
  const users = serialize(await getAllUsers());

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl">The Pass</h1>
        <p className="text-text-muted text-sm">What&apos;s cooking at Sauce</p>
      </div>
      <PassBoard data={data} users={users} />
    </div>
  );
}
