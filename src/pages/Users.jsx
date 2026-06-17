// Users Module

import ModulePage from "../components/ModulePage";
import { useEffect } from "react";
// import userData from "../data/userData.json";
// import { useDispatch } from "react-redux";
// import { userModuleData } from "../redux/actions/modulesAction";

const Users = () => {
  const usersField = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
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

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(userModuleData(userData));
  // }, [dispatch]);

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
