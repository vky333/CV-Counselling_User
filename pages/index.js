import { useEffect } from "react";

import Header from "../components/AuthPage/global/Header/Header";
import CarouselAuthWrapper from "../components/AuthPage/sections/CarouselAuthWrapper/CarouselAuthWrapper";
import { isAuthenticated } from "../utils/auth";
import { useState } from "@hookstate/core";
import store from "../utils/store";

export default function Home() {

  const globalStore = useState(store);

  useEffect(() => {
    if(isAuthenticated()) {
      window.location.href = "/dashboard";
    }
  }, []);

  useEffect(() => {
    globalStore.pathname.set("/");
  }, []);

  return (
    <>
      <Header />
      <CarouselAuthWrapper />
    </>
  );
}
