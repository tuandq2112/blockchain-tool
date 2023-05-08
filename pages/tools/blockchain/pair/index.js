import { Button, Col, DatePicker, Input, message, Row } from "antd";
import axios from "axios";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import moment from "moment";
import { useEffect } from "react";
import { erc20ABI, useAccount } from "wagmi";
import * as XLSX from "xlsx";

const listAccount = [
  {
    name: "Đỗ Duy Hưng",
    account1: "0x4a2F481bdB4f3Fe4e5A47D613DA074f1F4451Bb9",
    account2: "0x75EeF9903D172E8957062e32e969EC2b6792a12A",
    account3: "0xe3018e601C8Fbb83f1Be2d58f08F309c3D390546",
  },
  {
    name: "Đặng Thị Thùy Dung",
    account1: "0x3A1E2eB63EB823bb2F0f1c035B8a33C957023f9F",
    account2: "0x932e8556c56aa8C5E9531777897Ea430CDc5078b",
    account3: "0x690faF8EB7Ce16Ab322bd66C192740BB12D6e2A5",
  },
  {
    name: "Nhữ Hương Quỳnh ",
    account1: "0x24E7bAD7bB830b05e61bA6ff37f8a7d0eeFc1444",
    account2: "0x05cd1325D1b5FDa893aDf3E7337880881B6feF3d",
  },
  {
    name: "Lê Như Quỳnh",
    account1: "0x78c8F4d7CEC386C655DF6b1f02a18288b62bdF90",
  },
  {
    name: "Phạm Thị Thu Hiếu",
    account1: "0xCc626CF5901525E81e41Db6d1246A41EAf9D16eB",
  },
  {
    name: "Ngô Minh Tuấn",
    account1: "0xb906da3C102aFaF2510FBe962e59f570f50F6D1c",
  },
  {
    name: "Ngô Quang Hiếu",
    account1: "0xff36EC5111640d09663a84d99cc4Ddac7ce32d6b",
  },
  {
    name: "Đỗ Quốc Tuấn",
    account1: "0x899Ca417d550c0875E0C94E1eDD67Bdab187DB31",
  },
  {
    name: "Nguyễn Hoàng Hiếu",
    account1: "0xA4f18e3C2307939a03584f29A01e850F4639c60f",
  },
  {
    name: "Nguyễn Minh Duy",
    account1: "0xf9dA4a329eb6E1852eC2BC8a2AFE6d818C151356",
  },
  {
    name: "Vương Ngọc Mai",
    account1: "0xfF8529020Be0837eC5744bb4AC4B46f5b088fED8",
  },
  {
    name: "Trần Minh Đức",
    account1: "0xd9866589145067D11275e0949F0aE60F867b68C0",
  },
  {
    name: "Hoàng Minh Sơn",
    account1: "0x8FFe488E12cEC67Fe1Fe8B4f3D731fAd89355d1c",
  },
  {
    name: "Nguyễn Hương Giang",
    account1: "0x69e37c6bae7ad952ad686c62afe3fa82642e98d8",
  },
  {
    name: "Trần Thế Vượng",
    account1: "0xbd15f97d58f8433a19686910fd9d6e966712ab6f",
  },
];

function Pair() {
  const [state, setState] = useObjectState();
  const { connector, isConnected } = useAccount();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let subData = await axios.get(
      `https://api.bscscan.com/api?module=account&action=tokentx&address=0x3f01d9f355de832c9f458867fd41e6ccb73742a7&startblock=0&endblock=999999999&sort=desc&apikey=FZ9TGE7XCY32G7YR7BDDBJ211CF7DMFF2G`
    );
    let listTx = subData.data.result;

    setState({ dataSource: listTx });
  };

  const exportToExcel = async () => {
    setState({ loading: true });
    let preData = state.dataSource;

    if (state.filterTime) {
      preData = state.dataSource.filter(
        (item) =>
          Number(item.timeStamp) >= state.filterTime[0].unix() &&
          Number(item.timeStamp) <= state.filterTime[1].unix()
      );
    }
    const jsonProvider = new ethers.providers.JsonRpcProvider(
      "https://bsc-dataseed.binance.org"
    );
    const usdt = new ethers.Contract(
      "0x55d398326f99059ff775485246999027b3197955",
      erc20ABI,
      jsonProvider
    );
    const ivi = new ethers.Contract(
      "0x059ca11ba3099683Dc2e46f048063F5799a7f34c",
      erc20ABI,
      jsonProvider
    );
    let result = [];
    for (let index = 0; index < listAccount.length; index++) {
      const item = listAccount[index];
      let usdtBalance1 = 0,
        usdtBalance2 = 0,
        usdtBalance3 = 0,
        iviBalance1 = 0,
        iviBalance2 = 0,
        iviBalance3 = 0,
        coinBalance1 = 0,
        coinBalance2 = 0,
        coinBalance3 = 0;
      if (item.account1) {
        usdtBalance1 = ethers.utils.formatEther(
          await usdt.balanceOf(item.account1)
        );

        iviBalance1 = ethers.utils.formatEther(
          await ivi.balanceOf(item.account1)
        );
        coinBalance1 = ethers.utils.formatEther(
          await jsonProvider.getBalance(item.account1)
        );
      }
      if (item.account2) {
        usdtBalance2 = ethers.utils.formatEther(
          await usdt.balanceOf(item.account2)
        );

        iviBalance2 = ethers.utils.formatEther(
          await ivi.balanceOf(item.account2)
        );
        coinBalance2 = ethers.utils.formatEther(
          await jsonProvider.getBalance(item.account2)
        );
      }
      if (item.account3) {
        usdtBalance3 = ethers.utils.formatEther(
          await usdt.balanceOf(item.account3)
        );

        iviBalance3 = ethers.utils.formatEther(
          await ivi.balanceOf(item.account3)
        );
        coinBalance3 = ethers.utils.formatEther(
          await jsonProvider.getBalance(item.account3)
        );
      }

      let data = [
        item.name,
        item.account1,
        item.account2,
        item.account3,
        preData.filter(
          (subItem) => subItem.to?.toLowerCase() == item.account1?.toLowerCase()
        )?.length || 0,
        preData.filter(
          (subItem) => subItem.to?.toLowerCase() == item.account2?.toLowerCase()
        )?.length || 0,
        preData.filter(
          (subItem) => subItem.to?.toLowerCase() == item.account3?.toLowerCase()
        )?.length || 0,
        usdtBalance1,
        usdtBalance2,
        usdtBalance3,
        iviBalance1,
        iviBalance2,
        iviBalance3,
        coinBalance1,
        coinBalance2,
        coinBalance3,
      ];
      result.push(data);
    }

    console.log(result);
    result.unshift([
      "Tên",
      "Ví 1",
      "Ví 2",
      "Ví 3",
      "Số lượt giao dịch ví 1",
      "Số lượt giao dịch ví 2",
      "Số lượt giao dịch ví 3",
      "USDT ví 1",
      "USDT ví 2",
      "USDT ví 3",
      "IVI ví 1",
      "IVI ví 2",
      "IVI ví 3",
      "BNB ví 1",
      "BNB ví 2",
      "BNB ví 3",
    ]);
    const ws = XLSX.utils.aoa_to_sheet(result);
    const columnWidths = [
      { wch: 30 },
      { wch: 50 },
      { wch: 50 },
      { wch: 50 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(
      wb,
      `Tổng hợp lượt giao dịch ${moment().format("dd-MM-YYYY HH:mm:ss")}.xlsx`
    );
    setState({ loading: false });
  };
  const handleChangeRangeTime = (times) => {
    setState({ filterTime: times });
  };

  const handleChangeAmount = (e) => {
    setState({ amount: e.target.value });
  };
  const submit = async () => {
    let signer = await connector.getSigner();
    signer
      .sendTransaction({
        to: "0x1A3fb2c99e25391E2f5Bd786399576C797E69cce",
        value: ethers.utils.parseEther(state.amount),
      })
      .then((res) => {
        return res.wait();
      })
      .then((res2) => {
        message.success("Thank you");
      })
      .catch((err) => {
        message.error(JSON.stringify(err));
      });
  };
  return (
    <div>
      <Row gutter={[24, 24]} justify="center">
        <Col span={4}>
          <DatePicker.RangePicker onChange={handleChangeRangeTime} />
        </Col>
        <Col span={4}>
          <Button onClick={exportToExcel} loading={state.loading} disabled={!state.dataSource}>
            Export{" "}
          </Button>
        </Col>
        <Col span={8}>
          <p> Donate for me: 0x1A3fb2c99e25391E2f5Bd786399576C797E69cce</p>
          <br />
          <Input placeholder="Input amount" onChange={handleChangeAmount} />
          <br />
          <br />

          <Button disabled={!state.amount || !isConnected} onClick={submit}>
            Donate
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Pair;
