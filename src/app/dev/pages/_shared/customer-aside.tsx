import { Badge, Card, CardHeader, CardBody, Avatar } from "@/components/ui";

export function CustomerAside() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><h3 className="font-extrabold text-sm">Summary</h3></CardHeader>
        <CardBody>
          <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-light">
            <Avatar name="Acme Corp" size="lg" />
            <div>
              <p className="font-extrabold">Acme Corp</p>
              <Badge variant="success" dot className="mt-1">Active</Badge>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Revenue</span><span className="font-mono font-bold">$142,580</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Orders</span><span className="font-mono font-bold">47</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Created</span><span className="font-mono">14 Mar 2024</span></div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h3 className="font-extrabold text-sm">Contact</h3></CardHeader>
        <CardBody>
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Email:</span> hello@acme.com</p>
            <p><span className="text-text-muted">Phone:</span> +1 555 123 4567</p>
            <p><span className="text-text-muted">Address:</span> 123 Main St, SF 94105</p>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader><h3 className="font-extrabold text-sm">Tags</h3></CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">Enterprise</Badge>
            <Badge variant="neutral">Technology</Badge>
            <Badge variant="neutral">Priority</Badge>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
