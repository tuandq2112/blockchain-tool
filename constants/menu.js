import Image from "next/image";

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
            label: "Convert private key",
            key: "tool-blockchain-1",
          },
        ],
      },
    ],
  },
];
export default MenuConfig;
