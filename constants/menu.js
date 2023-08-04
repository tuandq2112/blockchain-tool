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
    key: "home",
  },
  {
    label: <div>Tools</div>,
    key: "tools",
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
            key: "private",
          },
          {
            label: (
              <Link href={"/tools/blockchain/beauty-wallet"}>
                Generate beauty wallet
              </Link>
            ),
            key: "beauty-wallet",
          },
          {
            label: <Link href={"/tools/blockchain/deploy"}>Deploy</Link>,
            key: "deploy",
          },
          {
            label: (
              <Link href={"/tools/blockchain/pair"}>Export transaction</Link>
            ),
            key: "pair",
          },
          {
            label: (
              <Link href={"/tools/blockchain/balance-history"}>
                Get balance by time
              </Link>
            ),
            key: "balance-history",
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
