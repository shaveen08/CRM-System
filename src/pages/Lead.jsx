// Lead.jsx
import axios from "axios";
import ModulePage from "../components/ModulePage";
import { useEffect, useState } from "react";

// Lead.jsx
// import { useDispatch } from "react-redux";
// import leadsData from "../data/leadsData.json";
// import { leadModuleData } from "../redux/actions/modulesAction";

const Lead = () => {
  const [apiData, setApiData] = useState([]);

  const leadFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "tel" },
    {
      name: "source",
      label: "Source",
      type: "select",
      options: ["Website", "Instagram", "LinkedIn", "Referral"],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["Completed", "Pending", "Dropped"],
    },
    { name: "dealValue", label: "Deal Value", type: "number" },
  ];

  const STATUS_OPTIONS = ["Completed", "Pending", "Dropped"];
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(leadModuleData(leadsData));
  // }, [dispatch]);

  const fetchLead = async () => {
    try {
      const response = await axios.get(
        "https://fakerapi.it/api/v2/persons?_quantity=10",
      );
      const data = response.data.data;

      const mapApiData = data.map((lead, index) => ({
        id: index + 1,
        name: `${lead.firstname} ${lead.lastname}`,
        email: lead.email,
        phone: lead.phone,
        source: ["Website", "Instagram", "LinkedIn", "Referral"][
          Math.floor(Math.random() * 4)
        ],
        status: ["Completed", "Pending", "Dropped"][
          Math.floor(Math.random() * 3)
        ],
        dealValue: Math.floor(Math.random() * 20000) + 1000,
        createdAt: new Date().toISOString().split("T")[0],
        lastContacted: new Date().toISOString().split("T")[0],
      }));

      setApiData(mapApiData);
    } catch (err) {
      console.error("Error fetching leads:", err);
    }
  };
  useEffect(() => {
    fetchLead();
  }, []);
  console.log(apiData);
  return (
    <>
      <ModulePage
        module="lead"
        selector={(state) => state.modules}
        dataKey="leadsData"
        title="Customer Leads"
        subtitle="Most recent leads data"
        fields={leadFields}
        filter={STATUS_OPTIONS}
        apiData={apiData}
      />
    </>
  );
};

export default Lead;
