import { Button, Col, Row, Table } from "antd";
import masterChefPath from "assets/images/masterChef.png";
import axios from "axios";
import useObjectState from "hooks/useObjectState";
import moment from "moment";
import { useEffect } from "react";
import * as XLSX from "xlsx";

const sleep = (time = 5000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

function Pair() {
  const [state, setState] = useObjectState({ dataSource: [] });

  const fetchData = async () => {
    const response = await axios.get(
      `https://raw.githubusercontent.com/tuandq2112/ivirse-account/develop/ksk.json?time=${moment().format(
        "HH:mm:ss"
      )}`
    );
    let listAccount = response.data;

    for (let index = 0; index < listAccount.length; index++) {
      const data = listAccount[index];
      const response = await axios.get(
        `https://api.bscscan.com/api?module=account&action=tokentx&address=${data.contract}&contractAddress=0x059ca11ba3099683dc2e46f048063f5799a7f34c&startblock=0&endblock=999999999&sort=desc&apikey=57HPF862X6UYBMRWYT52842N9ZUVV8QA59`
      );
      const transactions = response.data.result;
      data.transactions = transactions.filter(
        (item) => item.to === data.contract
      );
      data.totalTx = data.transactions.length;
      data.totalToken = data.transactions.reduce(
        (a, b) => a + Number(b.value) / 1e18,
        0
      );

      await sleep(1000);
    }
    listAccount.sort((a, b) => b.totalToken - a.totalToken);
    const allTransaction = listAccount.reduce(
      (a, b) => [...a, ...b.transactions],
      []
    );
    const listUserAddress = new Set(allTransaction.map((item) => item.from));
    const userWithToken = [...listUserAddress].map((address) => ({
      address,
      amount: allTransaction
        .filter((subItem) => address == subItem.from)
        .reduce((a, b) => a + Number(b.value) / 1e18, 0),
      countTx: allTransaction.filter((subItem) => address == subItem.from)
        .length,
    }));
    userWithToken.sort((a, b) => b.amount - a.amount);
    setState({
      dataSource: listAccount,
      userWithToken: userWithToken.slice(0, 5),
    });
  };
  const exportTeam = () => {
    const data = state.dataSource.map((item) => [
      item.name,
      item.address,
      item.totalTx,
      item.totalToken,
    ]);
    data.unshift([
      "Đội",
      "Địa chỉ",
      "Tổng lượt mua bán",
      "Tổng số lượng ivi giao dịch",
    ]);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const columnWidths = [{ wch: 30 }, { wch: 50 }, { wch: 20 }, { wch: 30 }];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, moment().format("dd-MM-YYYY"));
    XLSX.writeFile(
      wb,
      `Masterchef team report ${moment().format("dd-MM-YYYY HH:mm:ss")}.xlsx`
    );
  };

  const exportUser = () => {
    const data = state.userWithToken.map((item) => [
      item.address,
      item.countTx,
      item.amount,
    ]);
    data.unshift(["Ví", "Số lần giao dịch", "Số lượng"]);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const columnWidths = [{ wch: 50 }, { wch: 20 }, { wch: 20 }];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, moment().format("dd-MM-YYYY"));
    XLSX.writeFile(
      wb,
      `Masterchef user report ${moment().format("dd-MM-YYYY HH:mm:ss")}.xlsx`
    );
  };

  useEffect(() => {
    fetchData();
    let intervalRef = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(intervalRef);
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url('${masterChefPath.src}')`,
        height: "100%",
      }}
    >
      <div>
        <Row gutter={[24, 24]} justify="center">
          <Col span={11}>
            <h1 style={{ color: "black", fontWeight: "700", fontSize: "40px" }}>
              Xếp hạng đội
            </h1>
            <Table
              dataSource={state.dataSource}
              columns={[
                {
                  title: "Hạng",
                  dataIndex: ["index"],
                  key: "index",
                  render: (...args) => args[2] + 1,
                },
                {
                  title: "Đội",
                  dataIndex: ["name"],
                  key: "name",
                },

                {
                  title: "Tổng lượt mua bán",
                  dataIndex: ["totalTx"],
                  key: "totalTx",
                },
                {
                  title: "Tổng số lượng ivi giao dịch",
                  dataIndex: ["totalToken"],
                  key: "totalToken",
                },
              ]}
              rowKey={"address"}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell>
                    <span style={{ fontWeight: "bold" }}>Export</span>
                  </Table.Summary.Cell>

                  <Table.Summary.Cell>
                    <Button onClick={exportTeam}>Export</Button>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
              pagination={false}
            />
          </Col>
          <Col span={11}>
            <h1 style={{ color: "black", fontWeight: "700", fontSize: "40px" }}>
              Xếp hạng người dùng
            </h1>
            <Table
              dataSource={state.userWithToken}
              columns={[
                {
                  title: "Hạng",
                  dataIndex: ["index"],
                  key: "index",
                  render: (...args) => args[2] + 1,
                },
                {
                  title: "Địa chỉ",
                  dataIndex: ["address"],
                  key: "address",
                },
                {
                  title: "Số giao dịch",
                  dataIndex: ["countTx"],
                  key: "countTx",
                },
                {
                  title: "Số IVI",
                  dataIndex: ["amount"],
                  key: "amount",
                },
              ]}
              rowKey={"address"}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell>
                    <span style={{ fontWeight: "bold" }}>Export</span>
                  </Table.Summary.Cell>

                  <Table.Summary.Cell>
                    <Button onClick={exportUser}>Export</Button>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Pair;
