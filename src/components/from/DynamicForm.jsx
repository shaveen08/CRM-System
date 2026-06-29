const dynamicForm = ({ fields, formData, handleChange }) => {
  return (
    <>
      {fields.map((field) => (
        <DynamicField
          key={field.name}
          field={field}
          value={formData[field.name]}
          onChange={handleChange}
        />
      ))}
    </>
  );
};

export default dynamicForm;
