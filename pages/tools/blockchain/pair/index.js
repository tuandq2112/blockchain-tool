import { Button, Col, DatePicker, Input, message, Row } from "antd";
import axios from "axios";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import moment from "moment";
import { erc20ABI, useAccount } from "wagmi";
import * as XLSX from "xlsx";

const listAccount = [
  {
    name: "Đỗ Duy Hưng",
    accounts: [
      "0x4a2F481bdB4f3Fe4e5A47D613DA074f1F4451Bb9",
      "0x0091F923D2a6Dd103692797E58801D6B5372F422",
    ],
  },
  {
    name: "Đặng Thị Thùy Dung",
    accounts: [
      "0x3A1E2eB63EB823bb2F0f1c035B8a33C957023f9F",
      "0x932e8556c56aa8C5E9531777897Ea430CDc5078b",
    ],
  },
  {
    name: "Nhữ Hương Quỳnh",
    accounts: [
      "0x05cd1325D1b5FDa893aDf3E7337880881B6feF3d",
      "0x7FaB9f182Fa86Fa4fD5b0E43eB43390439c16D4F",
    ],
  },
  {
    name: "Lê Như Quỳnh",
    accounts: [
      "0x78c8F4d7CEC386C655DF6b1f02a18288b62bdF90",
      "0xfAd4eB6a8a1745136Ee7a25c855cB96B500d104c",
    ],
  },
  {
    name: "Phạm Thị Thu Hiếu",
    accounts: [
      "0xCc626CF5901525E81e41Db6d1246A41EAf9D16eB",
      "0x82BDE53327A556F52352aedc3c17720A6889532a",
    ],
  },
  {
    name: "Ngô Minh Tuấn",
    accounts: [
      "0xb906da3C102aFaF2510FBe962e59f570f50F6D1c",
      "0x61Ba5135460f0744E529742a424E150ad81E4c07",
    ],
  },
  {
    name: "Ngô Quang Hiếu",
    accounts: [
      "0xff36EC5111640d09663a84d99cc4Ddac7ce32d6b",
      "0x87235b9B34FCf872D561d477fB06a08f5581D683",
    ],
  },
  {
    name: "Đỗ Quốc Tuấn",
    accounts: [
      "0x899Ca417d550c0875E0C94E1eDD67Bdab187DB31",
      "0x3b2CAF000A05A30bD16391F8a9c6c61983C18F56",
    ],
  },
  {
    name: "Trần Minh Đức",
    accounts: [
      "0xf9dA4a329eb6E1852eC2BC8a2AFE6d818C151356",
      "0xd9866589145067D11275e0949F0aE60F867b68C0",
    ],
  },
  {
    name: "Hoàng Minh Sơn",
    accounts: [
      "0xd9866589145067D11275e0949F0aE60F867b68C0",
      "0x38122D39251Dd6f2D0Cd3d28bCC5FB55423CD632",
    ],
  },
  {
    name: "Trần Thế Vượng",
    accounts: [
      "0xbd15f97d58f8433a19686910fd9d6e966712ab6f",
      "0x8c3F091c2016b19F16a18CBE0EDE3d9580D111EB",
    ],
  },
  {
    name: "Nguyễn Minh Duy",
    accounts: ["0x69e37c6bae7ad952ad686c62afe3fa82642e98d8"],
  },
  {
    name: "Nguyễn Hương Giang",
    accounts: ["0xbd15f97d58f8433a19686910fd9d6e966712ab6f"],
  },
];

function Pair() {
  const [state, setState] = useObjectState();
  const { connector, isConnected } = useAccount();

  const exportToExcel = async () => {
    setState({ loading: true });
    let listTx = await axios.get(
      "https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x059ca11ba3099683Dc2e46f048063F5799a7f34c&startblock=0&endblock=999999999&sort=desc&apikey=FZ9TGE7XCY32G7YR7BDDBJ211CF7DMFF2G"
    );
    let preData = listTx.data.result;

    let rangeTime = state.filterTime;
    if (state.filterTime) {
      preData = preData.filter(
        (item) =>
          Number(item.timeStamp) >= rangeTime[0].startOf("days").unix() &&
          Number(item.timeStamp) <= rangeTime[1].endOf("days").unix()
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
    let maxAccount = Math.max(
      ...listAccount.map((item) => item.accounts.length)
    );

    for (let index = 0; index < listAccount.length; index++) {
      const user = listAccount[index];
      const accounts = user.accounts;
      let totalUSDT = 0,
        totalIVI = 0,
        totalBNB = 0;
      for (let index = 0; index < accounts.length; index++) {
        totalUSDT += Number(
          ethers.utils.formatEther(await usdt.balanceOf(accounts[index]))
        );
        totalIVI += Number(
          ethers.utils.formatEther(await ivi.balanceOf(accounts[index]))
        );
        totalBNB += Number(
          ethers.utils.formatEther(
            await jsonProvider.getBalance(accounts[index])
          )
        );
      }

      const totalTransaction =
        preData?.reduce((uniqueTransactions, transaction) => {
          const duplicateHash = uniqueTransactions.some(
            (uniqueTransaction) => uniqueTransaction.hash === transaction.hash
          );

          const accountIsAgent = accounts
            .map((account) => account.toLowerCase())
            .some(
              (account) =>
                account == transaction.to?.toLowerCase() ||
                account == transaction.from?.toLowerCase()
            );

          if (!duplicateHash && accountIsAgent) {
            uniqueTransactions.push(transaction);
          }

          return uniqueTransactions;
        }, [])?.length || 0;

      let accountData = Array(maxAccount)
        .fill(null)
        .map((_, index) => accounts[index]);

      let data = [
        user.name,
        ...accountData,
        totalTransaction,
        totalUSDT,
        totalIVI,
        totalBNB,
        totalIVI * 0.07,
        totalIVI * 0.07 + totalUSDT,
      ];
      result.push(data);
    }
    result.sort((a, b) => b[maxAccount + 1] - a[maxAccount + 1]);
    const accountTitle = Array.from(Array(maxAccount)).map(
      (_, index) => "Ví " + index + 1
    );
    result.unshift([
      "Tên",
      ...accountTitle,
      `Tổng lượt giao dịch của ${maxAccount} ví`,
      `Tổng USDT của ${maxAccount} ví`,
      `Tổng IVI của ${maxAccount} ví`,
      `Tổng BNB của ${maxAccount} ví`,
      `IVI-USDT`,
      `Total USDT`,
    ]);
    const ws = XLSX.utils.aoa_to_sheet(result);
    const accountWidth = Array(maxAccount).fill({ wch: 50 });
    const columnWidths = [
      { wch: 30 },
      ...accountWidth,
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, moment().format("dd-MM-YYYY"));
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
      moment.duration(rangeTime[1].diff(rangeTime[0])).asDays() + 1;
    const result = [];
    for (let index = 0; index < diffDate; index++) {
      const day = rangeTime[0].add(index, "days");
      console.log(day);
      const volume = preData
        .filter(
          (item) =>
            Number(item.timeStamp) >= day.startOf("days").unix() &&
            Number(item.timeStamp) <= day.endOf("days").unix()
        )
        ?.reduce((a, b) => a + Number(b.value) / 1e18, 0);
      result.push([day.format("DD-MM-YYYY"), volume]);
    }
    console.log(result);
    result.unshift(["Date (DD-MM-YYYY)", "Volume (USDT)"]);
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
            // disabled={!state.dataSource}
          >
            Export transaction
          </Button>
        </Col>
        {/* <Col span={4}>
          <Button
            onClick={exportVolumeToExcel}
            loading={state.loading2}
            disabled={!state.dataSource || !state.filterTime}
          >
            Export volume
          </Button>
        </Col> */}
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
