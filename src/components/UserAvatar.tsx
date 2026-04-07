import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";

interface UserAvatarProps {
  className?: string;
  /** Override the image URL (defaults to profile avatar) */
  src?: string;
  /** Override initials (defaults to profile initials) */
  initials?: string;
  /** Extra classes for the fallback */
  fallbackClassName?: string;
}

const UserAvatar = ({ className, src, initials, fallbackClassName }: UserAvatarProps) => {
  const { avatarUrl, initials: profileInitials } = useProfile();

  const imgSrc = src ?? avatarUrl;
  const displayInitials = initials ?? profileInitials;

  return (
    <Avatar className={cn("shrink-0", className)}>
      {imgSrc && <AvatarImage src={imgSrc} className="object-cover" />}
      <AvatarFallback className={cn("bg-primary/20 text-primary font-bold", fallbackClassName)}>
        {displayInitials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
