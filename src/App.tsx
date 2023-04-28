import React, { useState, useEffect } from "react";
import { PieChartComponent } from "./component/PieChartComponent";


const x_api_key = process.env.REACT_APP_X_API_KEY;

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.livecoinwatch.com/coins/list", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": x_api_key!,
          },
          body: JSON.stringify({
            currency: "USD",
            sort: "rank",
            order: "ascending",
            offset: 0,
            limit: 2000, // Increase the limit to get more coins
            meta: false,
          }),
        });
        const rawData = await response.json();

        // Filter the rawData to get NEXA and KASPA coins
        const filteredData = rawData.filter(
          (item: any) => item.code === "KAS" || item.code === "NEXA" || item.code === "RXD" ,
        );

        const transformedData = filteredData.map((item: any) => ({
          label: `${item.code} (Cap: $${item.cap.toLocaleString()}, Vol: $${item.volume.toLocaleString()})`,
          sales: item.cap,
        }));

        setData(transformedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        height: "100vh",
        
      }}
    >
      <h1 style={{ display: "flex", color: "#000", fontSize: "2rem" , justifyContent: "center", alignItems: "center", margin: "0 auto",  }}>CrypDonuts and MarketCap</h1>
      <PieChartComponent data={data} />
    </div>
  );
};

export default App;
