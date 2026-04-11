import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { Button } from "@/src/elements/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full bg-linear-to-r from-green-600 to-emerald-600 opacity-50" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-linear-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"
        animate={{
          x: theme === "dark" ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === "light" ? (
          <Sun size={14} className="text-green-600" />
        ) : (
          <Moon size={14} className="text-primary" />
        )}
      </motion.div>
    </Button>
  );
}
