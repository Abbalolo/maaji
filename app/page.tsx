import Image from "next/image";
import fifa2 from "../app/assets/fifa2.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-cente ">
      <Image
      className="object-cover h-screen"
        src={fifa2}
        alt="Example Image"
        width={500}
        height={10}
        priority={true}
      />
      <div className="flex flex-col w-full gap-5 text-[14px] p-7 absolute bottom-0">
        <Link
          href="/auth/signup"
          className="btn-grad text-white w-full rounded-md "
        >
          SIGN UP
        </Link>
        <Link
          href="/auth/login"
          className="bg-slate-800 hover:bg-slate-700 transition-all duration-300 text-center p-[10px] rounded-lg text-white w-full"
        >
          LOG IN
        </Link>
      </div>
    </div>
  );
}
