import { SingleColumn } from "@/components/layouts";
import { Input, Textarea, Button } from "@/components/ui";

export default function SingleColumnDemo() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-extrabold mb-6">Single Column — Form Example</h2>
      <SingleColumn width="md">
        <div className="space-y-6">
          <Input label="Project Name" placeholder="My Project" />
          <Input label="Slug" placeholder="my-project" helperText="URL-friendly identifier." />
          <Textarea label="Description" placeholder="Describe your project..." />
          <div className="flex justify-end gap-3 pt-4 border-t-4 border-black">
            <Button variant="ghost">Cancel</Button>
            <Button>Create Project</Button>
          </div>
        </div>
      </SingleColumn>
    </div>
  );
}
