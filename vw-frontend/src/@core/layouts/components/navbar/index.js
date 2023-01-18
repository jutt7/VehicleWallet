// ** React Imports
import { Fragment } from "react";

// ** Custom Components
import NavbarUser from "./NavbarUser";
import NavbarBookmarks from "./NavbarBookmarks";

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props;

  return (
    <Fragment>
      {console.log(setMenuVisibility, "setMenuVisibility")}
      <div className="bookmark-wrapper d-flex align-items-center">
        <p style={{ color: "white" }}>
          {/* My User
          {localStorage.getItem("myuser") ? localStorage.getItem("myuser") : ""} */}
        </p>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  );
};

export default ThemeNavbar;
