import { toast } from "react-hot-toast";

let lastToastTime = 0;

export function filterGeorgianInput(value: string) {
  const allowedValue = value.replace(/[^ა-ჰ0-9+\-!@#$?"'%^&*()\/\.,:;_{}=\s]/g, "");

  if (value !== allowedValue) {
    const now = Date.now();
    if (now - lastToastTime > 2000) { 
      toast.error("გამოიყენეთ ქართული ასოები");
      lastToastTime = now;
    }
  }

  return allowedValue;
}
