import Image from "next/image";
import Link from "next/link";

const MenuConfig = [
  {
    label: <Image alt="" src={"/logoweb.png"} width="40" height="50" />,
    key: 1,
  },
  {
    label: "Tools",
    key: 2,
    children: [
      {
        type: "group",
        label: "Blockchain",
        children: [
          {
            label: (
              <Link href={"/tools/blockchain/private"}>
                Convert private key
              </Link>
            ),
            key: "tool-blockchain-1",
          },
          {
            label: (
              <Link href={"/tools/blockchain/beauty-wallet"}>
                Create beauty wallet
              </Link>
            ),
            key: "tool-blockchain-2",
          },
        ],
      },
    ],
  },
];
export default MenuConfig;
