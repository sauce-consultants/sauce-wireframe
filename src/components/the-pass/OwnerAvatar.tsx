import { Avatar } from "@/components/ui";
import { OWNERS, type Owner } from "./types";

interface OwnerAvatarProps {
  owner: Owner;
  size?: "xs" | "sm" | "md";
}

export function OwnerAvatar({ owner, size = "xs" }: OwnerAvatarProps) {
  const { name } = OWNERS[owner];
  return <Avatar name={name} size={size} />;
}
