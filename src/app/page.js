import LoginForm from "../../components/LoginForm";
import LoginImage from "../../public/LoginImage.png"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white  ">
      <main className="flex min-h-screen w-full max-w-5xl flex-col md:flex-row bg-white ">

        {/* LEFT */}
        <div className="flex w-full md:w-1/2 items-center justify-center px-10 py-20 bg-white " style={{backgroundImage: `url(${LoginImage.src})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="mb-8 p-7">
 <div className="max-w-sm">
            {/* <h1 className="text-3xl font-semibold text-red-600">
              Welcome Back  
            </h1>
            <p className="mt-4 text-zinc-600">
              Login to access your dashboard
            </p> */}
          </div>
        </div>
         
        </div>

        {/* RIGHT */}
        <div className="flex w-full md:w-1/2 items-center justify-center px-10 py-20">
          <LoginForm />
        </div>

      </main>
    </div>
  );
}
