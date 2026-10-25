import {
  Keyboard,
  Mouse,
  Monitor,
  Headphones,
  Webcam,
  Usb,
  Laptop,
  Computer,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  keyboard: Keyboard,
  mouse: Mouse,
  monitor: Monitor,
  headset: Headphones,
  webcam: Webcam,
  accessory: Usb,
  laptop: Laptop,
  desktop: Computer,
  security: ShieldCheck,
};
