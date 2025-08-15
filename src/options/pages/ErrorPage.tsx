import { useNavigate, useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ErrorPage() {
  const error: any = useRouteError();
  const { t } = useTranslation();
  const navigate = useNavigate();
  console.error(error);

  function handleToHome() {
    navigate("/");
  }
  return (
    <div className='flex justify-center items-center h-full text-center bg-base-100 border-base-300 text-base-content'>
      <div>
        <h1 className='text-22px font-600 mb-8'>Oops!</h1>
        <p className='mb-4 text-16px'>{t("ErrorPage.errorOccurred")}</p>
        <p className='font-200 text-12px mb4'>
          <i>{error.statusText || error.message}</i>
        </p>
        <button className='btn btn-info btn-sm' type='button' title={t("ErrorPage.returnHome")} onClick={handleToHome}>
          {t("ErrorPage.returnHome")}
        </button>
      </div>
    </div>
  );
}
