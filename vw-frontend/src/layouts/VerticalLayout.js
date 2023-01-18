// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";
import { getUserData } from "@utils";

const VerticalLayout = (props) => {
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
  } else if (getUserData() && getUserData().role === "gas station network") {
    navDrawer = navigation["gas station"];
  } else if (getUserData() && getUserData().role === "client") {
    navDrawer = navigation["client"];
  } else if (getUserData() && getUserData().role === "supervisor") {
    navDrawer = navigation["supervisor"];
  }

  console.log(navDrawer, "navDrawer");

  //console.log(getUserData(), 'getUserData()')
  return (
    <Layout menuData={navDrawer} {...props}>
      {props.children}
    </Layout>
  );
};

export default VerticalLayout;
