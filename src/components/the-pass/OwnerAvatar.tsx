import { Avatar } from "@/components/ui";

interface OwnerAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md";
}

export function OwnerAvatar({ name, size = "xs" }: OwnerAvatarProps) {
  return <Avatar name={name} size={size} />;
}
