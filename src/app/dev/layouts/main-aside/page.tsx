import { MainAside } from "@/components/layouts";
import { Badge, Card, CardHeader, CardBody } from "@/components/ui";

export default function MainAsideDemo() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Main + Aside</h2>
      <MainAside
        aside={
          <div className="space-y-4">
            <Card>
              <CardHeader><h3 className="font-extrabold text-sm">Summary</h3></CardHeader>
              <CardBody>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Status</span><Badge variant="success">Active</Badge></div>
                  <div className="flex justify-between"><span className="text-text-muted">Created</span><span className="font-mono">25 Mar 2026</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Owner</span><span className="font-semibold">Jane Smith</span></div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><h3 className="font-extrabold text-sm">Tags</h3></CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="neutral">Frontend</Badge>
                  <Badge variant="neutral">Priority</Badge>
                  <Badge variant="neutral">Q1</Badge>
                </div>
              </CardBody>
            </Card>
          </div>
        }
      >
        <Card>
          <CardHeader><h3 className="text-xl font-extrabold">Project Alpha</h3></CardHeader>
          <CardBody>
            <div className="space-y-4 text-sm text-text-secondary">
              <p>This is the main content area. It takes up the majority of the horizontal space, with the aside panel providing supporting context.</p>
              <p>On mobile, the aside drops below the main content. On desktop (lg+), they sit side by side.</p>
              <div className="border-4 border-gray-light p-8 text-center text-text-muted font-mono">
                Main content area
              </div>
            </div>
          </CardBody>
        </Card>
      </MainAside>
    </div>
  );
}
