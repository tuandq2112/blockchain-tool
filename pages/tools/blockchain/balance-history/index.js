import { Button, Col, DatePicker, Input, Row, message } from "antd";
import { ethers } from "ethers";
import useObjectState from "hooks/useObjectState";
import moment from "moment";
import { BalanceHistoryWrapper } from "styles/styled";
import { erc20ABI, useBlockNumber, usePublicClient } from "wagmi";
const BSC_MAINNET_PROVIDER = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/bsc"
);
function BalanceHistory() {
  const [state, setState] = useObjectState();
  const publicClient = usePublicClient();
  const onPickCoinDate = (date) => {
    setState({ dateCoinPicked: date });
  };
  const onPickTokenDate = (date) => {
    setState({ dateTokenPicked: date });
  };

  const onChangeCoinUserAddress = (event) => {
    setState({ coinUserAddress: event.target.value });
  };
  const onChangeTokenAddress = (event) => {
    setState({ tokenAddress: event.target.value });
  };
  const onChangeTokenUserAddress = (event) => {
    setState({ tokenUserAddress: event.target.value });
  };
  const { data } = useBlockNumber({ watch: true });
  const getBlockNumberByTimeStamp = (date) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentBlockNumber = await publicClient.getBlockNumber();
        let blockNumber = Number(currentBlockNumber);
        while (true) {
          let blockInfo;
          try {
            blockInfo = await publicClient.getBlock({ blockNumber });
          } catch (error) {
            continue;
          }
          if (
            moment.unix(Number(blockInfo.timestamp)).format("DD-MM-YYYY") ===
            date.format("DD-MM-YYYY")
          ) {
            resolve(blockInfo);

            break;
          } else {
            blockNumber -= 25000;
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  const handleQueryCoin = async () => {
    setState({ queryCoinLoading: true });
    getBlockNumberByTimeStamp(state.dateCoinPicked)
      .then(async (blockInfo) => {
        return await BSC_MAINNET_PROVIDER.getBalance(
          state.coinUserAddress,
          Number(blockInfo.number)
        );
      })
      .then((coinBalance) => {
        setState({ coinBalance: ethers.utils.formatUnits(coinBalance, 18) });
        message.success("Query success!");
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setState({ queryCoinLoading: false });
      });
  };
  const handleQueryToken = () => {
    setState({ queryTokenLoading: true });

    getBlockNumberByTimeStamp(state.dateTokenPicked)
      .then(async (blockInfo) => {
        const contract = new ethers.Contract(
          state.tokenAddress,
          erc20ABI,
          BSC_MAINNET_PROVIDER
        );
        return await contract.balanceOf(state.tokenUserAddress, {
          blockTag: Number(blockInfo.number),
        });
      })
      .then((tokenBalance) => {
        setState({
          tokenBalance: ethers.utils.formatUnits(tokenBalance, 18),
        });
        message.success("Query success!");
      })
      .catch((err) => {
        console.log(err);
        message.error(err);
      })
      .finally(() => {
        setState({ queryTokenLoading: false });
      });
  };
  return (
    <BalanceHistoryWrapper>
      <h1>Current block number: {data?.toString()}</h1>
      <Row gutter={[24, 24]} justify={"center"}>
        <Col span={8} gap>
          <h1>Coin Balance</h1>
          <DatePicker onChange={onPickCoinDate} value={state.dateCoinPicked} />
          <Input
            onChange={onChangeCoinUserAddress}
            placeholder="Input wallet address"
            value={state.coinUserAddress}
          />
          <Button onClick={handleQueryCoin} loading={state.queryCoinLoading}>
            Query
          </Button>
          <hr />
          <p>
            <span>Result: </span>
            <span>{state.coinBalance}</span>
          </p>
        </Col>
        <Col span={8}>
          {" "}
          <h1>Token Balance</h1>
          <DatePicker
            onChange={onPickTokenDate}
            value={state.dateTokenPicked}
          />{" "}
          <Input
            onChange={onChangeTokenAddress}
            placeholder="Input token address"
            value={state.tokenAddress}
          />
          <Input
            onChange={onChangeTokenUserAddress}
            placeholder="Input wallet address"
            value={state.tokenUserAddress}
          />
          <Button onClick={handleQueryToken} loading={state.queryTokenLoading}>
            Query
          </Button>
          <hr />
          <p>
            <span>Result: </span>
            <span>{state.tokenBalance}</span>
          </p>{" "}
        </Col>
      </Row>
    </BalanceHistoryWrapper>
  );
}

export default BalanceHistory;
