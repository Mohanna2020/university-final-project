import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";

import Panel from "./components/panelUser";
import Register from "./components/register";
import Login from "./components/login";
import ValidationEmail from "./components/validationEmail";
import RecoveryPassword from "./components/recoveryPassword";
import CreatePost from "./components/createPost";
import ShowUser from "./components/showUser";
import Setting from "./components/setting";
import Home from "./components/home";
import Welcome from "./components/welcome";
import Error404 from "./components/Error404";

import idUser from "./store/idUser";
import get from "./service/get";
import { useState } from "react";
import Explore from "./components/explore";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(false);
  const ownerId = useRecoilValue(idUser);

  // const {} = useQuery("getSession", () => get.checkSession(ownerId), {
  //   onSuccess: (response) => {
  //     setSession(response?.data?.login);
  //   },
  //   enabled: !!ownerId,
  // });

  return (
    // <QueryClientProvider client={queryClient}>    </QueryClientProvider>
    // {/* <RecoilRoot> */}
    <BrowserRouter>
      <Box component={"section"}>
        {true ? (
          <Routes>
            <Route path={"/"} element={<Welcome />} />
            {/* <Route path={"/"} element={<Login />} /> */}
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route
              path={"/validationEmail/:id"}
              element={<ValidationEmail />}
            />
            <Route path={"/user/:id"} element={<Panel />} />
            <Route path={"/home/:id"} element={<Home />} />
            <Route path={"/users/:id/:userId"} element={<ShowUser />} />
            <Route path={"/createPost/:id"} element={<CreatePost />} />
            <Route path={"/setting/:id"} element={<Setting />} />
            <Route path={"/explore/:id"} element={<Explore />} />
            <Route
              path={"/recoveryPassword/:id"}
              element={<RecoveryPassword />}
            />
            <Route path={"*"} element={<Error404 />} />
          </Routes>
        ) : (
          <Routes>
            <Route path={"/"} element={<Welcome />} />
            {/* <Route path={"/"} element={<Login />} /> */}
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route
              path={"/validationEmail/:id"}
              element={<ValidationEmail />}
            />
            <Route path={"/user/:id"} element={<Navigate to={"/login"} />} />
            <Route path={"/home/:id"} element={<Navigate to={"/login"} />} />
            <Route
              path={"/users/:id/:userId"}
              element={<Navigate to={"/login"} />}
            />
            <Route
              path={"/createPost/:id"}
              element={<Navigate to={"/login"} />}
            />
            <Route path={"/explore/:id"} element={<Navigate to={"/login"} />} />

            <Route path={"/setting/:id"} element={<Navigate to={"/login"} />} />
            <Route
              path={"/recoveryPassword/:id"}
              element={<RecoveryPassword />}
            />
            <Route path={"*"} element={<Error404 />} />
          </Routes>
        )}
      </Box>
    </BrowserRouter>
    // {/* </RecoilRoot> */}
  );
};

export default App;

{
  /* <Routes>
            <Route path={"/"} element={<Welcome />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
            <Route
              path={"/validationEmail/:id"}
              element={<ValidationEmail />}
            />
            <Route
              path={"/user/:id"}
              element={session ? <Panel /> : <Login />}
            />
            <Route
              path={"/home/:id"}
              element={session ? <Home /> : <Login />}
            />
            <Route
              path={"/user/:id/:userId"}
              element={session ? <ShowUser /> : <Login />}
            />
            <Route
              path={"/createPost/:id"}
              element={session ? <CreatePost /> : <Login />}
            />
            <Route
              path={"/setting/:id"}
              element={session ? <Setting /> : <Login />}
            />
            <Route
              path={"/recoveryPassword/:id"}
              element={<RecoveryPassword />}
            />
          </Routes> */
}
