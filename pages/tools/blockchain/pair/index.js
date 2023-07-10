import { Button, Col, DatePicker, message, Row } from "antd";
import axios from "axios";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import moment from "moment";
import { erc20ABI, useAccount } from "wagmi";
import * as XLSX from "xlsx";

function Pair() {
  const [state, setState] = useObjectState();
  const { connector, isConnected } = useAccount();

  const exportToExcel = async () => {
    setState({ loading: true });

    const response = await axios.get(
      `https://raw.githubusercontent.com/tuandq2112/ivirse-account/develop/account.json`
    );
    let listAccount = response.data;
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
          const isSendToYourSelf =
            transaction.from?.toLowerCase() === transaction.to?.toLowerCase();

          if (!duplicateHash && accountIsAgent && !isSendToYourSelf) {
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

  const exportByTime = async () => {
    setState({ loading2: true });

    const response = await axios.get(
      `https://raw.githubusercontent.com/tuandq2112/ivirse-account/develop/account.json`
    );
    let listAccount = response.data;
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
    const diffDate = rangeTime[1].diff(rangeTime[0], "days") + 1;
    const dateArr = Array.from(Array(diffDate)).map((_, index) =>
      rangeTime[0].add(index, "days")
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
          const isSendToYourSelf =
            transaction.from?.toLowerCase() === transaction.to?.toLowerCase();

          if (!duplicateHash && accountIsAgent && !isSendToYourSelf) {
            uniqueTransactions.push(transaction);
          }

          return uniqueTransactions;
        }, []) || 0;

      let accountData = Array(maxAccount)
        .fill(null)
        .map((_, index) => accounts[index]);
      const listTransactionByTime = [];
      for (let i = 0; i < dateArr.length; i++) {
        const date = dateArr[i];

        listTransactionByTime.push(
          totalTransaction.filter(
            (subItem) =>
              Number(subItem.timeStamp) >= date.startOf("days").unix() &&
              Number(subItem.timeStamp) <= date.endOf("days").unix()
          )?.length
        );
      }

      let data = [
        user.name,
        ...accountData,
        totalTransaction.length,
        totalUSDT,
        totalIVI,
        totalBNB,
        totalIVI * 0.07,
        totalIVI * 0.07 + totalUSDT,
        ...listTransactionByTime,
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
      ...dateArr.map((item) => item.format("DD-MM-YYYY")),
    ]);
    const ws = XLSX.utils.aoa_to_sheet(result);
    const accountWidth = Array(maxAccount).fill({ wch: 50 });
    const dateWidth = Array(diffDate).fill({ wch: 20 });

    const columnWidths = [
      { wch: 30 },
      ...accountWidth,
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      ...dateWidth,
    ];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, moment().format("dd-MM-YYYY"));
    XLSX.writeFile(
      wb,
      `Tổng hợp lượt giao dịch ${moment().format("dd-MM-YYYY HH:mm:ss")}.xlsx`
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
      <Row gutter={[24, 24]} justify="start">
        <Col span={4}>
          <DatePicker.RangePicker onChange={handleChangeRangeTime} />
        </Col>
        <Col span={4}>
          <Button
            onClick={exportToExcel}
            loading={state.loading}
            disabled={isEmpty(state.filterTime)}
          >
            Export transaction
          </Button>
        </Col>
        <Col span={4}>
          <Button
            onClick={exportByTime}
            loading={state.loading2}
            disabled={isEmpty(state.filterTime)}
          >
            Export transaction by date
          </Button>
        </Col>
        {/* <Col span={8}>
          <p> Donate for me: 0x1A3fb2c99e25391E2f5Bd786399576C797E69cce</p>
          <br />
          <Input placeholder="Input amount" onChange={handleChangeAmount} />
          <br />
          <br />

          <Button disabled={!state.amount || !isConnected} onClick={submit}>
            Donate
          </Button>
        </Col> */}
      </Row>
    </div>
  );
}

export default Pair;
