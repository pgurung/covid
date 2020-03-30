import React from "react";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTooltip,
  VictoryScatter,
  VictoryLabel,
} from "victory";
import { format } from "date-fns";

const fetcher = async (url) => fetch(url).then((r) => r.json());

export default () => {
  const { data: confirmed } = useSWR(
    "https://api.covid19api.com/live/country/us/status/confirmed",
    fetcher
  );
  const { data: recovered } = useSWR(
    "https://api.covid19api.com/live/country/us/status/recovered",
    fetcher
  );
  const { data: deaths } = useSWR(
    "https://api.covid19api.com/live/country/us/status/deaths",
    fetcher
  );

  const [totalConfirmed, setTotalConfirmed] = React.useState(0);
  const [totalRecovered, setTotalRecovered] = React.useState(0);
  const [totalDeaths, setTotalDeaths] = React.useState(0);
  const [caseHistory, setCaseHistory] = React.useState();

  React.useEffect(() => {
    if (confirmed) {
      const mnCases = confirmed.filter((a) => a.Province === "Minnesota");

      const formattedCases = mnCases.map((c) => ({
        Cases: c.Cases,
        Date: format(new Date(c.Date), "MM/dd/yyyy"),
      }));

      const casesForDisplay = [];
      let currentDate = formattedCases[0].Date;

      for (let i = 1; i < formattedCases.length; i++) {
        if (currentDate !== formattedCases[i].Date) {
          currentDate = formattedCases[i].Date;
          casesForDisplay.push(formattedCases[i - 1]);
        }
      }
      setCaseHistory(casesForDisplay);

      setTotalConfirmed(mnCases[mnCases.length - 1].Cases);
    }
  }, [confirmed]);

  React.useEffect(() => {
    if (recovered) {
      const mnCases = recovered.filter((a) => a.Province === "Minnesota");

      setTotalRecovered(mnCases[mnCases.length - 1].Cases);
    }
  }, [recovered]);

  React.useEffect(() => {
    if (deaths) {
      const mnCases = deaths.filter((a) => a.Province === "Minnesota");

      setTotalDeaths(mnCases[mnCases.length - 1].Cases);
    }
  }, [deaths]);

  return (
    <div>
      <div className="hero">
        <h1 className=" title">MN COVID-19 DATA</h1>
      </div>
      <div className="flex flex-col justify-center mt-4">
        <div className="text-center">
          <div className="text-2xl">Total Confirmed Cases:</div>
          <div className="text-6xl text-orange-500">{totalConfirmed}</div>
          <div className="text-2xl">Recovered:</div>
          <div className="text-6xl text-green-500">{totalRecovered}</div>
          <div className="text-2xl">Deaths:</div>
          <div className="text-6xl text-red-500">{totalDeaths}</div>
          {caseHistory ? (
            <VictoryChart domain={{ y: [0, totalConfirmed + 100] }}>
              <VictoryLabel
                text="Confirmed cases in MN"
                x={225}
                y={30}
                textAnchor="middle"
              />
              <VictoryAxis
                scale={{ x: "time" }}
                tickFormat={(t) => format(new Date(t), "MM/dd")}
              />
              <VictoryAxis dependentAxis />
              <VictoryLine
                style={{
                  data: { stroke: "#300603" },
                  parent: { border: "1px solid #ccc" },
                }}
                data={caseHistory}
                x="Date"
                y="Cases"
                interpolation="natural"
              />
              <VictoryScatter
                style={{
                  data: { fill: "#e01b0d" },
                  labels: { fill: "#e01b0d" },
                }}
                data={caseHistory}
                x="Date"
                y="Cases"
                labels={({ datum }) => `${datum.Date}\nCases:${datum.Cases}`}
                labelComponent={<VictoryTooltip />}
              />
            </VictoryChart>
          ) : null}
        </div>
      </div>
    </div>
  );
};
