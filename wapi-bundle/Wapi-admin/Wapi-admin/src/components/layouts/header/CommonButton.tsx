import { Button } from "@/src/elements/ui/button";
import { HeaderIconButtonProps } from "@/src/types/components";

const HeaderIconButton = ({ icon, label, showDot }: HeaderIconButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    aria-label={label}
    className="relative text-gray-600 hover:text-gray-900"
  >
    {icon}
    {showDot && (
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
    )}
  </Button>
);

export default HeaderIconButton;
