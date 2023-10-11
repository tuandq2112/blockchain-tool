import { Button, Col, DatePicker, Row, Table } from "antd";
import axios from "axios";
import { PairABI } from "builder/PairBuilder";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import { isEmpty } from "lodash";
import moment from "moment";
import { formatUnits } from "viem";
import { erc20ABI, useContractEvent, useContractRead } from "wagmi";
import * as XLSX from "xlsx";

function Pair() {
  const [state, setState] = useObjectState({ dataSource: [] });
  const { data } = useContractRead({
    address: "0x3F01d9F355dE832c9F458867fD41e6cCb73742a7",
    abi: PairABI,
    functionName: "getReserves",
    watch: true,
    chainId: 56,
  });

  useContractEvent({
    address: "0x3F01d9F355dE832c9F458867fD41e6cCb73742a7",
    abi: PairABI,
    eventName: "Swap",
    listener: (events) => {
      console.log(events);
      const dataSource = [...state.dataSource, ...events];
      setState({ dataSource });
    },
    chainId: 56,
  });

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
    const pairContract = new ethers.Contract(
      "0x3F01d9F355dE832c9F458867fD41e6cCb73742a7",
      PairABI,
      jsonProvider
    );
    const reservers = await pairContract.getReserves();
    const iviToUsdt = reservers[1].toString() / reservers[0].toString();
    console.log(iviToUsdt);
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
        totalIVI * iviToUsdt,
        totalIVI * iviToUsdt + totalUSDT,
      ];
      result.push(data);
    }
    // result.sort((a, b) => b[maxAccount + 1] - a[maxAccount + 1]);
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

  const handleChangeRangeTime = (times) => {
    setState({ filterTime: times });
  };

  const rate = `1 IVI =  ${
    data
      ? Number(formatUnits(data[1], 18)) / Number(formatUnits(data[0], 18))
      : 0
  } USDT`;

  console.log(state);
  return (
    <div>
      <Row gutter={[24, 24]} justify="center">
        <Col span={24}>
          <DatePicker.RangePicker onChange={handleChangeRangeTime} />
          <Button
            onClick={exportToExcel}
            loading={state.loading}
            disabled={isEmpty(state.filterTime)}
          >
            Export transaction
          </Button>
        </Col>

        <Col span={8}>
          <h1>{rate}</h1>
        </Col>

        <Col span={16}>
          <Table
            dataSource={state.dataSource}
            columns={[
              {
                title: "Sender",
                dataIndex: ["args", "sender"],
                key: "sender",
                render: (sender) => {
                  const isBot =
                    "0x00000000001f8b68515EfB546542397d3293CCfd" == sender;
                  return (
                    <div
                      style={
                        isBot
                          ? { background: "red", color: "white" }
                          : { background: "green", color: "white" }
                      }
                    >
                      {sender}
                    </div>
                  );
                },
              },
              {
                title: "IVI in",
                dataIndex: ["args", "amount0In"],
                key: "amount0In",
                render: (value) => formatUnits(value, 18),
              },
              {
                title: "IVI out",
                dataIndex: ["args", "amount0Out"],
                key: "amount0Out",
                render: (value) => formatUnits(value, 18),
              },
              {
                title: "USDT in",
                dataIndex: ["args", "amount1In"],
                key: "amount1In",
                render: (value) => formatUnits(value, 18),
              },
              {
                title: "USDT out",
                dataIndex: ["args", "amount1Out"],
                key: "amount1Out",
                render: (value) => formatUnits(value, 18),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Pair;
