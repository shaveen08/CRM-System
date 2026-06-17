// Contacts.jsx
import ModulePage from "../components/ModulePage";

// import { useDispatch } from "react-redux";
// import { contactModuleData } from "../redux/actions/modulesAction";
// import contactData from "../data/contactData.json";
import { useEffect } from "react";

const Contacts = () => {
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
  //   const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(contactModuleData(contactData));
  // }, [dispatch]);

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
