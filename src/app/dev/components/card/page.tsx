import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function CardShowcase() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl mb-2">Card</h1>
      <p className="text-text-muted mb-8">Contained content block for previews, summaries, and collections.</p>

      <Section title="Basic">
        <Card className="max-w-sm">
          <CardHeader><h3 className="text-lg font-extrabold">Project Alpha</h3></CardHeader>
          <CardBody><p className="text-sm text-text-secondary">A new initiative to improve onboarding flow and reduce time-to-value for new users.</p></CardBody>
          <CardFooter>
            <Badge variant="success" dot>Active</Badge>
            <span className="text-xs font-mono text-text-muted">Updated 2h ago</span>
          </CardFooter>
        </Card>
      </Section>

      <Section title="With Media Placeholder">
        <Card className="max-w-sm">
          <div className="w-full h-40 bg-gray-light border-b-4 border-black flex items-center justify-center text-text-muted text-sm font-mono">
            Image Placeholder
          </div>
          <CardHeader><h3 className="text-lg font-extrabold">Article Title</h3></CardHeader>
          <CardBody><p className="text-sm text-text-secondary">Brief description of the article content goes here.</p></CardBody>
          <CardFooter>
            <Button size="sm" variant="secondary">Read More</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Interactive Grid">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Alpha", "Beta", "Gamma"].map((name) => (
            <Card key={name} interactive>
              <CardHeader><h3 className="font-extrabold">Project {name}</h3></CardHeader>
              <CardBody>
                <p className="text-sm text-text-secondary">Short summary of this project.</p>
              </CardBody>
              <CardFooter>
                <Badge variant="neutral">Draft</Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
