import React from 'react'
import fetch from "isomorphic-unfetch"
import useSWR from "swr"

const fetcher = async (url) => fetch(url).then(r => r.json())
  
export default () => {
  const {data: confirmed} = useSWR("https://api.covid19api.com/live/country/us/status/confirmed", fetcher, {refreshInterval: 600000})
  const {data: recovered} = useSWR("https://api.covid19api.com/live/country/us/status/recovered", fetcher,{refreshInterval: 600000})
  const {data: deaths} = useSWR("https://api.covid19api.com/live/country/us/status/deaths", fetcher,{refreshInterval: 600000})

  const [totalConfirmed, setTotalConfirmed] = React.useState(0);
  const [totalRecovered, setTotalRecovered] = React.useState(0);
  const [totalDeaths, setTotalDeaths] = React.useState(0);

  React.useEffect(()=> {
    if(confirmed){
      const mnCases = confirmed.filter(a => a.Province === "Minnesota"); 

      setTotalConfirmed(mnCases[mnCases.length-1].Cases);
    }
  }, [confirmed]);

  React.useEffect(()=> {
    if(recovered){
      const mnCases = recovered.filter(a => a.Province === "Minnesota"); 

      setTotalRecovered(mnCases[mnCases.length-1].Cases);
    }
  }, [recovered]);

  React.useEffect(()=> {
    if(deaths){
      const mnCases = deaths.filter(a => a.Province === "Minnesota"); 

      setTotalDeaths(mnCases[mnCases.length-1].Cases);
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
      </div>
    </div>

  </div>

  )
}
