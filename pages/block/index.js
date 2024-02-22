import { Button, Col, Row } from "antd";
import { ethers } from "ethers";
import { isEmpty } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function BlockPage() {
  useEffect(() => {
    const intervalRef = setInterval(() => {
      getBlockInfo();
    }, 5 * 1000);
    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  const [blockInfo, setBlockInfo] = useState();
  const [blockNumber, setBlockNumber] = useState();

  const getBlockInfo = async () => {
    const BSC_MAINNET_PROVIDER = new ethers.providers.JsonRpcProvider(
      "https://rpc.ankr.com/bsc"
    );
    const blockNumber = await BSC_MAINNET_PROVIDER.getBlockNumber();
    const blockInfo = await BSC_MAINNET_PROVIDER.getBlock(blockNumber);
    const prevBlock = await BSC_MAINNET_PROVIDER.getBlock(
      Number(blockNumber) - 1
    );

    if (!isEmpty(blockInfo)) {
      blockInfo.totalTransaction = blockInfo.transactions.length;
      blockInfo.blockTimeDiff = blockInfo.timestamp - prevBlock.timestamp;
      setBlockInfo(blockInfo);
      setBlockNumber(blockNumber);
    }
  };
  const downloadFile = () => {
    const result = [["Tên trường", "Giá trị"]];
    Object.keys(blockInfo).forEach((key) => {
      result.push([key, JSON.stringify(blockInfo[key])]);
    });
    const ws = XLSX.utils.aoa_to_sheet(result);

    const columnWidths = [{ wch: 20 }, { wch: 30 }];
    ws["!cols"] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, moment().format("dd-MM-YYYY"));
    XLSX.writeFile(wb, `${blockNumber}.xlsx`);
    // const fileName = blockNumber;
    // const json = JSON.stringify(blockInfo, null, 2);
    // const blob = new Blob([json], { type: "application/json" });
    // const href = URL.createObjectURL(blob);

    // // create "a" HTLM element with href to file
    // const link = document.createElement("a");
    // link.href = href;
    // link.download = fileName + ".json";
    // document.body.appendChild(link);
    // link.click();

    // // clean up "a" element & remove ObjectURL
    // document.body.removeChild(link);
    // URL.revokeObjectURL(href);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col md={12} sm={24}>
        <pre>{JSON.stringify(blockInfo, null, 2)}</pre>
      </Col>
      <Col md={12} sm={24}>
        <Button onClick={downloadFile}>Download as JSON</Button>
      </Col>
    </Row>
  );
}

export default BlockPage;
