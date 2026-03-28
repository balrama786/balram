import { ImagePath } from "@/src/constants";
import { ImageProps } from "@/src/types/shared";
import { getResolvedImageUrl } from "@/src/utils/image";
import Image from "next/image";
import { useState, useMemo, type FC } from "react";

const Images: FC<ImageProps> = ({ src, fallbackSrc, alt, className = "", ...rest }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [prevSrc, setPrevSrc] = useState<any>(null);

  const defaultPlaceholder = `${ImagePath}/default2.png`;

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const resolveImageSource = useMemo(() => {
    return getResolvedImageUrl(src, fallbackSrc);
  }, [src, fallbackSrc]);

  const displaySrc = useMemo(() => {
    if (hasError) {
      return fallbackSrc || defaultPlaceholder;
    }
    return resolveImageSource;
  }, [hasError, resolveImageSource, fallbackSrc, defaultPlaceholder]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const imageProps = {
    src: displaySrc,
    alt: alt || "image",
    onError: handleError,
    className: className,
    unoptimized: rest.unoptimized !== undefined ? rest.unoptimized : true,
    priority: rest.priority,
    ...rest,
  };

  // If fill is true, we must not pass width and height
  if (rest.fill) {
    delete (imageProps as any).width;
    delete (imageProps as any).height;
  } else {
    // If not fill, ensure width/height are at least 100 if not provided
    imageProps.width = rest.width || 100;
    imageProps.height = rest.height || 100;
  }

  return <Image {...(imageProps as any)} />;
};

export default Images;
