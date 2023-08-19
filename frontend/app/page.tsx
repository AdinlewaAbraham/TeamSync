"use client";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      decide to either reidirect to login or home page
      <Link href={"/home"}>
        {" "}
        <a>redirect me</a>{" "}
      </Link>
      <button
        className="bg-red-400 p-7"
        onClick={async () => {
          const res = await fetch("/login");
          console.log(await res.json());
        }}
      >
        click me
      </button>
    </div>
  );
}
