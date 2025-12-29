import Link from "next/link";
import { FaOpencart } from "react-icons/fa";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-3 items-center">
      <span className="text-4xl text-blue-600">
        <FaOpencart />
      </span>

      <div>
        <p className="text-xl font-semibold whitespace-nowrap">
          Quali<span className="text-blue-600">Bytes</span>
        </p>
      </div>
    </Link>
  );
};

export default Logo;