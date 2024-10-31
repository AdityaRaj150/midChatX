import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Room from "./Room";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "room/:roomId",
    element: <Room />,
  },
]);

export const Web = () => {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
};
