import { ButtonHTMLAttributes, useState } from "react";

// 继承 button 的属性
type CopyButtonProps = {
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CopyButton({ text, ...attar }: CopyButtonProps) {
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
    <button onClick={copy} {...attar} type='button' title='复制'>
      {isCopy ? "已复制" : "复制"}
    </button>
  );
}
