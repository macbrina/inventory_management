import Spinner from "@/app/_components/Spinner";
import { Box } from "@mui/material";

function loading() {
  return (
    <div className="loader-main">
      <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    </div>
  );
}

export default loading;
