import { Input, Button } from "@/components/ui";

export default function CenteredCardDemo() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Centered Card — Auth Screen</h2>
      <div className="border-4 border-black bg-gray-light/30" style={{ height: 500 }}>
        <div className="h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md border-4 border-black bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black mb-1">Sign In</h2>
            <p className="text-sm text-text-muted mb-6">Enter your credentials to continue.</p>
            <div className="space-y-4">
              <Input label="Email" type="email" placeholder="jane@example.com" />
              <Input label="Password" type="password" placeholder="Enter password" />
              <Button className="w-full">Sign In</Button>
            </div>
            <p className="text-xs text-text-muted text-center mt-4">
              Don&apos;t have an account? <a href="#" className="underline">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
