// src/customStyles.js
const customStyles = {
  container: (provided) => ({
    ...provided,
    width: 200,
  }),
  control: (provided) => ({
    ...provided,
    minHeight: "20px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "20px",
    padding: "0 6px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "20px",
  }),
};

export default customStyles;
