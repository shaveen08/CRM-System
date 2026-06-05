import ModulePage from "../components/ModulePage";

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

const STATUS_OPTION = ["Interested", "Replied", "Positive", "Negative"]

const Activity = () => {
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
