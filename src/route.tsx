import React, { useEffect } from "react";
import { useRoutes, useNavigate, useSearchParams } from "react-router-dom";
import Home from "./home";
import MaterialInfo from "./materialInfo";
import Performance from "./performance";
import Material from "./material";

function Routes() {
  // const [searchParams, setSearchParams] = useSearchParams();
  // let navigate = useNavigate();

  // function Redirect({ to }: any) {
  //   useEffect(() => {
  //     navigate(to);
  //   });
  //   return null;
  // }

  const routes = useRoutes([
    {
      path: "/",
      element: <Home/> ,
      children: [
        {
          path: '/materialInfo',//  
          element: <MaterialInfo />,
        },
        {
          path: '/performance', //  
          element: <Performance />,
        },
        {
          path: '/material', //  
          element: <Material />,
        },
      ]
    },
 
  ]);
  return routes;
}
export default Routes;
