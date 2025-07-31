import { useState } from "react";

export default function CopyButton({ text, title, className }: { text: string; title: string; className?: string }) {
  const [isCopy, setIsCopy] = useState(false);
  function copy() {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopy(true);
      setTimeout(() => {
        setIsCopy(false);
      }, 3000);
    });
  }
  return (
    <button onClick={copy} title={title} className={className}>
      {isCopy ? "已复制" : "复制"}
    </button>
  );
}
