import { createBrowserRouter } from "react-router-dom";
import BlankLayout from "./layouts/Blank";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorPage from "./layouts/ErrorLayout";
import Auth from "./auth/Auth";
import Dashboard from "./dashboard/Dashboard";
import CreateBoard from "./cadastrarPrancha/CreateBoard";
import UpdateBoard from "./editarPrancha/UpdateBoard";
import AuthGuard from "./guards/Auth";
import Cookies from "universal-cookie";
import ReadyToDeliveryBoards from "./readyToDeliveryBoards/ReadyToDeliveryBoards";

const cookies = new Cookies();
const isAuthUser = cookies.get("jwt");

const router = createBrowserRouter([
  {
    path: "/",
    element: <BlankLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Auth /> },
      {
        path: "dashboard",
        element: (
          <AuthGuard isAuthUser={isAuthUser}>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <AuthGuard isAuthUser={isAuthUser}>
                <Dashboard />
              </AuthGuard>
            ),
          },
        ],
      },
      {
        path: "prontaEntrega",
        element: (
          <AuthGuard isAuthUser={isAuthUser}>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <AuthGuard isAuthUser={isAuthUser}>
                <ReadyToDeliveryBoards />
              </AuthGuard>
            ),
          },
          // { path: ":eventId", element: <EventDetailPage /> },
          // { path: "new", element: <NewEventPage /> },
          // { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
      {
        path: "cadastrarPrancha",
        element: (
          <AuthGuard isAuthUser={isAuthUser}>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <AuthGuard isAuthUser={isAuthUser}>
                <CreateBoard />
              </AuthGuard>
            ),
          },
          // { path: ":eventId", element: <EventDetailPage /> },
          // { path: "new", element: <NewEventPage /> },
          // { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
      {
        path: "editarPrancha/:boardId",
        element: (
          <AuthGuard isAuthUser={isAuthUser}>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: (
              <AuthGuard isAuthUser={isAuthUser}>
                <UpdateBoard />
              </AuthGuard>
            ),
          },
          // { path: ":eventId", element: <EventDetailPage /> },
          // { path: "new", element: <NewEventPage /> },
          // { path: ":eventId/edit", element: <EditEventPage /> },
        ],
      },
    ],
  },
]);

export default router;
