import Image from "next/image";
import Link from "next/link";
const MenuConfig = [
  {
    label: (
      <Link href={"/"}>
        <Image
          alt="Picture of the author"
          src={"/logoweb.png"}
          width="40"
          height="50"
        />{" "}
      </Link>
    ),
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
                Phrase to private key
              </Link>
            ),
            key: "tool-blockchain-1",
          },
          {
            label: (
              <Link href={"/tools/blockchain/beauty-wallet"}>
                Generate beauty wallet
              </Link>
            ),
            key: "tool-blockchain-2",
          },
          {
            label: <Link href={"/tools/blockchain/deploy"}>Deploy</Link>,
            key: "tool-blockchain-3",
          },
          {
            label: (
              <Link href={"/tools/blockchain/pair"}>Export transaction</Link>
            ),
            key: "tool-blockchain-4",
          },
          {
            label: (
              <Link href={"/tools/blockchain/balance-history"}>
                Get balance by time
              </Link>
            ),
            key: "tool-blockchain-5",
          },
        ],
      },
    ],
  },
];

const AvatarDropdownConfig = [
  {
    key: "1",
    label: <Link href={"/profile"}>Profile</Link>,
  },
  {
    key: "2",
    label: <Link href={"/collection"}>Collection</Link>,
  },
];
export { AvatarDropdownConfig, MenuConfig };
