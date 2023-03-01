import { Button } from "antd";
import { create } from "ipfs-http-client";
import { useSelector } from "react-redux";

function Marketplace() {

  const handleCreate = async () => {
    const client = create("http://14.225.254.58:2101/api/v0");
    async function fetchDataFromPath(ipfsPath) {
      try {
        const fileStream = client.cat(ipfsPath);
        const chunks = [];
        for await (const chunk of fileStream) {
          chunks.push(chunk);
        }
        const data = Buffer.concat(chunks).toString();
        return data;
      } catch (error) {
        console.error(error);
      }
    }

    // const file = await client.get(
    //   "QmbDe3rtrpiPpNnDebKDVh92DbhmFHVpmnh6ngJxZ246k2"
    // );
    fetchDataFromPath("QmbDe3rtrpiPpNnDebKDVh92DbhmFHVpmnh6ngJxZ246k2").then(
      console.log
    );
  };
  return (
    <div>
      <Button onClick={handleCreate}>CLick me!</Button>
    </div>
  );
}
export async function getStaticProps() {
  return {
    props: {},
  };
}
export default Marketplace;
