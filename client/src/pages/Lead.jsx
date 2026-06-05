// Lead.jsx
import ModulePage from "../components/ModulePage";

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

const Lead = () => {
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
      />
    </>
  );
};

export default Lead;
