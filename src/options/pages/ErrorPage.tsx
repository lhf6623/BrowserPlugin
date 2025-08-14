import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  function handleToHome() {
    navigate("/");
  }
  return (
    <div className='flex justify-center items-center h-full text-center bg-base-100 border-base-300 text-base-content'>
      <div>
        <h1 className='text-22px font-600 mb-8'>Oops!</h1>
        <p className='mb-4 text-16px'>抱歉，发生了意外错误。</p>
        <p className='font-200 text-12px mb4'>
          <i>{error.statusText || error.message}</i>
        </p>
        <button className='btn btn-info btn-sm' type='button' title='返回主页' onClick={handleToHome}>
          返回主页
        </button>
      </div>
    </div>
  );
}
