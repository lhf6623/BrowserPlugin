import { ButtonHTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";

// 继承 button 的属性
type CopyButtonProps = {
  text: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CopyButton({ text, ...attar }: CopyButtonProps) {
  const [isCopy, setIsCopy] = useState(false);
  const { t } = useTranslation();
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
    <button onClick={copy} title={t("components.copy")} {...attar} type='button'>
      {isCopy ? t("components.copied") : t("components.copy")}
    </button>
  );
}
