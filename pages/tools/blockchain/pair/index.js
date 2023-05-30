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
    account4: "0x0091F923D2a6Dd103692797E58801D6B5372F422",
  },
  {
    name: "Đặng Thị Thùy Dung",
    account1: "0x3A1E2eB63EB823bb2F0f1c035B8a33C957023f9F",
    account2: "0x932e8556c56aa8C5E9531777897Ea430CDc5078b",
    account3: "0x690faF8EB7Ce16Ab322bd66C192740BB12D6e2A5",
    account4: null,
  },
  {
    name: "Nhữ Hương Quỳnh ",
    account1: "0x24E7bAD7bB830b05e61bA6ff37f8a7d0eeFc1444",
    account2: "0x05cd1325D1b5FDa893aDf3E7337880881B6feF3d",
    account3: "0x7FaB9f182Fa86Fa4fD5b0E43eB43390439c16D4F",
    account4: null,
  },
  {
    name: "Lê Như Quỳnh",
    account1: "0x78c8F4d7CEC386C655DF6b1f02a18288b62bdF90",
    account2: "0xfAd4eB6a8a1745136Ee7a25c855cB96B500d104c",
    account3: null,
    account4: null,
  },
  {
    name: "Phạm Thị Thu Hiếu",
    account1: "0xCc626CF5901525E81e41Db6d1246A41EAf9D16eB",
    account2: "0x0A675A1274DF29B943A7DB13D44DD7F670A1DBd2",
    account3: null,
    account4: null,
  },
  {
    name: "Ngô Minh Tuấn",
    account1: "0xb906da3C102aFaF2510FBe962e59f570f50F6D1c",
    account2: "0x61Ba5135460f0744E529742a424E150ad81E4c07",
    account3: null,
    account4: null,
  },
  {
    name: "Ngô Quang Hiếu",
    account1: "0xff36EC5111640d09663a84d99cc4Ddac7ce32d6b",
    account2: "0x87235b9B34FCf872D561d477fB06a08f5581D683",
    account3: null,
    account4: null,
  },
  {
    name: "Đỗ Quốc Tuấn",
    account1: "0x899Ca417d550c0875E0C94E1eDD67Bdab187DB31",
    account2: "0x3b2CAF000A05A30bD16391F8a9c6c61983C18F56",
    account3: null,
    account4: null,
  },

  {
    name: "Nguyễn Minh Duy",
    account1: "0xf9dA4a329eb6E1852eC2BC8a2AFE6d818C151356",
    account2: null,
    account3: null,
    account4: null,
  },
  {
    name: "Trần Minh Đức",
    account1: "0xd9866589145067D11275e0949F0aE60F867b68C0",
    account2: null,
    account3: null,
    account4: null,
  },
  {
    name: "Hoàng Minh Sơn",
    account1: "0x8FFe488E12cEC67Fe1Fe8B4f3D731fAd89355d1c",
    account2: "0x38122D39251Dd6f2D0Cd3d28bCC5FB55423CD632",
  },
  {
    name: "Nguyễn Hương Giang",
    account1: "0x69e37c6bae7ad952ad686c62afe3fa82642e98d8",
    account2: null,
    account3: null,
    account4: null,
  },
  {
    name: "Trần Thế Vượng",
    account1: "0xbd15f97d58f8433a19686910fd9d6e966712ab6f",
    account2: "0x8c3F091c2016b19F16a18CBE0EDE3d9580D111EB",
    account3: null,
    account4: null,
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
    let rangeTime = state.filterTime;
    if (state.filterTime) {
      preData = state.dataSource.filter(
        (item) =>
          Number(item.timeStamp) >= rangeTime[0].unix() &&
          Number(item.timeStamp) <= rangeTime[1].unix()
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
    const activeAccount = listAccount.filter((item) => item.active !== false);
    for (let index = 0; index < activeAccount.length; index++) {
      const item = activeAccount[index];
      let usdtBalance1 = 0,
        usdtBalance2 = 0,
        usdtBalance3 = 0,
        usdtBalance4 = 0,
        iviBalance1 = 0,
        iviBalance2 = 0,
        iviBalance3 = 0,
        iviBalance4 = 0,
        coinBalance1 = 0,
        coinBalance2 = 0,
        coinBalance3 = 0,
        coinBalance4 = 0;
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

      if (item.account4) {
        usdtBalance4 = ethers.utils.formatEther(
          await usdt.balanceOf(item.account4)
        );

        iviBalance4 = ethers.utils.formatEther(
          await ivi.balanceOf(item.account4)
        );
        coinBalance4 = ethers.utils.formatEther(
          await jsonProvider.getBalance(item.account4)
        );
      }
      const totalTransaction =
        preData.filter(
          (subItem) =>
            subItem.to?.toLowerCase() == item.account1?.toLowerCase() ||
            subItem.to?.toLowerCase() == item.account2?.toLowerCase() ||
            subItem.to?.toLowerCase() == item.account3?.toLowerCase() ||
            subItem.to?.toLowerCase() == item.account4?.toLowerCase()
        )?.length || 0;

      const totalUSDT =
        Number(usdtBalance1) +
        Number(usdtBalance2) +
        Number(usdtBalance3) +
        Number(usdtBalance4);
      const totalIVI =
        Number(iviBalance1) +
        Number(iviBalance2) +
        Number(iviBalance3) +
        Number(iviBalance4);
      const totalBNB =
        Number(coinBalance1) +
        Number(coinBalance2) +
        Number(coinBalance3) +
        Number(coinBalance4);
      let data = [
        item.name,
        item.account1,
        item.account2,
        item.account3,
        item.account4,
        totalTransaction,
        totalUSDT,
        totalIVI,
        totalBNB,
        totalIVI * 0.07,
        totalIVI * 0.07 + totalUSDT,
      ];
      result.push(data);
    }
    result.sort((a, b) => b[4] - a[4]);
    result.unshift([
      "Tên",
      "Ví 1",
      "Ví 2",
      "Ví 3",
      "Tổng lượt giao dịch của 3 ví",
      "Tổng USDT của 3 ví",
      "Tổng IVI của 3 ví",
      "Tổng BNB của 3 ví",
      "IVI-USDT",
      "Total USDT",
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

  const exportVolumeToExcel = async () => {
    setState({ loading2: true });
    let preData = state.dataSource;
    let rangeTime = state.filterTime;

    if (rangeTime) {
      preData = state.dataSource.filter(
        (item) =>
          Number(item.timeStamp) >= rangeTime[0].startOf("days").unix() &&
          Number(item.timeStamp) <= rangeTime[1].endOf("days") &&
          item?.contractAddress?.toLowerCase() ===
            "0x55d398326f99059ff775485246999027b3197955".toLowerCase()
      );
    }

    let diffDate =
      moment.duration(rangeTime[1].diff(rangeTime[0])).asDays() || 1;
    const result = [];
    for (let index = 0; index < diffDate; index++) {
      const day = moment(rangeTime[0]).add(index, "days");
      console.log(
        preData
          .filter(
            (item) =>
              Number(item.timeStamp) >= day.startOf("days").unix() &&
              Number(item.timeStamp) <= day.endOf("days").unix()
          )
          // .map((item) => ({
          //   from: item.from,
          //   time: moment
          //     .unix(Number(item.timeStamp))
          //     .format("DD-MM-YYYY HH:mm:ss"),
          //   value: item.value,
          // }))
      );
      const volume = preData
        .filter(
          (item) =>
            Number(item.timeStamp) >= day.startOf("days").unix() &&
            Number(item.timeStamp) <= day.endOf("days").unix()
        )
        ?.reduce((a, b) => a + Number(b.value) / 1e18, 0);
      result.push([day.format("DD-MM-YYYY"), volume]);
    }

    result.unshift(["Date (DD-MM-YYYY)", "Volume (USDT)"]);
    console.log(result);
    const ws = XLSX.utils.aoa_to_sheet(result);
    const columnWidths = [{ wch: 70 }, { wch: 50 }];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(
      wb,
      `Tổng hợp volume ${moment().format("dd-MM-YYYY HH:mm:ss")}.xlsx`
    );
    setState({ loading2: false });
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
  console.log(state);
  return (
    <div>
      <Row gutter={[24, 24]} justify="space-around">
        <Col span={4}>
          <DatePicker.RangePicker onChange={handleChangeRangeTime} />
        </Col>
        <Col span={4}>
          <Button
            onClick={exportToExcel}
            loading={state.loading}
            disabled={!state.dataSource}
          >
            Export transaction
          </Button>
        </Col>
        <Col span={4}>
          <Button
            onClick={exportVolumeToExcel}
            loading={state.loading2}
            disabled={!state.dataSource || !state.filterTime}
          >
            Export volume
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
