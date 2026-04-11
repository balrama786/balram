import { cn } from "@/lib/utils";

export const TruncatedText = ({
  text,
  maxLength = 100,
  className,
}: {
  text: string;
  maxLength?: number;
  className?: string;
}) => {
  const truncated =
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  return (
    <p
      className={cn(
        "text-gray-500 text-[13px] break-all leading-relaxed",
        className
      )}
    >
      {truncated}
    </p>
  );
};
