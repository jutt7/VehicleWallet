// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/HorizontalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/horizontal";
import { getUserData } from "@utils";

const HorizontalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  let navDrawer = [];
  if (getUserData() && getUserData().role === "admin") {
    navDrawer = navigation["admin"];
  } else if (getUserData() && getUserData().role === "gas station") {
    navDrawer = navigation["gas station"];
  } else if (getUserData() && getUserData().role === "client") {
    navDrawer = navigation["client"];
  }
  return (
    <Layout menuData={navDrawer} {...props}>
      {props.children}
    </Layout>
  );
};

export default HorizontalLayout;
