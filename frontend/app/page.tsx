import Link from "next/link";
export default function Home() {
  return (
      <div>
        decide to either reidirect to login or home page
        <Link href={'/home'}  > <a >redirect me</a> </Link>
      </div>
  );
}
