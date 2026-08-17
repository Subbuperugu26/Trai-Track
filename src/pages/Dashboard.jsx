import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = "https://script.google.com/macros/s/AKfycbz71jZhlMT22xvPjJ2715yuUL4Wysm4_AlZoB1nKJ333YVbZgMRX8u-laAb2b2T8oDM/exec";

const num = v => {
  const n = parseFloat(String(v ?? "").replace(/,/g,""));
  return Number.isFinite(n) ? n : 0;
};

const images = r => {
  const c = num(r["Count of Images"]);
  if (c > 0) return c;
  const a = num(r["Images Completed From"]), b = num(r["Images Completed To"]);
  return b >= a && a > 0 ? b-a+1 : 0;
};

const records = r => {
  const a = num(r["Records Completed From"]), b = num(r["Records Completed To"]);
  return b >= a && a > 0 ? b-a+1 : 0;
};

function aggregateEmployees(data) {
  const map = {};
  data.forEach(r => {
    const name = String(r["Employee Name"] || "Unknown").trim();
    if (!map[name]) map[name] = {employee:name, batches:new Set(), images:0};
    map[name].batches.add(String(r["Batch No"] || ""));
    map[name].images += images(r);
  });
  return Object.values(map).map(x => ({...x, batches:x.batches.size})).sort((a,b)=>b.images-a.images);
}

function aggregateBatches(data) {
  const map = {};
  data.forEach(r => {
    const batch = String(r["Batch No"] || "Unknown").trim();
    if (!map[batch]) map[batch] = {batch, employee:String(r["Employee Name"]||"-"), laptop:String(r["Laptop Series No"]||"-"), images:0, records:0};
    map[batch].images += images(r);
    map[batch].records += records(r);
  });
  return Object.values(map).sort((a,b)=>b.images-a.images);
}

export default function Dashboard() {
  const [data,setData] = useState([]);
  const [status,setStatus] = useState("Loading...");
  const [employee,setEmployee] = useState("");
  const [laptop,setLaptop] = useState("");
  const [batch,setBatch] = useState("");

  async function load() {
    try {
      setStatus("Loading data...");
      const res = await fetch(API_URL + "?t=" + Date.now());
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "API error");
      setData(Array.isArray(json.data) ? json.data : []);
      setStatus(`Data loaded: ${json.data?.length || 0} rows`);
    } catch(e) { setStatus("Error: " + e.message); }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => data.filter(r =>
    (!employee || String(r["Employee Name"]) === employee) &&
    (!laptop || String(r["Laptop Series No"]) === laptop) &&
    (!batch || String(r["Batch No"]) === batch)
  ), [data,employee,laptop,batch]);

  const employees = useMemo(() => aggregateEmployees(filtered), [filtered]);
  const batches = useMemo(() => aggregateBatches(filtered), [filtered]);
  const top7 = employees.slice(0,7);

  const employeeChart = {
  labels: top7.map(x => x.employee),
  datasets: [{
    label: "Images Completed",
    data: top7.map(x => x.images),
    backgroundColor: "#0798d1",
    borderColor: "#056b9b",
    borderWidth: 1,
    borderRadius: 6
   }]
  };

  const batchChart = {
  labels: batches.map(x => x.batch),
  datasets: [{
    label: "Images Completed",
    data: batches.map(x => x.images),
    backgroundColor: "#0798d1",
    borderColor: "#056b9b",
    borderWidth: 1,
    borderRadius: 6
    }]
  };

  const unique = key => [...new Set(data.map(r=>String(r[key]??"").trim()).filter(Boolean))].sort();

  return (
    <main className="dashboard-container">
      <div className="card">
        <h2>Filters</h2>
        <div className="filters">
          <Select label="Laptop Series No" value={laptop} setValue={setLaptop} options={unique("Laptop Series No")} />
          <Select label="Employee" value={employee} setValue={setEmployee} options={unique("Employee Name")} />
          <Select label="Batch No" value={batch} setValue={setBatch} options={unique("Batch No")} />
        </div>
        <button onClick={load}>REFRESH DATA</button>
        <div className="status">{status}</div>
      </div>

      <div className="stats">
        <Stat title="🏆 Highest Images" value={employees[0]?.images || 0}/>
        <Stat title="🥇 Best Batch" value={batches[0]?.batch || "-"}/>
        <Stat title="👥 Employees" value={employees.length}/>
        <Stat title="📦 Batches" value={batches.length}/>
      </div>

      <div className="charts">
        <div className="chartbox"><h2>📊 Batch-wise Images</h2><div className="chartarea"><Bar data={batchChart} options={{responsive:true,maintainAspectRatio:false}}/></div></div>
        <div className="chartbox"><h2>🏆 Top 7 Employee Ranking</h2><div className="chartarea"><Bar data={employeeChart} options={{indexAxis:"y",responsive:true,maintainAspectRatio:false,plugins:{title:{display:true,text:"Top 7 Employee Ranking"}}}}/></div></div>
      </div>

      <div className="card">
        <h2>Employee Performance — Highest First</h2>
        <div className="tablewrap">
          <table><thead><tr><th>Rank</th><th>Employee</th><th>Batches</th><th>Images</th></tr></thead>
          <tbody>{employees.map((x,i)=><tr key={x.employee}><td>{i+1}</td><td>{x.employee}</td><td>{x.batches}</td><td>{x.images}</td></tr>)}</tbody></table>
        </div>
      </div>

      <div className="card">
        <h2>Batch Performance — Highest First</h2>
        <div className="tablewrap">
          <table><thead><tr><th>Rank</th><th>Batch No</th><th>Employee</th><th>Laptop</th><th>Images</th><th>Records</th></tr></thead>
          <tbody>{batches.map((x,i)=><tr key={x.batch}><td>{i+1}</td><td>{x.batch}</td><td>{x.employee}</td><td>{x.laptop}</td><td>{x.images}</td><td>{x.records}</td></tr>)}</tbody></table>
        </div>
      </div>
    </main>
  );
}

function Select({label,value,setValue,options}) {
  return <div><label>{label}</label><select value={value} onChange={e=>setValue(e.target.value)}><option value="">ALL {label.toUpperCase()}</option>{options.map(v=><option key={v}>{v}</option>)}</select></div>;
}
function Stat({title,value}) { return <div className="stat"><div className="title">{title}</div><div className="value">{value}</div></div>; }