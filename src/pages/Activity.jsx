import ModulePage from "../components/ModulePage";
import { useEffect } from "react";

// import activityData from "../data/activityData.json";
// import { activityModuleData } from "../redux/actions/modulesAction";
// import { useDispatch } from "react-redux";

const Activity = () => {
  const activityFields = [
    {
      name: "type",
      label: "Type",
      type: "select",
      options: ["Email", "Call", "Meeting"],
    },
    {
      name: "outcome",
      label: "Outcome",
      type: "select",
      options: ["Interested", "Replied", "Positive", "Negative"],
    },
    { name: "notes", label: "Notes", type: "text" },
  ];

  const STATUS_OPTION = ["Interested", "Replied", "Positive", "Negative"];
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(activityModuleData(activityData));
  // }, [dispatch]);
  return (
    <>
      <ModulePage
        module="activity"
        selector={(state) => state.modules}
        dataKey="activityData"
        title="Customer Activity"
        subtitle="Most recent activity"
        fields={activityFields}
        filter={STATUS_OPTION}
      />
    </>
  );
};

export default Activity;
