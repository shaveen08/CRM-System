import ModulePage from "../components/ModulePage";

const usersField = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tele" },
  {
    name: "department",
    label: "Department",
    type: "select",
    options: ["Sales", "Finance", "HR", "Support", "Management", "Marketing"],
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      "Admin",
      "Accountant",
      "Finance",
      "HR Manager",
      "Support Manager",
      "Sales Executive",
      "Super Admin",
      "Support Agent",
      "Marketing Manager",
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
  },
  {
    name: "access",
    label: "Access",
    type: "select",
    options: [
      "Dashboard",
      "Leads",
      "Contacts",
      "Activities",
      "Appointments",
      "Users",
    ],
  },
];

const Users = () => {
  return (
    <>
      <ModulePage
        module="user"
        selector={(state) => state.modules}
        dataKey="userData"
        title="Users"
        subtitle="Most recent user data"
        fields={usersField}
      />
    </>
  );
};

export default Users;
