import { Outlet } from "react-router-dom";

function BlankLayout() {
  // const navigation = useNavigation();

  return (
    <>
      <main>
        {/* {navigation.state === "" && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default BlankLayout;
