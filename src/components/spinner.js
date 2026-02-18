import { DNA } from "react-loader-spinner";

const GlobalSpinner = ({ visible = true, height = "80", width = "80" }) => {
  return (
    <div className="d-flex justify-content-center align-items-center w-100 my-4">
      <DNA
        visible={visible}
        height={height}
        width={width}
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default GlobalSpinner;
