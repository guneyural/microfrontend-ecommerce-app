import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="home-layout">{children}</div>
);

export default HomeLayout;
