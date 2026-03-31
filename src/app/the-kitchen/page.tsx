import { getDishesByStatus, getAllCustomersSimple, getAllUsers } from "@/lib/dish-queries";
import { KitchenBoard } from "@/components/the-kitchen/KitchenBoard";
import { KitchenPageHeader } from "@/components/the-kitchen/KitchenPageHeader";

export const dynamic = "force-dynamic";

// Strip non-plain properties from libsql row objects before passing to client components
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

interface Props {
  searchParams: Promise<{ table?: string | string[] }>;
}

export default async function TheKitchenPage({ searchParams }: Props) {
  const params = await searchParams;
  const tableParam = params.table;
  const customerIds = tableParam
    ? (Array.isArray(tableParam) ? tableParam : [tableParam]).map(Number).filter(Boolean)
    : [];

  const data = serialize(await getDishesByStatus(customerIds.length > 0 ? customerIds : undefined));
  const projects = serialize(await getAllCustomersSimple());
  const users = serialize(await getAllUsers());

  return (
    <>
      <KitchenPageHeader projects={projects} users={users} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl">The Kitchen</h1>
          <p className="text-text-muted text-sm">All the dishes being prepared</p>
        </div>
        <KitchenBoard data={data} projects={projects} users={users} />
      </main>
    </>
  );
}
