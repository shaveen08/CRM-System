// Contacts.jsx
import ModulePage from "../components/ModulePage";

const contactFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "company", label: "Company", type: "text" },
  { name: "designation", label: "Designation", type: "text" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive", "Blocked"],
  },
];

const STATUS_OPTIONS = ["Active", "Inactive", "Blocked"];

const Contacts = () => {
  return (
    <>
      <ModulePage
        module="contact"
        selector={(state) => state.modules}
        dataKey="contactData"
        title="Customer Contacts"
        subtitle="All saved customer contacts"
        fields={contactFields}
        filter={STATUS_OPTIONS}
      />
    </>
  );
};

export default Contacts;
