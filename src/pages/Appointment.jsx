import React from "react";
import ModulePage from "../components/ModulePage";
import { useEffect } from "react";

// import appointmentData from "../data/appointmentsData.json";
// import { appointmentModuleData } from "../redux/actions/modulesAction";
// import { useDispatch } from "react-redux";

const Appointment = () => {
  const appointmentFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "text" },
    { name: "start_time", label: "Start Time", type: "date" },
    { name: "end_time", label: "End Time", type: "date" },
    {
      name: "location",
      label: "Location",
      type: "select",
      options: ["Zoom Meeting", "Google Meet", "Client Office"],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["Scheduled", "Completed"],
    },
  ];

  const STATUS_OPTIONS = ["Scheduled", "Completed"];

  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(appointmentModuleData(appointmentData));
  // }, [dispatch]);

  return (
    <>
      <ModulePage
        module="appointment"
        selector={(state) => state.modules}
        dataKey="appointmentData"
        title="Appointment Leads"
        subtitle="Most recent appointment leads data"
        fields={appointmentFields}
        filter={STATUS_OPTIONS}
      />
    </>
  );
};

export default Appointment;
