// Lead.jsx
import ModulePage from "../components/ModulePage";

const Lead = () => {
  // Note: tableHead is no longer defined here — Tabel.jsx now generates
  // table columns automatically from the keys of the fetched API data.

  // Form field definitions used by AddModal/EditModal
  const leadFields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "tel" },
    {
      name: "source",
      label: "Source",
      type: "select",
      options: ["Website", "Cold Call", "Google Ads", "Instagram Ads", "LinkedIn", "Referral"],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["Completed", "Confirmed", "Pending", "Dropped"],
    },
    { name: "dealValue", label: "Deal Value", type: "number" },
  ];

  const STATUS_OPTIONS = ["Completed", "Confirmed", "Pending", "Dropped"];
  const API_ENDPOINT = "http://localhost:5000/api/leads";

  return (
    <ModulePage
      title="Customer Leads"
      subtitle="Most recent leads data"
      fields={leadFields}
      module="lead"
      filter={STATUS_OPTIONS}
      endpoint={API_ENDPOINT}
    />
  );
};

export default Lead;
