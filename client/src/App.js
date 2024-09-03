import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("form");
  const [data, setData] = useState([]);
  const [formState, setFormState] = useState({
    
    abstractTitle: "",
    
    abstractFile: null,
   
  });

  useEffect(() => {
    if (activeTab === "display") {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      if (result.data.status === "Ok") {
        setData(result.data.data);
      } else {
        alert("Error fetching data: " + result.data.status);
      }
    } catch (error) {
      alert("An unexpected error occurred: " + error.message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(formState).forEach((key) => {
      formData.append(key, formState[key]);
    });

    try {
      const result = await axios.post("http://localhost:5000/upload-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (result.data.status === "Ok") {
        alert("Form submitted successfully!");
        setFormState({
         
          abstractFile: null,
          
        });
        document.querySelector(".formStyle").reset();
      } else {
        alert("Error submitting form: " + result.data.status);
      }
    } catch (error) {
      alert("An unexpected error occurred: " + error.message);
    }
  };

  const renderForm = () => (
    <div className="App">
      <form className="formStyle" onSubmit={submitForm} style={{ color: "#333", backgroundColor: "#f7f9fc", padding: "20px", borderRadius: "8px", boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)" }}>
        <h4 style={{ textAlign: "center", marginBottom: "20px" }}>Registration Form</h4>

        
        {/* Abstract Title */}
        <div>
          <label>Abstract Title:</label>
          <input type="text" name="abstractTitle" required value={formState.abstractTitle} onChange={handleFormChange} style={{ padding: "8px", margin: "8px 0", borderRadius: "4px" }} />
        </div>



        {/* Abstract File */}
        <div>
          <label>Abstract File:</label>
          <input type="file" name="abstractFile" onChange={handleFormChange} style={{ margin: "8px 0" }} />
        </div>

       
        {/* Submit Button */}
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Submit
        </button>
      </form>
    </div>
  );

  const renderTable = () => (
    <div className="App">
      <h4 style={{ textAlign: "center", marginBottom: "20px" }}>Submitted Forms</h4>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            
            <th>Abstract Title</th>
            
            <th>Abstract File</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              
              <td>{item.abstractTitle}</td>
              
              <td>
                {item.abstractFile ? (
                  <a href={`http://localhost:5000/files/${item.abstractFile}`} target="_blank" rel="noopener noreferrer" className="view">View File</a>
                ) : (
                  "No File"
                )}
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  return (
    <div className="App">
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("form")} style={{ padding: "10px 20px", margin: "0 5px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff" }}>
          Form
        </button>
        <button onClick={() => setActiveTab("display")} style={{ padding: "10px 20px", margin: "0 5px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff" }}>
          Display
        </button>
      </nav>
      {activeTab === "form" ? renderForm() : renderTable()}
    </div>
  );
}

export default App;
