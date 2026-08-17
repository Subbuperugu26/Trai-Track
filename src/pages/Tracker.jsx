import { useEffect, useState } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbz71jZhlMT22xvPjJ2715yuUL4Wysm4_AlZoB1nKJ333YVbZgMRX8u-laAb2b2T8oDM/exec";

const fields = [
  ["batchNo", "Batch No"], ["employeeName", "Employee Name"], ["laptopNo", "Laptop Series No"],
  ["assignedFrom", "Images Assigned From"], ["assignedTo", "Images Assigned To"],
  ["completedFrom", "Images Completed From"], ["completedTo", "Images Completed To"],
  ["recordsFrom", "Records Completed From"], ["recordsTo", "Records Completed To"],
  ["hour1", "9:30 AM - 10:30 AM"], ["hour2", "10:30 AM - 11:30 AM"],
  ["hour3", "11:30 AM - 12:30 PM"], ["hour4", "12:30 PM - 1:30 PM"],
  ["hour5", "1:30 PM - 2:30 PM"], ["hour6", "2:30 PM - 3:30 PM"],
  ["hour7", "3:30 PM - 4:30 PM"], ["hour8", "4:30 PM - 5:30 PM"],
  ["hour9", "5:30 PM - 6:30 PM"], ["breaks", "Breaks In Min"], ["imageCount", "Count of Images"]
];

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export default function Tracker() {
  const [form, setForm] = useState({ date: today(), remarks: "" });
  const [status, setStatus] = useState("");

  useEffect(() => setForm(v => ({...v, date: today()})), []);

  const change = e => setForm({...form, [e.target.name]: e.target.value});

  async function submit(e) {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const data = {...form};
      if (data.date) {
        const [y,m,d] = data.date.split("-");
        data.date = `${d}-${m}-${y}`;
      }
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Unable to save tracker data.");
      setStatus("Tracker data saved successfully.");
      setForm({date: today(), remarks: ""});
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <header className="tracker-header"><h1>Employee Work Tracker</h1><p>Daily productivity entry</p></header>
      <main className="tracker-main">
        <section className="tracker-card">
          <h2>Daily Employee Tracker</h2>
          <form onSubmit={submit}>
            <div className="section">Basic Details</div>
            <div className="grid">
              <Field name="batchNo" label="Batch No" value={form.batchNo} onChange={change} required />
              <Field name="date" label="Date" type="date" value={form.date} onChange={change} required />
              <Field name="employeeName" label="Employee Name" value={form.employeeName} onChange={change} required />
              <Field name="laptopNo" label="Laptop Series No" value={form.laptopNo} onChange={change} required />
            </div>

            <div className="section">Image Assignment</div>
            <div className="grid">
              {fields.slice(3,9).map(([name,label]) => <Field key={name} name={name} label={label} value={form[name]} onChange={change} />)}
            </div>

            <div className="section">Hourly Work</div>
            <div className="grid">
              {fields.slice(9,18).map(([name,label]) => <Field key={name} name={name} label={label} value={form[name]} onChange={change} />)}
            </div>

            <div className="section">Summary</div>
            <div className="grid">
              {fields.slice(18).map(([name,label]) => <Field key={name} name={name} label={label} value={form[name]} onChange={change} />)}
              <div className="full"><label>Remarks</label><textarea name="remarks" value={form.remarks || ""} onChange={change} /></div>
            </div>

            <button id="saveBtn" type="submit">SAVE TRACKER</button>
            {status && <div className={status.startsWith("Error") ? "message error" : "message success"}>{status}</div>}
          </form>
        </section>
      </main>
    </>
  );
}

function Field({name,label,type="text",value="",onChange,required=false}) {
  return <div><label>{label}</label><input name={name} type={type} value={value || ""} onChange={onChange} required={required}/></div>;
}